import React from 'react'
import CategoryToggle from './CategoryToggle'

const SelectFlag = ({
  selectedCategory,
  setSelectedCategory,
  allFlags,
  flags,
  setFlagsList,
  chooseFlags,
  page
}) => {
  const categories = []
  for (let i = 0; i <= 13; i++) {
    if (i !== 4) categories.push(`category ${i}`)
  }
  const deselect = e => {
    e.preventDefault()
    setFlagsList([])
  }

  const selectAll = e => {
    e.preventDefault()
    setFlagsList(allFlags)
  }

  // use a state for category -> uncollapsing a category -> adding it to the state, else remove it
  // use a state for flag -> checking the flag -> adding it to the state, else remove
  // for each flag under the categories ->either pass it as a prop or let the flags sort inside the categories.
  return (
    <div
      className='absolute w-72 h-60 my-8 overflow-auto border-2 rounded-md border-gray-300 bg-white'
      onClick={e => {
        e.stopPropagation()
      }}
    >
      {page === 'assetStatus' &&
        categories.map(item => {
          return (
            <CategoryToggle
              category={item}
              key={item}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedFlag={flags}
              setSelectedFlag={chooseFlags}
              page={page}
            />
          )
        })}

      {page === 'predictions' && (
        <CategoryToggle
          selectedFlag={flags}
          setSelectedFlag={chooseFlags}
          page={page}
        />
      )}

      {page === 'opportunities' && (
        <CategoryToggle
          selectedFlag={flags}
          setSelectedFlag={chooseFlags}
          page={page}
        />
      )}

      {/* <button className="setFlagButton" onClick={(e) => {
                e.stopPropagation()
                console.log(selectedFlag)
                localStorage.flags = selectedFlag
            }}>Set flags</button> */}
      <div className='flex flex-col'>
        <button
          className='text-white px-4 my-1 bg-navy-800 rounded-md'
          onClick={selectAll}
        >
          Select all
        </button>
        <button
          className='text-white px-4 my-1 bg-navy-800 rounded-md'
          onClick={deselect}
        >
          Deselect all
        </button>
      </div>
    </div>
  )
}

export default SelectFlag
