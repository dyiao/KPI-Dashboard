const genericController = require('../controller/genericController')
const Status = require('../models/status')

/* Exported modules used as the main functions for the status routes */

/**
 * Returns the upset composition for the flags
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
    let distinctFlags = await Status.distinct('flags.category');
    for (let i = 0; i < distinctFlags.length; i++) {
      flagList = genericController.createDefaultFlagList(distinctFlags.length);
    }
  } else {
    flagList = genericController.createCustomFlagList(flag);
  }

  let result = getUpsetMongoQuery(flagList, startDate, endDate);

  Promise.all(result).then(status => {
    for (let i = 0; i < flagList.length; i++) {
      status[i].sort((a, b) => a.createdAt - b.createdAt);
      this.createFlagUpsets(status[i], flagList[i], endDate, startDate)
    }
    res.json(flagList)
  })
}

/**
 * Returns an array of total upset counts for each flag, suitable format for
 * Recharts stacked bar plots
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.getStackedBarChart = async (req, res) => {

  let { flag = 'default' } = req.query
  let { startDate = '2022-01-01', endDate = '2022-01-27' } = req.query

  startDate = new Date(startDate)
  endDate = new Date(endDate)
  let flagList = []

  if (flag == 'default') {
    let distinctFlags = await Status.distinct('flags.category')
    for (let i = 0; i < distinctFlags.length; i++) {
      flagList = genericController.createDefaultFlagList(distinctFlags.length)
    }
  } else {
    flagList = genericController.createCustomFlagList(flag)
  }

  let result = getUpsetMongoQuery(flagList, startDate, endDate);

  Promise.all(result).then(status => {
    for (let i = 0; i < flagList.length; i++) {
      status[i].sort((a, b) => a.createdAt - b.createdAt);
      this.createFlagUpsets(status[i], flagList[i], endDate, startDate)
    }
    let stacked = convertToStackBarChartFormat(flagList)
    res.json(stacked)
  })
}

/**
 * Returns the overall and individual upset statistics for a flag
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.statistics = async (req, res) => {

  let { flag = 'default' } = req.query
  let { startDate = '2022-01-01', endDate = '2022-01-27' } = req.query

  startDate = new Date(startDate)
  endDate = new Date(endDate)
  let flagList = []

  if (flag == 'default') {
    let distinctFlags = await Status.distinct('flags.category')
    for (let i = 0; i < distinctFlags.length; i++) {
      flagList = genericController.createDefaultFlagList(distinctFlags.length)
    }
  } else {
    flagList = genericController.createCustomFlagList(flag)
  }

  let result = getUpsetMongoQuery(flagList, startDate, endDate);

  Promise.all(result).then(status => {
    for (let i = 0; i < flagList.length; i++) {
      status[i].sort((a, b) => a.createdAt - b.createdAt);
      this.createFlagUpsets(status[i], flagList[i], endDate, startDate)
    }

    for (let i = 0; i < flagList.length; i++) {
      if (flagList[i].upsetStatistics) {
        flagList[i] = {
          flag: flagList[i].flag,
          category: flagList[i].category,
          totalUpsets: flagList[i].upsetComposition.length,
          ...flagList[i].upsetStatistics[0].stats
        }
      }
    }
    res.json(flagList)
  })
}

/**
 * Returns the total upsets per flag, formatted for Rechart bar charts
 * @param {any} req Parameter request
 * @param {any} res Resulting JSON file
 */
module.exports.getFlagBarChart = async (req, res) => {

  let { flag = 'default' } = req.query
  let { startDate = '2022-01-01', endDate = '2022-01-27' } = req.query

  startDate = new Date(startDate)
  endDate = new Date(endDate)
  let flagList = []

  if (flag == 'default') {
    let distinctFlags = await Status.distinct('flags.category')
    for (let i = 0; i < distinctFlags.length; i++) {
      flagList = genericController.createDefaultFlagList(distinctFlags.length)
    }
  } else {
    flagList = genericController.createCustomFlagList(flag)
  }
  
  let result = getUpsetMongoQuery(flagList, startDate, endDate);

  Promise.all(result).then(status => {
    for (let i = 0; i < flagList.length; i++) {
      status[i].sort((a, b) => a.createdAt - b.createdAt);
      this.createFlagUpsets(status[i], flagList[i], endDate, startDate)
    }
    let stacked = convertToFlagBarChartFormat(flagList)
    res.json(stacked)
  })
}

/**
 * Creates the upset components for the user selected flags
 * @param {Object} status      Queried upset dataset for a flag 
 * @param {Object} currentFlag Currently selected flag object to be updated
 * @param {Date}   endDate     End of time period
 * @param {Date}   startDate   Start of time period
 */
module.exports.createFlagUpsets = (status, currentFlag, endDate, startDate) => {
  let beginTime = status[0]?.createdAt
  let upsetCount = 0
  let id = 0
  let totalUpsetTime = 0
  let totalNormalTime = 0

  let stats = {}
  stats.maxUpsetDuration = 0
  stats.minUpsetDuration = 999999
  stats.maxNormalTime = 0
  stats.minNormalTime = 999999

  currentFlag.upsetComposition = []
  currentFlag.upsetStatistics = []

  for (let i = 0; i < status.length; i++) {
    if (genericController.isWithinLengthAndTime(status, i)) {
      let upsetComp = {}

      upsetComp.upsetId = id
      upsetComp.beginTime = beginTime
      upsetComp.endTime = status[i].createdAt
      upsetComp.upsetDurationInMin =
        (upsetComp.endTime - upsetComp.beginTime) / 60000

      if (id > 0) {
        upsetComp.currentNormalPeriod =
          (upsetComp.beginTime - currentFlag.upsetComposition[id - 1].endTime) /
          60000
        totalNormalTime += upsetComp.currentNormalPeriod
      }

      upsetComp.upsetPredictCounter = 0
      currentFlag.upsetComposition.push(upsetComp)
      beginTime = status[i + 1]?.createdAt
      id++
      upsetCount++
      totalUpsetTime += upsetComp.upsetDurationInMin

      updateMinMaxStats(stats, upsetComp)
    }
  }
  createDailyFlagUpsetCount(currentFlag, endDate, startDate)
  createUpsetStatistics(
    currentFlag,
    stats,
    upsetCount,
    endDate,
    startDate,
    totalUpsetTime,
    totalNormalTime
  )
  return currentFlag
}

// Supporting Functions - functions called within the controller

/**
 * Converts the stack bar chart into an adequate format for Recharts
 * @param   {Array} flagList Array containing user selected flags
 * @returns {Array}          Array with updated flags with corresponding category
 */
const convertToStackBarChartFormat = (flagList) => {
  let unique = [...new Set(flagList.map(item => item.category))]
  let result = []
  for (let i = 0; i < 14; i++) {
    result.push({ category: i.toString() })
  }
  for (let flag of flagList) {
    let index = flag.category
    let flagName = 'flag_' + flag.flag
    result[index][flagName] = flag.upsetStatistics[0].stats.totalUpsets
  }
  return result
}

/**
 * Main query for upset dataset 
 * @param   {Array} flagList  Array containing user selected flags
 * @param   {Date}  startDate Start of time period
 * @param   {Date}  endDate   End of time period
 * @returns {Array}           Query for upset datasets
 */
const getUpsetMongoQuery = (flagList, startDate, endDate) => {

  const result = []
  
  for (let currentFlag of flagList) {
    const aggregationOption = [
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
      }
    ]

    result.push(Status.aggregate(aggregationOption).exec())
  }

  return result;
}

/**
 * Query to pull upset count from the upset dataset
 * @returns {Array} Query for upset count
 */
const getUpsetCountMongoQuery = () => {
  return ([
    {
      $unwind: '$flags'
    },
    {
      $match: {
        'flags.name': 'UPSET',
        createdAt: {
          $gte: startDate1,
          $lte: endDate1
        }
      }
    },
    {
      $group: {
        _id: '$flags.category',
        count: { $sum: 1 }
      }
    }
  ])
}

/**
 * Creates and updates overall statistics for a flag
 * @param {Object} currentFlag     Flag object
 * @param {Object} stats           Stats object containing relevant overall statistics
 * @param {Number} upsetCount      Count for upsets
 * @param {Date}   endDate         End of time period
 * @param {Date}   startDate       Start of time period
 * @param {Number} totalUpsetTime  Total duration of upset periods
 * @param {Number} totalNormalTime Total duration of normal periods
 */
const createUpsetStatistics = (
  currentFlag,
  stats,
  upsetCount,
  endDate,
  startDate,
  totalUpsetTime,
  totalNormalTime
) => {
  stats.maxUpsetsPerDay = Math.max.apply(
    Math,
    currentFlag.dailyUpsets.map(function (ans) {
      return ans.upsetCount
    })
  )
  stats.avgUpsetDuration = totalUpsetTime / upsetCount
  stats.avgNormalTime = totalNormalTime / upsetCount
  stats.avgUpsetsPerDay = upsetCount / ((endDate - startDate) / 86400000)
  stats.totalDays = (endDate - startDate) / 86400000
  stats.totalUpsets = upsetCount
  currentFlag.upsetStatistics.push({ stats })
}

/**
 * Creates and updates daily upset counts for a specific flag 
 * @param {Object} currentFlag     Flag object
 * @param {Date}   endDate         End of time period
 * @param {Date}   startDate       Start of time period
 */
const createDailyFlagUpsetCount = (currentFlag, endDate, startDate) => {
  let currentDate = new Date(startDate)
  let i = 0
  let upsetCount = 0
  currentFlag.dailyUpsets = []

  while (i < currentFlag.upsetComposition.length) {
    if (currentFlag.upsetComposition[i].beginTime - currentDate > 86400000) {
      if (upsetCount > 0) {
        let dailystats = {}
        dailystats.date = currentDate.toISOString()
        dailystats.upsetCount = upsetCount
        currentFlag.dailyUpsets.push(dailystats)
        upsetCount = 0
      }
      currentDate.setDate(currentDate.getDate() + 1)
    } else if (i == currentFlag.upsetComposition.length - 1) {
      upsetCount++
      let dailystats = {}
      dailystats.date = currentDate.toISOString()
      dailystats.upsetCount = upsetCount
      currentFlag.dailyUpsets.push(dailystats)
      i++
    } else {
      upsetCount++
      i++
    }
  }
}

/**
 * Updates the minimum and maximum statistics for a flag's upset statistics
 * @param {Object} minMaxStats Minimum/Maximum statistics for a specific flag
 * @param {Object} upsetComp   Upset period composition for a specific flag
 */
const updateMinMaxStats = (minMaxStats, upsetComp) => {
  if (minMaxStats.maxUpsetDuration < upsetComp.upsetDurationInMin) {
    minMaxStats.maxUpsetDuration = upsetComp.upsetDurationInMin
  }
  if (minMaxStats.minUpsetDuration > upsetComp.upsetDurationInMin) {
    minMaxStats.minUpsetDuration = upsetComp.upsetDurationInMin
  }
  if (minMaxStats.maxNormalTime < upsetComp.currentNormalPeriod) {
    minMaxStats.maxNormalTime = upsetComp.currentNormalPeriod
  }
  if (minMaxStats.minNormalTime > upsetComp.currentNormalPeriod) {
    minMaxStats.minNormalTime = upsetComp.currentNormalPeriod
  }
}

/**
 * Formats the bar chart statistics into a format for bar charts within Recharts
 * @param {Object} flagList Array containing user selected flags
 */
const convertToFlagBarChartFormat = (flagList) => {
  let result = []
  for (let flag of flagList) {
    let obj = {}
    obj.flag = flag.flag
    obj.totalUpsets = flag.upsetStatistics[0].stats.totalUpsets
    result.push(obj)
  }
  return result
}