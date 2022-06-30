import React, { useContext } from 'react'
const FlagToggle = ({
  flags,
  setSelectedCategory,
  selectedCategory,
  selectedFlag,
  setSelectedFlag,
  page
}) => {
  console.log(selectedFlag)
  let arr = []
  return (
    <div className='flex flex-col justify-center'>
      {page == 'assetStatus' &&
        flags.map((item, key) => {
          return (
            <div>
              <div className='flagCheckbox ' value={item}>
                <input
                  className='form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white
                         checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-middle
                         bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
                  type='checkbox'
                  value={item}
                  onChange={setSelectedFlag}
                  checked={
                    selectedFlag.includes(item.toString()) ? true : false
                  }
                  id={`checkbox${item}`}
                />
                <label
                  className='form-check-label inline-block text-black'
                  htmlFor={`checkbox${item}`}
                  onclick={e => {
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                >
                  Flag {item}
                </label>
              </div>
            </div>
          )
        })}
      {page == 'predictions' &&
        flags.map(item => {
          console.log(item)
          return (
            <div>
              <div className='flagCheckbox ' value={item}>
                <input
                  className='form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white
                         checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-middle
                         bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
                  type='checkbox'
                  value={item}
                  onChange={setSelectedFlag}
                  checked={
                    selectedFlag.includes(item.toString()) ? true : false
                  }
                  id={`checkbox${item}`}
                />
                <label
                  className='form-check-label inline-block text-black'
                  htmlFor={`checkbox${item}`}
                >
                  Flag {item}
                </label>
              </div>
            </div>
          )
        })}

      {page == 'opportunities' &&
        flags.map(item => {
          console.log(item)
          return (
            <div>
              <div className='flagCheckbox ' value={item}>
                <input
                  className='form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white
                         checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-middle
                         bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'
                  type='checkbox'
                  value={item}
                  onChange={setSelectedFlag}
                  checked={
                    selectedFlag.includes(item.toString()) ? true : false
                  }
                  id={`checkbox${item}`}
                />
                <label
                  className='form-check-label inline-block text-black'
                  htmlFor={`checkbox${item}`}
                >
                  Opportunity {item}
                </label>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default FlagToggle
