import React, { createContext, useState } from 'react'

export const FilterContext = createContext()

export const FilterProvider = props => {
  const [predictionFlags, setPredictionFlags] = useState(
    localStorage.predictionFlags
      ? JSON.parse(localStorage.predictionFlags).map(String)
      : []
  )
  const [upsetFlags, setUpsetFlags] = useState(
    localStorage.upsetFlags
      ? JSON.parse(localStorage.upsetFlags).map(String)
      : []
  )

  const [opportunities, setOpportunities] = useState(
    localStorage.opportunities
      ? JSON.parse(localStorage.opportunities).map(String)
      : []
  )

  const chooseOpportunities = e => {
    console.log(e.target.value)
    if (JSON.stringify(e.target.value) == JSON.stringify(opportunities)) return
    if (!opportunities.includes(e.target.value)) {
      setOpportunities(opportunities.concat(e.target.value))
      localStorage.opportunities = JSON.stringify(
        opportunities.concat(e.target.value)
      )
    } else {
      setOpportunities(
        opportunities.filter((item, key) => {
          return item !== e.target.value
        })
      )
      localStorage.opportunities = JSON.stringify(
        opportunities.filter((item, key) => {
          return item !== e.target.value
        })
      )
    }
  }

  const choosePredictionFlags = e => {
    console.log(e.target.value)
    if (JSON.stringify(e.target.value) == JSON.stringify(predictionFlags))
      return
    if (!predictionFlags.includes(e.target.value)) {
      setPredictionFlags(predictionFlags.concat(e.target.value))
      localStorage.predictionFlags = JSON.stringify(
        predictionFlags.concat(e.target.value)
      )
    } else {
      setPredictionFlags(
        predictionFlags.filter((item, key) => {
          return item !== e.target.value
        })
      )
      localStorage.predictionFlags = JSON.stringify(
        predictionFlags.filter((item, key) => {
          return item !== e.target.value
        })
      )
    }
  }

  const chooseUpsetFlags = e => {
    if (JSON.stringify(e.target.value) == JSON.stringify(upsetFlags)) return
    if (!upsetFlags.includes(e.target.value)) {
      setUpsetFlags(upsetFlags.concat(e.target.value))
      localStorage.upsetFlags = JSON.stringify(
        upsetFlags.concat(e.target.value)
      )
    } else {
      setUpsetFlags(
        upsetFlags.filter((item, key) => {
          return item !== e.target.value
        })
      )
      localStorage.upsetFlags = JSON.stringify(
        upsetFlags.filter((item, key) => {
          return item !== e.target.value
        })
      )
    }
  }

  const setOpportunitiesList = list => {
    setOpportunities(list.map(String))
    localStorage.predictionFlags = JSON.stringify(list)
  }

  const setPredictionFlagsList = list => {
    setPredictionFlags(list.map(String))
    localStorage.predictionFlags = JSON.stringify(list)
  }

  const setUpsetFlagsList = list => {
    setUpsetFlags(list.map(String))
    localStorage.upsetFlags = JSON.stringify(list)
  }

  // const opportunityCategories = {
  //     "category 0":
  //         [0],
  //     "category 1":
  //         [1, 2, 3, 37],
  //     "category 3":
  //         [4, 5, 6, 24],
  //     "category 7":
  //         [26],
  //     "cateogry 12":
  //         [62]
  // }

  const allOpportunities = [0, 1, 2, 3, 4, 5, 6, 7, 8]

  const upsetFlagsByCategory = {
    'category 0': [0, 38, 39, 40],
    'category 1': [1, 2, 3, 37],
    'category 2': [68, 69, 70],
    'category 3': [4, 5, 6, 24, 25],
    'category 5': [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    'category 6': [17, 18, 19, 20, 21, 22, 23],
    'category 7': [26, 27, 28, 29],
    'category 8': [30, 31, 32, 33, 34, 35, 36],
    'category 9': [41, 42, 43, 44, 45, 46],
    'category 10': [47, 48],
    'category 11': [49, 50, 51, 52],
    'category 12': [53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64],
    'category 13': [65, 66, 67]
  }

  const allUpsetFlags = []
  Object.keys(upsetFlagsByCategory).map(key => {
    allUpsetFlags.push(...upsetFlagsByCategory[key])
  })

  const predictionFlagsByCategory = {
    'category 0': [0],
    'category 1': [1, 2, 3, 37],
    'category 3': [4, 5, 6, 24],
    'category 7': [26],
    'cateogry 12': [62]
  }

  const allPredictionFlags = [0, 1, 2, 3, 4, 5, 6, 24, 26, 37, 62]

  return (
    <FilterContext.Provider
      value={{
        allPredictionFlags,
        predictionFlags,
        setPredictionFlags,
        setPredictionFlagsList,
        setOpportunitiesList,
        setOpportunities,
        opportunities,
        choosePredictionFlags,
        chooseOpportunities,
        allUpsetFlags,
        upsetFlagsByCategory,
        upsetFlags,
        setUpsetFlags,
        setUpsetFlagsList,
        chooseUpsetFlags,
        allOpportunities
      }}
    >
      {props.children}
    </FilterContext.Provider>
  )
}
