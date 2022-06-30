import React, { useContext } from 'react'
import FlagToggle from './FlagToggle'
import './sidebar.css'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { FilterContext } from '../../../../context/FilterContext'

const CategoryToggle = ({
  category,
  setSelectedCategory,
  selectedCategory,
  selectedFlag,
  setSelectedFlag,
  page
}) => {
  const {
    predictionFlags,
    allPredictionFlags,
    setPredictionFlagsList,
    choosePredictionFlags,
    upsetFlags,
    upsetFlagsByCategory,
    allUpsetFlags,
    setUpsetFlagsList,
    chooseUpsetFlags,
    opportunities,
    allOpportunities,
    setOpportunities
  } = useContext(FilterContext)

  const chooseCategoryArrow = e => {
    e.stopPropagation()
    if (!selectedCategory.includes(category)) {
      setSelectedCategory(selectedCategory.concat(category))
    } else {
      setSelectedCategory(
        selectedCategory.filter((item, key) => {
          return item !== category
        })
      )
    }
  }

  const chooseCategory = e => {
    e.stopPropagation()
    if (!selectedCategory.includes(category)) {
      setSelectedCategory(selectedCategory.concat(e.target.value))
    } else {
      setSelectedCategory(
        selectedCategory.filter(item => {
          return item !== e.target.value
        })
      )
    }
  }
  return (
    <div>
      {page == 'assetStatus' ? (
        <button
          className={
            selectedCategory.includes(category)
              ? 'collapsedCategory'
              : 'notCollapsedCategory'
          }
          onClick={chooseCategory}
          value={category}
        >
          {category}
          {selectedCategory.includes(category) ? (
            <IoIosArrowUp
              className='collapseArrow'
              onClick={chooseCategoryArrow}
            />
          ) : (
            <IoIosArrowDown
              className='collapseArrow'
              onClick={chooseCategoryArrow}
            />
          )}
        </button>
      ) : (
        ''
      )}

      {page == 'assetStatus' && selectedCategory.includes(category) ? (
        <FlagToggle
          flags={upsetFlagsByCategory[category]}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedFlag={selectedFlag}
          setSelectedFlag={setSelectedFlag}
          page={page}
        />
      ) : (
        ''
      )}

      {page == 'predictions' && (
        <FlagToggle
          flags={allPredictionFlags}
          selectedFlag={selectedFlag}
          setSelectedFlag={setSelectedFlag}
          page={page}
        />
      )}

      {page == 'opportunities' && (
        <FlagToggle
          flags={allOpportunities}
          selectedFlag={selectedFlag}
          setSelectedFlag={setSelectedFlag}
          page={page}
        />
      )}
    </div>
  )
}

export default CategoryToggle
