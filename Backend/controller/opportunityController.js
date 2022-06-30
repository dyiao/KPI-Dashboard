const genericController = require('../controller/genericController')
const Opportunity = require('../models/opportunities')

/* Exported modules used as the main functions for the opportunity routes */

/**
 * Returns the opportunity statistics suitable for React Table formatting
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.getOppStatistics = async (req, res) => {

  let { flag = 'default' } = req.query;
  let { startDate = '2022-01-01', endDate = '2022-01-27' } = req.query;
  let oppList;

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  if (flag === 'default') {
    let distinctOpps = await Opportunity.distinct('opp_type');
    oppList = genericController.createDefaultOppList(distinctOpps);
  } else {
    oppList = genericController.createCustomOppList(flag);
  }

  let result = getOppMongoQuery(oppList, startDate, endDate);

  Promise.all(result)
    .then((opportunities) => {
      for (let i = 0; i < oppList.length; i++) {
        if (opportunities[i].length > 0) {
          createFlagOpp(opportunities[i], oppList[i], endDate, startDate);
        }
      }
      for (let i = 0; i < oppList.length; i++) {
        if (oppList[i].oppStatistics) {
          oppList[i] = {
            opp_type: oppList[i].opp_type,
            totalOpps: oppList[i].oppComposition.length,
            ...oppList[i].oppStatistics[0].stats
          }
        }
      }
      res.json(oppList);
    })
}

/**
 * Returns similar information as the getOppStatistics(), with the addition
 * of daily opportunity counts.
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.getOppFlag = async (req, res) => {

  let { flag = 'default' } = req.query;
  let { startDate = '2022-01-01', endDate = '2022-01-27' } = req.query;
  let oppList;

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  if (flag === 'default') {
    let distinctOpps = await Opportunity.distinct('opp_type');
    oppList = genericController.createDefaultOppList(distinctOpps);
  } else {
    oppList = genericController.createCustomOppList(flag);
  }

  let result = getOppMongoQuery(oppList, startDate, endDate);

  Promise.all(result)
    .then((opportunities) => {
      for (let i = 0; i < oppList.length; i++) {
        if (opportunities[i].length > 0) {
          createFlagOpp(opportunities[i], oppList[i], endDate, startDate);
        }
      }
      for (let i = 0; i < oppList.length; i++) {
        if (oppList[i].oppStatistics) {
          oppList[i] = {
            opp_type: oppList[i].opp_type,
            totalOpps: oppList[i].oppComposition.length,
            ...oppList[i].oppStatistics[0].stats,
            dailyOpps: oppList[i].dailyOpps,
          }
        }
      }
      res.json(oppList);
    })
}

/**
 * Returns an array of objects containing the status type, when the status was
 * recorded and the status duration. No grouping applied as the data must be
 * seperated for the colour band statistics to work.
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.getOppColourBand = async (req, res) => {

  let { flag = 'default' } = req.query;
  let { startDate = '2022-01-01', endDate = '2022-01-27' } = req.query;
  let oppList;
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  if (flag === 'default') {
    let distinctOpps = await Opportunity.distinct('opp_type');
    oppList = genericController.createDefaultOppList(distinctOpps);
  } else {
    oppList = genericController.createCustomOppList(flag);
  }

  let result = getOppMongoQuery(oppList, startDate, endDate);

  Promise.all(result)
    .then((opportunities) => {
      let colourBandTimeline;
      for (let i = 0; i < oppList.length; i++) {
        if (opportunities[i].length > 0) {
          createColourOpps(opportunities[i], oppList[i]);
          colourBandTimeline = createColourTimeLine(oppList[i], startDate, endDate);
        }

      }
      res.json(colourBandTimeline);
    })
}

/**
 * Returns a simplified array with the different opp types and their respective
 * total count for a given time period.
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.getOppBarChart = async (req, res) => {

  let { flag = 'default' } = req.query;
  let { startDate = '2022-01-01', endDate = '2022-01-27' } = req.query;
  let oppList;
  
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  if (flag === 'default') {
    let distinctOpps = await Opportunity.distinct('opp_type');
    oppList = genericController.createDefaultOppList(distinctOpps);
  } else {
    oppList = genericController.createCustomOppList(flag);
  }

  let result = getOppMongoQuery(oppList, startDate, endDate);

  Promise.all(result).then(opportunity => {
    for (let i = 0; i < oppList.length; i++) {
      createOppCount( opportunity[i], oppList[i],)
    }
    res.json(oppList)
  })
}

/*Supporting function for the main exported route functions*/

/**
 * Creates the simplified array for bar chart statistics
 * @param   {Array} opportunity Queried array for a specific opp type and time range
 * @param   {Array} currentOpp  Tabulated array for the same opp type of the opportunity
 *                              parameter, records the results
 * @returns {Array}             An array containing a specific opportunity type total count
 *                              and total duration in minutes
 */
const createOppCount = (opportunity, currentOpp) => {

  let id = 0
  let totalOppTime = 0
  currentOpp.TotalOpportunities = 0

  for (let i = 0; i < opportunity.length; i++) {
    
    if (genericController.isWithinLengthAndTimeOpp(opportunity, i)) {
      let oppComp = {}
      id++
      currentOpp.TotalOpportunities++
      totalOppTime += oppComp.oppDurationInMin
    }
  }
  return currentOpp
}

/**
 * Universal query to retrieve the required opportunity dataset from MongoDB
 * @param   {Array}   oppList   Opportunity list containing the relevant opportunities
 * @param   {Date}    startDate Start date of the timeline
 * @param   {Date}    endDate   End date of the timeline
 * @returns {Promise}           A promise containing the query for mongoDB
 */
const getOppMongoQuery = (oppList, startDate, endDate) => {

  const result = [];

  for (let currentOpp of oppList) {
    const aggregationOption = [
      {
        $match: {
          state: {
            $eq: 'Opportunity'
          },
          updatedAt: {
            $gte: startDate,
            $lte: endDate
          },
          opp_type: {
            $eq: currentOpp.opp_type
          }
        }
      },
      {
        $project: {
          state: 1,
          updatedAt: 1,
          opp_type: 1
        }
      }
    ]
    result.push(Opportunity.aggregate(aggregationOption).exec());
  }
  return result;
}

/**
 * Creates the individual opportunity statistics, daily opportunity count, and overall statistics for each opportunity types
 * @param   {Array} opportunities Opportunity list containing the relevant opportunities with queried dataset
 * @param   {Date}  currentOpp    Current opportunity type
 * @param   {Date}  startDate     Start date of the timeline
 * @param   {Date}  endDate       End date of the timeline
 * @returns {Array}               An array with statistics for each opportunity type
 */
const createFlagOpp = (opportunities, currentOpp, endDate, startDate) => {

  let beginTime = opportunities[0]?.updatedAt;
  let oppCount = 0;
  let id = 0;
  let totalOppTime = 0;
  let totalNormalTime = 0;

  let stats = {};
  stats.maxOppDuration = 0;
  stats.minOppDuration = 999999;
  stats.maxNormalTime = 0;
  stats.minNormalTime = 999999;

  currentOpp.oppComposition = [];
  currentOpp.oppStatistics = [];

  for (let i = 0; i < opportunities.length; i++) {

    if (genericController.isWithinLengthAndTimeOpp(opportunities, i)) {

      let oppComp = {};
      oppComp.oppId = id;
      oppComp.beginTime = beginTime;
      oppComp.endTime = opportunities[i].updatedAt;
      oppComp.oppDurationInMin = (oppComp.endTime - oppComp.beginTime) / 60000;

      if (id > 0) {
        oppComp.currentNormalPeriod = (oppComp.beginTime - currentOpp.oppComposition[id - 1].endTime) / 60000;
        totalNormalTime += oppComp.currentNormalPeriod;
      }

      oppComp.oppPredictCounter = 0;
      currentOpp.oppComposition.push(oppComp);
      beginTime = opportunities[i + 1]?.updatedAt;
      id++;
      oppCount++;
      totalOppTime += oppComp.oppDurationInMin;
      updateMinMaxStats(stats, oppComp);
    }
  }

  createDailyOppCount(currentOpp, startDate);
  createOppStatistics(currentOpp, stats, oppCount, endDate, startDate, totalOppTime, totalNormalTime);
  return currentOpp;
}

/**
 * Generates the daily count for an opportunity type, used for the daily opportunity plot
 * @param   {Date}  currentOpp Current opportunity type
 * @param   {Date}  startDate  Start date of the timeline
 * @returns {Array}            An array with daily opp count for each opportunity type
 */
const createDailyOppCount = (currentOpp, startDate) => {
  let currentDate = new Date(startDate);
  let i = 0;
  let oppCount = 0;
  currentOpp.dailyOpps = [];

  while (i < currentOpp.oppComposition.length) {
    // if the difference between the currently read opp time and the current date is outside of a day
    if ((currentOpp.oppComposition[i].beginTime - currentDate) > 86400000) {
      if (oppCount > 0) {
        let dailystats = {};
        dailystats.date = currentDate.toISOString();
        dailystats.oppCount = oppCount;
        currentOpp.dailyOpps.push(dailystats);
        oppCount = 0;
      }
      currentDate.setDate(currentDate.getDate() + 1);

      // For end of list readings
    } else if (i == currentOpp.oppComposition.length - 1) {
      oppCount++;
      let dailystats = {};
      dailystats.date = currentDate.toISOString();
      dailystats.oppCount = oppCount;
      currentOpp.dailyOpps.push(dailystats);
      i++;

    } else {
      oppCount++;
      i++;
    }
  }
}

/**
 * Updates the min and max statistics for the overall opp statistics
 * @param {Array} minMaxStats Array containing the minimum and maximum stats for an opportunity
 * @param {Array} oppComp     Array of the currently selected opporunity to compare against
 *                            the min max stats
 */
const updateMinMaxStats = (minMaxStats, oppComp) => {
  if (minMaxStats.maxOppDuration < oppComp.oppDurationInMin) {
    minMaxStats.maxOppDuration = oppComp.oppDurationInMin;
  }
  if (minMaxStats.minOppDuration > oppComp.oppDurationInMin) {
    minMaxStats.minOppDuration = oppComp.oppDurationInMin;
  }
  if (minMaxStats.maxNormalTime < oppComp.currentNormalPeriod) {
    minMaxStats.maxNormalTime = oppComp.currentNormalPeriod;
  }
  if (minMaxStats.minNormalTime > oppComp.currentNormalPeriod) {
    minMaxStats.minNormalTime = oppComp.currentNormalPeriod;
  }
}

/**
 * Sets the overall statistics for the opportunity type
 * @param {Array}  currentOpp      Current opportunity type
 * @param {Array}  stats           Existing statistics parameter to be recorded for the opportunity type
 * @param {Number} oppCount        Count of opportunity type occurrence
 * @param {Date}   endDate         End of time period
 * @param {Date}   startDate       Start of time period
 * @param {Number} totalOppTime    Total duration for the opportunity type in minutes
 * @param {Number} totalNormalTime Total duration of time between opportunity type in minutes
 */
const createOppStatistics = (currentOpp, stats, oppCount, endDate, startDate,
                              totalOppTime, totalNormalTime) => {

  stats.maxOppPerDay = Math.max.apply(Math, currentOpp.dailyOpps.map(function (ans) { return ans.oppCount }));
  stats.avgOppDuration = totalOppTime / oppCount;
  stats.avgNormalTime = totalNormalTime / oppCount;
  stats.avgOppPerDay = oppCount / ((endDate - startDate) / 86400000);
  stats.totalDays = ((endDate - startDate) / 86400000);
  stats.totalOpps = oppCount;
  currentOpp.oppStatistics.push({ stats });
};

/**
 * Creates and sets the intermediate statistics required for the colour band plot
 * @param   {Array} opportunity Current opportunity type
 * @param   {Array} currentFlag Result array for the current opportunity type
 * @returns {Array}             CurrentFlag parameter, contains the status and time recorded
 */
const createColourOpps = (opportunity, currentFlag) => {

  currentFlag.oppComposition = [];

  for (let i = 0; i < opportunity.length; i++) {

    let tempObject = {};
    tempObject.status = opportunity[i].state;
    tempObject.beginTime = opportunity[i].updatedAt;
    currentFlag.oppComposition.push(tempObject);
  }
  return currentFlag;
}

/**
 * Creates and sets the final statistics required for the colour band plot
 * @param   {Array} flagOpp   Current opportunity type
 * @param   {Date}  startDate Start of time period
 * @param   {Date}  endDate   End of time period
 * @returns {Array}           An array with the opportunity statuses, time recorded for status,
 *                            and duration in 5 min intervals
 */
const createColourTimeLine = (flagOpp, startDate, endDate) => {

  let finalArray = [];
  let flagObject = {};
  flagObject.flag = flagOpp.state;
  flagObject.timeLineArray = [];
  let tempCombinedObject = [];

  for (let upset of flagOpp.oppComposition) {
    let upsetInterval = {};
    upsetInterval.status = 'OPPORTUNITY';
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
  return finalArray;
}