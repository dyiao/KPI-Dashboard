const Prediction = require('../models/predictions');
const Status = require('../models/status');
const genericController = require('../controller/genericController');
const predictionController = require("../controller/predictionController");
const statusController = require("../controller/statusController");

/* Exported modules used as the main functions for the performance routes */

/**
 * Returns the upset and warning composition for the upset & warning datasets
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.getBothComposition = async (req, res) => {

    let { flag = 'default' } = req.query;
    let { startDate = '2022-01-01', endDate = '2022-01-27' } = req.query;

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    let flagList = [];

    if (flag == 'default') {
        flagList = predictionController.createKnownPredictionList();
    } else {
        flagList = genericController.createCustomFlagList(flag);
    }

    let result = getPerformanceMongoQuery(flagList, startDate, endDate);

    Promise.all(result)
        .then((performances) => {
            for (let i = 0; i < flagList.length; i++) {
                performances[0 + 2 * i].sort((a, b) => a.createdAt - b.createdAt);
                performances[1 + 2 * i].sort((a, b) => a.createdAt - b.createdAt);
                predictionController.createFlagWarnings(performances[0 + 2 * i], flagList[i], endDate, startDate);
                statusController.createFlagUpsets(performances[1 + 2 * i], flagList[i], endDate, startDate);
            }
            res.json(flagList);
        })
}

/**
 * Returns the upset and warning statistics for the upset & warning datasets
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.getStatistics = async (req, res) => {

    let { flag = "default" } = req.query;
    let { startDate = "2022-01-01", endDate = "2022-01-27" } = req.query;

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    let flagList = [];

    if (flag == "default") {
        flagList = predictionController.createKnownPredictionList();
    } else {
        flagList = genericController.createCustomFlagList(flag);
    }

    let result = getPerformanceMongoQuery(flagList, startDate, endDate);

    Promise.all(result)
        .then((performances) => {
            for (let i = 0; i < flagList.length; i++) {
                performances[0 + 2 * i].sort((a, b) => a.createdAt - b.createdAt);
                performances[1 + 2 * i].sort((a, b) => a.createdAt - b.createdAt);
                predictionController.createFlagWarnings(performances[0 + 2 * i], flagList[i], endDate, startDate);
                statusController.createFlagUpsets(performances[1 + 2 * i], flagList[i], endDate, startDate);
            }

            let MLComparisonArray = generateMLComparisonArray(flagList, startDate);

            for (let i = 0; i < flagList.length; i++) {
                if (flagList[i].warningStatistics) {
                    flagList[i] = {
                        flag: flagList[i].flag,
                        category: flagList[i].category,
                        totalUpsets: flagList[i].upsetComposition.length,
                        totalWarnings: flagList[i].warningComposition.length,
                        ...flagList[i].warningStatistics[0].stats,
                        ...flagList[i].upsetStatistics[0].stats,
                        ...MLComparisonArray[i],
                        totalPredictionTime: flagList[i].warningComposition.reduce((total, curr) => {
                            return total + curr.warningDurationInMin
                        }, 0),
                        totalUpsetTime: flagList[i].upsetComposition.reduce((total, curr) => {
                            return total + curr.upsetDurationInMin
                        }, 0)
                    }
                }
            }
            res.json(flagList);
        })
}

/**
 * Returns the machine learning performance for the upset & warning datasets
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.getMLPerformance = async (req, res) => {

    let { flag = "default" } = req.query;
    let { startDate = "2022-01-01", endDate = "2022-01-27" } = req.query;

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    let flagList = [];

    if (flag == "default") {
        let distinctFlags = await Prediction.distinct("flags.flag");
        flagList = genericController.createDefaultFlagList(distinctFlags.length);
    } else {
        flagList = genericController.createCustomFlagList(flag);
    }

    let result = getPerformanceMongoQuery(flagList, startDate, endDate);

    Promise.all(result)
        .then((performances) => {
            for (let i = 0; i < flagList.length; i++) {
                performances[0 + 2 * i].sort((a, b) => a.createdAt - b.createdAt);
                performances[1 + 2 * i].sort((a, b) => a.createdAt - b.createdAt);
                createFlagWarnings(performances[0 + 2 * i], flagList[i]);
                createFlagUpsets(performances[1 + 2 * i], flagList[i]);
            }

            let MLComparisonArray = generateMLComparisonArray(flagList, startDate);
            res.json(MLComparisonArray);
        })
}

/**
 * Returns the upset and warning statistics for the upset & warning datasets suitable
 * for colour band plot
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.getColourBandStatistics = async (req, res) => {

    let { flag = "default" } = req.query;
    let { startDate = "2022-01-01", endDate = "2022-01-27" } = req.query;

    startDate = new Date(startDate);
    endDate = new Date(endDate);

    let flagList = [];

    if (flag == "default") {
        flagList = predictionController.createKnownPredictionList();
    } else {
        flagList = genericController.createCustomFlagList(flag);
    }

    let result = getPerformanceMongoQuery(flagList, startDate, endDate);

    Promise.all(result)
        .then((performances) => {
            for (let i = 0; i < flagList.length; i++) {
                performances[0 + 2 * i].sort((a, b) => a.createdAt - b.createdAt);
                performances[1 + 2 * i].sort((a, b) => a.createdAt - b.createdAt);
                createColourWarnings(performances[0 + 2 * i], flagList[i]);
                createColourUpsets(performances[1 + 2 * i], flagList[i]);
            }
            let MLComparisonArray = createColourTimeLine(flagList, startDate, endDate);
            res.json(MLComparisonArray);
        })
}

/*Supporting function for the main exported route functions*/

/**
 * Main function to determine machine learning performance parameters (TP, TN, FP, FN)
 * for a respective flag
 * @param   {Array}  flagList  Array list for a specific flag
 * @param   {Number} startDate Start of the time period
 * @returns {Array}            An array containing the performance metrics for a flag
 */
const generateMLComparisonArray = (flagList, startDate) => {

    let acceptableTimeArray = getWarningAcceptableTime();
    let MLPerformanceArray = [];

    for (let flags of acceptableTimeArray) {
        let upsetAndWarningList = flagList.find(element => {
            if (element.flag === flags.flag) {
                return true;
            }
        })
        if (typeof upsetAndWarningList !== 'undefined') {

            let MLFlagObject = generateMLFlagObject(flags);
            let totalWarningDuration = 0;

            totalWarningDuration = findCorrectlyPredictedUpsets(upsetAndWarningList, flags, totalWarningDuration, MLFlagObject);
            findUnexpectedUpsets(upsetAndWarningList, MLFlagObject);
            findFalseAlarms(upsetAndWarningList, MLFlagObject);

            MLFlagObject.avgPredictedWarningDuration = totalWarningDuration / MLFlagObject.predictedUpsets;

            createDailyPredictedUpsetCount(MLFlagObject, startDate);
            createDailyFalseAlarmCount(MLFlagObject, startDate);
            createDailyUnexpectedUpsetCount(MLFlagObject, startDate);

            MLPerformanceArray.push(MLFlagObject);
        }
    }
    return MLPerformanceArray;
}

/**
 * Generate an empty machine learning flag object
 * @param   {Array}  flag Array list for a specific flag
 * @returns {Object}      Empty machine learning flag object
 */
const generateMLFlagObject = (flags) => {

    let MLFlagObject = {};
    MLFlagObject.flag = flags.flag;
    MLFlagObject.predictedUpsets = 0;
    MLFlagObject.falseAlarms = 0;
    MLFlagObject.unexpectedUpsets = 0;
    MLFlagObject.predictedUpsetsDates = [];
    MLFlagObject.falseAlarmsDates = [];
    MLFlagObject.unexpectedUpsetsDates = [];
    return MLFlagObject;
}

/**
 * Finds and adds correctly predicted upsets
 * @param   {Array}  upsetAndWarningList  Cumulative warning and upsets list
 * @param   {Array}  flags                Array for a specific flag
 * @param   {Number} totalWarningDuration Total warning duration in minutes
 * @param   {Object} MLFlagObject         Machine learning flag object
 * @returns {Number}                      Total warning duration for average successful prediction duration calculation
 */
const findCorrectlyPredictedUpsets = (upsetAndWarningList, flags, totalWarningDuration, MLFlagObject) => {

    for (let upset of upsetAndWarningList.upsetComposition) {
        for (let warning of upsetAndWarningList.warningComposition) {
            let minimumAcceptedTime = new Date(upset.beginTime - flags.minRange);
            let maximumAcceptedTime = new Date(upset.beginTime - flags.maxRange);
            if (warning.endTime >= maximumAcceptedTime && warning.endTime < minimumAcceptedTime) {
                warning.warningPredictCounter++;
                upset.upsetPredictCounter++;
                MLFlagObject.predictedUpsets++;
                totalWarningDuration += warning.warningDurationInMin;
                MLFlagObject.predictedUpsetsDates.push(upset.beginTime);
            }
        }
    }
    return totalWarningDuration;
}

/**
 * Finds and adds unexpected upsets
 * @param {Array} upsetAndWarningList Cumulative warning and upsets list
 * @param {Object} MLFlagObject       Machine learning flag object
 */
const findUnexpectedUpsets = (upsetAndWarningList, MLFlagObject) => {

    for (let upset of upsetAndWarningList.upsetComposition) {
        if (upset.upsetPredictCounter < 1) {
            MLFlagObject.unexpectedUpsets++;
            MLFlagObject.unexpectedUpsetsDates.push(upset.beginTime);
        }
    }
}

/**
 * Finds and adds false alarms
 * @param {Array}  upsetAndWarningList Cumulative warning and upsets list
 * @param {Object} MLFlagObject        Machine learning flag object
 */
const findFalseAlarms = (upsetAndWarningList, MLFlagObject) => {

    for (let warning of upsetAndWarningList.warningComposition) {
        if (warning.warningPredictCounter < 1) {
            MLFlagObject.falseAlarms++;
            MLFlagObject.falseAlarmsDates.push(warning.beginTime);
        }
    }
}

/**
 * Creates the upset composition of a flag
 * @param   {Array}  status      Upset array for specific flag
 * @param   {Object} currentFlag Current flag object
 * @returns {Object}             currentFlag parameter with upsetComposition fully updated
 */
const createFlagUpsets = (status, currentFlag) => {

    let beginTime = status[0]?.createdAt;
    let upsetCount = 0;
    let id = 0;
    let totalUpsetTime = 0;
    let totalNormalTime = 0;
    currentFlag.upsetComposition = [];

    for (let i = 0; i < status.length; i++) {
        if (genericController.isWithinLengthAndTime(status, i)) {

            let upsetComp = {};
            upsetComp.upsetId = id;
            upsetComp.beginTime = beginTime;
            upsetComp.endTime = status[i].createdAt;
            upsetComp.upsetDurationInMin = (upsetComp.endTime - upsetComp.beginTime) / 60000;

            if (id > 0) {
                upsetComp.currentNormalPeriod = (upsetComp.beginTime - currentFlag.upsetComposition[id - 1].endTime) / 60000;
                totalNormalTime += upsetComp.currentNormalPeriod;
            }

            upsetComp.upsetPredictCounter = 0;
            currentFlag.upsetComposition.push(upsetComp);
            beginTime = status[i + 1]?.createdAt;
            id++;
            upsetCount++;
            totalUpsetTime += upsetComp.upsetDurationInMin;
        }
    }
    return currentFlag;
}

/**
 * Creates the warning composition of a flag
 * @param   {Array}  predictions Warning array for specific flag
 * @param   {Object} currentFlag Current flag object
 * @returns {Object}             currentFlag parameter with warningComposition fully updated
 */
const createFlagWarnings = (predictions, currentFlag) => {

    let beginTime = predictions[0]?.createdAt;
    let warningCount = 0;
    let id = 0;
    let totalWarningTime = 0;
    let totalNormalTime = 0;
    currentFlag.warningComposition = [];

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
        }
    }
    return currentFlag;
}

/**
 * Creates the warning component for colour band plot
 * @param   {Array}  predictions Warning array for specific flag
 * @param   {Object} currentFlag Current flag object
 * @returns {Object}             currentFlag parameter with warningComposition fully updated
 */
const createColourWarnings = (predictions, currentFlag) => {

    currentFlag.warningComposition = [];

    for (let i = 0; i < predictions.length; i++) {
        let tempObject = {};
        tempObject.status = predictions[i].flags.status;
        tempObject.beginTime = predictions[i].createdAt;
        currentFlag.warningComposition.push(tempObject);
    }
    return currentFlag;
}

/**
 * Creates the upset component for colour band plot
 * @param   {Array}  status      Upset array for specific flag
 * @param   {Object} currentFlag Current flag object
 * @returns {Object}             currentFlag parameter with upsetComposition fully updated
 */
const createColourUpsets = (status, currentFlag) => {

    currentFlag.upsetComposition = [];

    for (let i = 0; i < status.length; i++) {
        let tempObject = {};
        tempObject.status = status[i].flags.name;
        tempObject.beginTime = status[i].createdAt;
        currentFlag.upsetComposition.push(tempObject);
    }
    return currentFlag;
}

/**
 * Creates the warning, upset, and normal composition for a specific flag and colour band plot
 * @param   {Object} flagList  Performance array for a specific flag
 * @param   {Date}   startDate Start of time period
 * @param   {Date}   endDate   End of time period
 * @returns {Array}            An array status composition for the colour band plot
 */
const createColourTimeLine = (flagList, startDate, endDate) => {
    let finalArray = [];
    for (let flag of flagList) {
        let flagObject = {};
        flagObject.flag = flag.flag;
        flagObject.timeLineArray = [];
        let tempCombinedObject = [];
        for (let warning of flag.warningComposition) {
            let warningInterval = {};
            warningInterval.status = 'WARNING';
            warningInterval.beginTime = warning.beginTime;
            warningInterval.duration = 5;
            warningInterval.count = 1;
            tempCombinedObject.push(warningInterval);
        }
        for (let upset of flag.upsetComposition) {
            let upsetInterval = {};
            upsetInterval.status = 'UPSET';
            upsetInterval.beginTime = upset.beginTime;
            upsetInterval.duration = 5;
            upsetInterval.count = 1;
            tempCombinedObject.push(upsetInterval);
        }

        tempCombinedObject.sort((a, b) => a.beginTime - b.beginTime);

        let currentTime = startDate;
        let i = 0;
        while (currentTime < endDate) {
            if (!tempCombinedObject[i] || tempCombinedObject[i].beginTime.getTime() !== currentTime.getTime()) {
                let normalInterval = {};
                normalInterval.status = 'NORMAL';
                normalInterval.beginTime = currentTime;
                normalInterval.duration = 5;
                normalInterval.count = 1;
                tempCombinedObject.splice(i, 0, normalInterval);
            }
            currentTime = new Date(currentTime.getTime() + 300000);
            i++;
        }
        finalArray.push(tempCombinedObject);
    }
    return finalArray;
}

/**
 * Universal query to retrieve the required upset & prediction dataset from MongoDB
 * @param   {Object}  flagList  Array list containing the relevant upset & prediction flag
 * @param   {Date}    startDate Start date of the timeline
 * @param   {Date}    endDate   End date of the timeline
 * @returns {Promise}           A promise containing the query for mongoDB
 */
const getPerformanceMongoQuery = (flagList, startDate, endDate) => {

    const result = [];

    for (let currentFlag of flagList) {

        const upsetAggregationOption = [
            {
                $unwind: '$flags'
            },
            {
                $match: {
                    'flags.name': 'UPSET',
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    'flags.category': 'flag ' + currentFlag.flag
                }
            },
            {
                $project: {
                    createdAt: 1,
                    'flags.category': 1,
                    'flags.name': 1
                }
            }
        ]

        const warningAggregationOption = [
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
                    createdAt: 1,
                    'flags.flag': 1,
                    'flags.status': 1,
                }
            }
        ]

        result.push(Prediction.aggregate(warningAggregationOption).exec());
        result.push(Status.aggregate(upsetAggregationOption).exec());
    }

    return result;
}

/**
 * Creates the daily predicted upset count array
 * @param {Array} currentFlag Array list containing the relevant upset & prediction flag
 * @param {Date}  startDate   Start date of the timeline
 */
const createDailyPredictedUpsetCount = (currentFlag, startDate) => {

    let currentDate = new Date(startDate);
    let i = 0;
    let predictedUpsetCount = 0;
    currentFlag.dailyPredictedUpsets = [];

    while (i < currentFlag.predictedUpsetsDates.length) {
        if ((new Date(currentFlag.predictedUpsetsDates[i]) - currentDate) > 86400000) {
            if (predictedUpsetCount > 0) {
                let dailystats = {};
                dailystats.date = currentDate.toISOString();
                dailystats.predictedUpsetCount = predictedUpsetCount;
                currentFlag.dailyPredictedUpsets.push(dailystats);
                predictedUpsetCount = 0;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        } else if (i == currentFlag.predictedUpsetsDates.length - 1) {
            predictedUpsetCount++;
            let dailystats = {};
            dailystats.date = currentDate.toISOString();
            dailystats.predictedUpsetCount = predictedUpsetCount;
            currentFlag.dailyPredictedUpsets.push(dailystats);
            i++;
        } else {
            predictedUpsetCount++;
            i++;
        }

    }
}

/**
 * Creates the daily false alarm upset count array
 * @param {Array} currentFlag Array list containing the relevant upset & prediction flag
 * @param {Date}  startDate   Start date of the timeline
 */
const createDailyFalseAlarmCount = (currentFlag, startDate) => {

    let currentDate = new Date(startDate);
    let i = 0;
    let falseAlarmCount = 0;
    currentFlag.dailyFalseAlarm = [];

    while (i < currentFlag.falseAlarmsDates.length) {
        if ((new Date(currentFlag.falseAlarmsDates[i]) - currentDate) > 86400000) {
            if (falseAlarmCount > 0) {
                let dailystats = {};
                dailystats.date = currentDate.toISOString();
                dailystats.falseAlarmCount = falseAlarmCount;
                currentFlag.dailyFalseAlarm.push(dailystats);
                falseAlarmCount = 0;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        } else if (i == currentFlag.falseAlarmsDates.length - 1) {
            falseAlarmCount++;
            let dailystats = {};
            dailystats.date = currentDate.toISOString();
            dailystats.falseAlarmCount = falseAlarmCount;
            currentFlag.dailyFalseAlarm.push(dailystats);
            i++;
        } else {
            falseAlarmCount++;
            i++;
        }

    }
}

/**
 * Creates the daily unexpected upset count array
 * @param {Array} currentFlag Array list containing the relevant upset & prediction flag
 * @param {Date}  startDate   Start date of the timeline
 */
const createDailyUnexpectedUpsetCount = (currentFlag, startDate) => {

    let currentDate = new Date(startDate);
    let i = 0;
    let unexpectedUpsetCount = 0;
    currentFlag.dailyUnexpectedUpsets = [];

    while (i < currentFlag.unexpectedUpsetsDates.length) {
        if ((new Date(currentFlag.unexpectedUpsetsDates[i]) - currentDate) > 86400000) {
            if (unexpectedUpsetCount > 0) {
                let dailystats = {};
                dailystats.date = currentDate.toISOString();
                dailystats.unexpectedUpsetCount = unexpectedUpsetCount;
                currentFlag.dailyUnexpectedUpsets.push(dailystats);
                unexpectedUpsetCount = 0;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        } else if (i == currentFlag.unexpectedUpsetsDates.length - 1) {
            unexpectedUpsetCount++;
            let dailystats = {};
            dailystats.date = currentDate.toISOString();
            dailystats.unexpectedUpsetCount = unexpectedUpsetCount;
            currentFlag.dailyUnexpectedUpsets.push(dailystats);
            i++;
        } else {
            unexpectedUpsetCount++;
            i++;
        }

    }
}

/**
 * Retrieves list of known warning acceptable times
 * @returns An array of known warning acceptable times for ML comparison
 */
const getWarningAcceptableTime = () => {
    return ([
        {
            flag: 0,
            //30 mins before upset
            minRange: 0,
            maxRange: 1800000,
            successfullyPredictedUpsets: 0,
            onlyUpsets: 0,
            onlywarning: 0
        }, {
            flag: 1,
            //12 hours before upset
            minRange: 0,
            maxRange: 43200000,
            successfullyPredictedUpsets: 0,
            onlyUpsets: 0,
            onlywarning: 0
        }, {
            flag: 2,
            //12 hours before upset
            minRange: 0,
            maxRange: 43200000,
            successfullyPredictedUpsets: 0,
            onlyUpsets: 0,
            onlywarning: 0
        }, {
            flag: 3,
            //30-90 mins before upset
            minRange: 1800000,
            maxRange: 5400000,
            successfullyPredictedUpsets: 0,
            onlyUpsets: 0,
            onlywarning: 0
        }, {
            flag: 4,
            //12 hours before upset
            minRange: 0,
            maxRange: 43200000,
            successfullyPredictedUpsets: 0,
            onlyUpsets: 0,
            onlywarning: 0
        }, {
            flag: 5,
            //12 hours before upset
            minRange: 0,
            maxRange: 43200000,
            successfullyPredictedUpsets: 0,
            onlyUpsets: 0,
            onlywarning: 0
        }, {
            flag: 6,
            //30-90 mins before upset
            minRange: 1800000,
            maxRange: 5400000,
            successfullyPredictedUpsets: 0,
            onlyUpsets: 0,
            onlywarning: 0
        }, {
            flag: 24,
            //30-60 mins before upset
            minRange: 1800000,
            maxRange: 3600000,
            successfullyPredictedUpsets: 0,
            onlyUpsets: 0,
            onlywarning: 0
        }, {
            flag: 26,
            //15-45 mins before upset
            minRange: 900000,
            maxRange: 2700000,
            successfullyPredictedUpsets: 0,
            onlyUpsets: 0,
            onlywarning: 0
        }, {
            flag: 37,
            //20-50 mins before upset
            minRange: 1200000,
            maxRange: 3000000,
            successfullyPredictedUpsets: 0,
            onlyUpsets: 0,
            onlywarning: 0
        }, {
            flag: 62,
            //60 mins before upset
            minRange: 0,
            maxRange: 3600000,
            successfullyPredictedUpsets: 0,
            onlyUpsets: 0,
            onlywarning: 0
        }
    ])
};