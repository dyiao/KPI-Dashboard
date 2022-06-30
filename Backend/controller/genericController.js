/* Exported modules used for various routes*/

/**
 * Checks if the current time and the next time are within 5 minutes
 * @param   {Array}  currentFlag Current upset/warning array
 * @param   {Number} i           Current interval
 * @returns {boolean}            True if difference between current time and the upcoming time
 *                               is within 5 minutes, otherwise False
 */
module.exports.isWithinLengthAndTime = (currentFlag, i) => {
  return i + 1 < currentFlag.length
    ? withinFiveMins(currentFlag[i].createdAt, currentFlag[i + 1].createdAt)
    : true
}

/**
 * Checks if the current time and the next time are within 5 minutes, opportunity oriented
 * @param   {Array}   currentFlag Current opportunity array
 * @param   {Number}  i           Current interval
 * @returns {boolean}             True if difference between current time and the upcoming time
 *                                is within 5 minutes, otherwise False
 */
module.exports.isWithinLengthAndTimeOpp = (opportunity, i) => {
  return i + 1 < opportunity.length
    ? withinFiveMins(opportunity[i].updatedAt, opportunity[i + 1].updatedAt)
    : true
}

/**
 * Creates a default list for the upset/warnings datasets
 * @param   {Number} length Length of dataset
 * @returns {Array}         Default list of upset/warning datasets
 */
module.exports.createDefaultFlagList = (length) => {
  let result = []
  for (let i = 0; i < length; i++) {
    result.push({ flag: i, category: addCategoryParameter(i) })
  }
  return result
}

/**
 * Creates a default list for the opportunity datasets
 * @param   {Array} distinctOpps Array of distinct opportunity types
 * @returns {Array}              Default list of opportunity datasets
 */
module.exports.createDefaultOppList = (distinctOpps) => {
  
  let result = []

  for (let opps of distinctOpps) {
    result.push({ opp_type: opps })
  }
  result.sort((a, b) => a.opp_type - b.opp_type)
  return result
}

/**
 * Creates a custom list for the upset/warnings datasets
 * @param   {Array} flag Array of user selected flags
 * @returns {Array}      A sorted flag list
 */
module.exports.createCustomFlagList = (flag) => {
  const flagList = flag.split(',').map(Number)
  let result = []
  for (let index of flagList) {
    result.push({
      flag: index,
      category: addCategoryParameter(index)
    })
  }
  result.sort((a, b) => a.flag - b.flag)
  return result
}

/**
 * Creates a custom list for the opportunity datasets
 * @param   {Array} opportunities Array of user selected opp types
 * @returns {Array}               A sorted opp type list
 */
module.exports.createCustomOppList = (opportunities) => {
  let oppArray = []
    const oppList = opportunities.split(',').map(Number)
    for (let index of oppList) {
      let selection = 'opp type ' + index
      oppArray.push({
        opp_type: selection
      })
    }
    oppList.sort((a, b) => a.opp_type - b.opp_type)
  return oppArray
}

/* Supporting Functions - functions called within the controller */

/**
 * Checks if the difference between current time and next time is within 5 mins 
 * @param   {Date}  currentTime Current time of time line
 * @param   {Date}  nextTime    Next time of time line
 * @returns {Array}             True if the difference between current time
 *                              and next time is within 5 mins, otherwise False 
 */
const withinFiveMins = (currentTime, nextTime) => {
  return nextTime - currentTime > 300000
}

/**
 *Adds category parameter to each respective flags
 * @param   {Array} flag Current upset/warning flag
 * @returns {String}     Corresponding category for the respective flag 
 */
const addCategoryParameter = (flag) => {
  for (let category of getCategoryList()) {
    for (let categoryFlag of category.flagList) {
      if (categoryFlag.flag == flag) {
        return category.category
      }
    }
  }
}

/**
 * Retrieve known list of corresponding flags and categories (upset/warning dataset only)
 * @returns {Array} Array of known corresponding categories and flags 
 */
const getCategoryList = () => {
  return [
    {
      category: 0,
      flagList: [{ flag: 0 }, { flag: 38 }, { flag: 39 }, { flag: 40 }]
    },
    {
      category: 1,
      flagList: [{ flag: 1 }, { flag: 2 }, { flag: 3 }, { flag: 37 }]
    },
    {
      category: 2,
      flagList: [{ flag: 68 }, { flag: 69 }, { flag: 70 }]
    },
    {
      category: 3,
      flagList: [
        { flag: 4 },
        { flag: 5 },
        { flag: 6 },
        { flag: 24 },
        { flag: 25 }
      ]
    },
    {
      category: 5,
      flagList: [
        { flag: 7 },
        { flag: 8 },
        { flag: 9 },
        { flag: 10 },
        { flag: 11 },
        { flag: 12 },
        { flag: 13 },
        { flag: 14 },
        { flag: 15 },
        { flag: 16 }
      ]
    },
    {
      category: 6,
      flagList: [
        { flag: 17 },
        { flag: 18 },
        { flag: 19 },
        { flag: 20 },
        { flag: 21 },
        { flag: 22 },
        { flag: 23 }
      ]
    },
    {
      category: 7,
      flagList: [{ flag: 26 }, { flag: 27 }, { flag: 28 }, { flag: 29 }]
    },
    {
      category: 8,
      flagList: [
        { flag: 30 },
        { flag: 31 },
        { flag: 32 },
        { flag: 33 },
        { flag: 34 },
        { flag: 35 },
        { flag: 36 }
      ]
    },
    {
      category: 9,
      flagList: [
        { flag: 41 },
        { flag: 42 },
        { flag: 43 },
        { flag: 44 },
        { flag: 45 },
        { flag: 46 }
      ]
    },
    {
      category: 10,
      flagList: [{ flag: 47 }, { flag: 48 }]
    },
    {
      category: 11,
      flagList: [{ flag: 49 }, { flag: 50 }, { flag: 51 }, { flag: 52 }]
    },
    {
      category: 12,
      flagList: [
        { flag: 53 },
        { flag: 54 },
        { flag: 55 },
        { flag: 56 },
        { flag: 57 },
        { flag: 58 },
        { flag: 59 },
        { flag: 60 },
        { flag: 61 },
        { flag: 62 },
        { flag: 63 },
        { flag: 64 }
      ]
    },
    {
      category: 13,
      flagList: [{ flag: 65 }, { flag: 66 }, { flag: 67 }]
    }
  ]
}