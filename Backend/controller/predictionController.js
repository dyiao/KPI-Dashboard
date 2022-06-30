const { model } = require('mongoose');
const genericController = require('../controller/genericController');
const Prediction = require('../models/predictions')

/* Exported modules used as the main functions for the predictions routes */

/**
 * Returns the flag warning composition statistics suitable for React Table formatting
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.getFlagComposition = async (req, res) => {

    let { flag = 'default' } = req.query;
    let { startDate = '2022-01-01', endDate = '2022-01-27' } = req.query;

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    let flagList = [];

    if (flag == 'default') {
        flagList = this.createKnownPredictionList()
    } else {
        flagList = genericController.createCustomFlagList(flag);
    }

    let result = getPredictionMongoQuery(flagList, startDate, endDate);
    
    Promise.all(result)
        .then((predictions) => {
            for (let i = 0; i < flagList.length; i++) {
                if (predictions[i].length > 0) {
                    predictions[i].sort((a, b) => a.createdAt - b.createdAt);
                    this.createFlagWarnings(predictions[i], flagList[i], endDate, startDate);
                }

            }
            res.json(flagList);
        })
}

/**
 * Returns the flag warning composition statistics suitable for React Table formatting
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.getFlagStatistics = async (req, res) => {

    let { flag = 'default' } = req.query;
    let { startDate = '2022-01-01', endDate = '2022-01-27' } = req.query;

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    let flagList = [];

    if (flag == 'default') {
        flagList = this.createKnownPredictionList();
    } else {
        flagList = genericController.createCustomFlagList(flag);
    }

    let result = getPredictionMongoQuery(flagList, startDate, endDate);

    Promise.all(result)
        .then((predictions) => {
            for (let i = 0; i < flagList.length; i++) {
                if (predictions[i].length > 0) {
                    predictions[i].sort((a, b) => a.createdAt - b.createdAt);
                    this.createFlagWarnings(predictions[i], flagList[i], endDate, startDate);
                }

            }
            for (let i = 0; i < flagList.length; i++) {
                if (flagList[i].warningStatistics) {
                    flagList[i] = {
                        flag: flagList[i].flag,
                        category: flagList[i].category,
                        totalWarnings: flagList[i].warningComposition.length,
                        ...flagList[i].warningStatistics[0].stats
                    }
                }
            }
            res.json(flagList);
        })
}

/**
 * Returns the daily error for a specific flag
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.getDailyErrors = async (req, res) => {

    let { flag = 'default' } = req.query;
    let { startDate = '2022-01-01', endDate = '2022-01-27' } = req.query;

    startDate = new Date(startDate);
    endDate = new Date(endDate);
    let flagList = [];

    if (flag == 'default') {
        flagList = this.createKnownPredictionList();
    } else {
        flagList = genericController.createCustomFlagList(flag);
    }

    let result = getPredictionErrorMongoQuery(flagList, startDate, endDate);

    Promise.all(result)
        .then((predictions) => {
            for (let i = 0; i < flagList.length; i++) {
                predictions[i].sort((a, b) => a.createdAt - b.createdAt);
                createErrorCount(predictions[i], flagList[i], endDate, startDate);
            }
            res.json(flagList);
        })
}

/**
 * Returns the warning composition for flag(s)
 * @param {Array}  predictions Queried warning list for a specific flag
 * @param {Object} currentFlag Current flag object of the result array
 * @param {Date}   endDate     End of time period
 * @param {Object} startDate   Start of time period
 */
module.exports.createFlagWarnings = (predictions, currentFlag, endDate, startDate) => {

    let beginTime = predictions[0]?.createdAt;
    let warningCount = 0;
    let id = 0;
    let totalWarningTime = 0;
    let totalNormalTime = 0;

    let stats = {};
    stats.maxWarningDuration = 0;
    stats.minWarningDuration = 999999;
    stats.maxNormalTime = 0;
    stats.minNormalTime = 999999;

    currentFlag.warningComposition = [];
    currentFlag.warningStatistics = [];

    for (let i = 0; i < predictions.length; i++) {

        if (genericController.isWithinLengthAndTime(predictions, i)) {

            let warningComp = {};

            warningComp.warningId = id;
            warningComp.beginTime = beginTime;
            warningComp.endTime = predictions[i].createdAt;
            warningComp.warningDurationInMin = (warningComp.endTime - warningComp.beginTime) / 60000;

            if (id > 0) {
                warningComp.currentNormalPeriod = (warningComp.beginTime - currentFlag.warningComposition[id - 1].endTime) / 60000;
                totalNormalTime += warningComp.currentNormalPeriod;
            }

            warningComp.warningPredictCounter = 0;
            currentFlag.warningComposition.push(warningComp);
            beginTime = predictions[i + 1]?.createdAt;
            id++;
            warningCount++;
            totalWarningTime += warningComp.warningDurationInMin;

            updateMinMaxStats(stats, warningComp);
        }
    }
    createDailyFlagWarningCount(currentFlag, startDate);
    createWarningStatistics(currentFlag, stats,
        warningCount, endDate, startDate,
        totalWarningTime, totalNormalTime);
    return currentFlag;
}

/**
 * Returns an array of the flags with corresponding category
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.createKnownPredictionList = () => {
    return [
        { flag: 0, category: 0 },
        { flag: 1, category: 1 },
        { flag: 2, category: 1 },
        { flag: 3, category: 1 },
        { flag: 4, category: 3 },
        { flag: 5, category: 3 },
        { flag: 6, category: 3 },
        { flag: 24, category: 3 },
        { flag: 26, category: 7 },
        { flag: 37, category: 1 },
        { flag: 62, category: 12 }
    ]
}

/* Supporting Functions - functions called within the controller */

const getPredictionMongoQuery = (flagList, startDate, endDate) => {

    const result = [];

    for (let currentFlag of flagList) {
        const aggregationOption = [
            {
                $unwind: '$flags'
            },
            {
                $match: {
                    'flags.status': 'WARNING',
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    'flags.flag': 'flag ' + currentFlag.flag
                }
            },
            {
                $project: {
                    category: 1,
                    createdAt: 1,
                    'flags.flag': 1,
                    'flags.status': 1,
                    'flags.onset': 1
                }
            }
        ]
        result.push(Prediction.aggregate(aggregationOption).exec());
    }
    return result;
}

const getPredictionErrorMongoQuery = (flagList, startDate, endDate) => {

    const result = [];

    for (let currentFlag of flagList) {
        const aggregationOption = [
            {
                $unwind: '$flags'
            }, {
                $match: {
                    'flags.error': {
                        $ne: ''
                    },
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    'flags.flag': 'flag ' + currentFlag.flag
                }
            },
            {
                $project: {
                    categories: 1,
                    createdAt: 1,
                    'flags.flag': 1,
                    'flags.error': 1
                }
            }
        ]
        result.push(Prediction.aggregate(aggregationOption).exec());
    }
    return result;
}

const createErrorCount = (predictions, currentFlag, endDate, startDate) => {

    currentFlag.totalErrorCount = 0;
    currentFlag.errorComposition = [];

    for (let i = 0; i < predictions.length; i++) {
        let errorComp = {};
        errorComp.errorId = i;
        errorComp.errorTime = predictions[i].createdAt;
        errorComp.errorMessage = predictions[i].flags.error;
        currentFlag.totalErrorCount++;
        currentFlag.errorComposition.push(errorComp);
    }
    createDailyErrorCount(currentFlag, startDate);
}

const createWarningStatistics = (currentFlag, stats,
    warningCount, endDate, startDate, totalWarningTime,
    totalNormalTime) => {

    stats.maxWarningPerDay = Math.max.apply(Math, currentFlag.dailyWarnings.map(function (ans) { return ans.warningCount }));
    stats.avgWarningDuration = totalWarningTime / warningCount;
    stats.avgNormalTime = totalNormalTime / warningCount;
    stats.avgWarningPerDay = warningCount / ((endDate - startDate) / 86400000);
    stats.totalDays = ((endDate - startDate) / 86400000);
    stats.totalWarnings = warningCount;

    currentFlag.warningStatistics.push({ stats });
};

const createDailyFlagWarningCount = (currentFlag, startDate) => {
    let currentDate = new Date(startDate);
    let i = 0;
    let warningCount = 0;
    currentFlag.dailyWarnings = [];

    while (i < currentFlag.warningComposition.length) {
        if ((currentFlag.warningComposition[i].beginTime - currentDate) > 86400000) {
            if (warningCount > 0) {
                let dailystats = {};
                dailystats.date = currentDate.toISOString();
                dailystats.warningCount = warningCount;
                currentFlag.dailyWarnings.push(dailystats);
                warningCount = 0;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        } else if (i == currentFlag.warningComposition.length - 1) {
            warningCount++;
            let dailystats = {};
            dailystats.date = currentDate.toISOString();
            dailystats.warningCount = warningCount;
            currentFlag.dailyWarnings.push(dailystats);
            i++;
        } else {
            warningCount++;
            i++;
        }

    }
}

const updateMinMaxStats = (minMaxStats, warningComp) => {
    if (minMaxStats.maxWarningDuration < warningComp.warningDurationInMin) {
        minMaxStats.maxWarningDuration = warningComp.warningDurationInMin;
    }
    if (minMaxStats.minWarningDuration > warningComp.warningDurationInMin) {
        minMaxStats.minWarningDuration = warningComp.warningDurationInMin;
    }
    if (minMaxStats.maxNormalTime < warningComp.currentNormalPeriod) {
        minMaxStats.maxNormalTime = warningComp.currentNormalPeriod;
    }
    if (minMaxStats.minNormalTime > warningComp.currentNormalPeriod) {
        minMaxStats.minNormalTime = warningComp.currentNormalPeriod;
    }
}

const createDailyErrorCount = (currentFlag, startDate) => {

    let currentDate = new Date(startDate);
    let errorCount = 0;
    let i = 0;
    currentFlag.dailyErrors = [];

    while (i < currentFlag.errorComposition.length) {
        if ((currentFlag.errorComposition[i].errorTime - currentDate) > 86400000) {
            if (errorCount > 0) {
                let dailystats = {};
                dailystats.date = currentDate.toISOString();
                dailystats.errorCount = errorCount;
                currentFlag.dailyErrors.push(dailystats);
                errorCount = 0;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        } else if (i == currentFlag.errorComposition.length - 1) {
            errorCount++;
            let dailystats = {};
            dailystats.date = currentDate.toISOString();
            dailystats.errorCount = errorCount;
            currentFlag.dailyErrors.push(dailystats);
            i++;
        } else {
            errorCount++;
            i++;
        }
    }
}