import React, { useState, useContext } from 'react'
import DatePicker from 'react-datepicker'
import './filterBar.css'
import { AiTwotoneCalendar } from 'react-icons/ai'
import { BiFilter } from 'react-icons/bi'
import { DateContext } from '../../../context/DateContext'
import SelectFlag from './flagSelect/SelectFlag'
import { FilterContext } from '../../../context/FilterContext'
import "react-datepicker/dist/react-datepicker.css";

const FilterBar = props => {
  const { startDate, changeStartDate, endDate, changeEndDate } = useContext(
    DateContext
  )

  const {
    predictionFlags,
    allPredictionFlags,
    setPredictionFlagsList,
    choosePredictionFlags,
    upsetFlags,
    allUpsetFlags,
    setUpsetFlagsList,
    chooseUpsetFlags,
    allOpportunities,
    setOpportunitiesList,
    chooseOpportunities,
    opportunities
  } = useContext(FilterContext)

  const [selectedCategory, setSelectedCategory] = useState([])

  const onChange = dates => {
    const [start, end] = dates
    changeStartDate(start)
    changeEndDate(end)
  }
  const [toggleDate, setToggleDate] = useState(false)
  const [toggleFlag, setToggleFlag] = useState(false)
  return (
    <div className='ml-3 relative w-full h-12 flex justify-center z-30'>
      <div className='flex w-full h-full justify-start'>
        <div className='text-center my-auto flex flex-wrap'>
          <button
            className={
              toggleDate
                ? 'bg-navy-800 text-white toggleDate'
                : ' bg-gray-300 toggleDate'
            }
            onClick={e => {
              setToggleDate(!toggleDate)
              if (!toggleDate && toggleFlag) {
                setToggleFlag(!toggleFlag)
              }
            }}
          >
            <AiTwotoneCalendar className='text-lg' />
            <p className='m-auto '>
              {startDate?.toDateString()}
              {'\t-\t'}
              {endDate?.toDateString()}{' '}
            </p>
          </button>
          {toggleDate ? (
            <div className='absolute ml-6 my-8'>
              <DatePicker
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
              />
            </div>
          ) : (
            ''
          )}
          {props.page != 'single' ? (
            <button
              className={
                toggleFlag
                  ? 'toggleFlag bg-navy-800 text-white'
                  : 'toggleFlag bg-gray-300'
              }
              onClick={e => {
                setToggleFlag(!toggleFlag)
                if (!toggleFlag && toggleDate) {
                  setToggleDate(!toggleDate)
                }
              }}
            >
              <BiFilter className='text-lg mr-2' />
              <p className='m-auto '>Filter By:</p>
              {toggleFlag ? (
                <SelectFlag
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  flags={
                    props.page == 'assetStatus'
                      ? upsetFlags
                      : props.page == 'predictions'
                        ? predictionFlags
                        : props.page == 'opportunities'
                          ? opportunities
                          : ''
                  }
                  predictionFlags={predictionFlags}
                  setFlagsList={
                    props.page == 'assetStatus'
                      ? setUpsetFlagsList
                      : props.page == 'predictions'
                        ? setPredictionFlagsList
                        : props.page == 'opportunities'
                          ? setOpportunitiesList
                          : ''
                  }
                  chooseFlags={
                    props.page == 'assetStatus'
                      ? chooseUpsetFlags
                      : props.page == 'predictions'
                        ? choosePredictionFlags
                        : props.page == 'opportunities'
                          ? chooseOpportunities
                          : ''
                  }
                  allFlags={
                    props.page == 'assetStatus'
                      ? allUpsetFlags
                      : props.page == 'predictions'
                        ? allPredictionFlags
                        : props.page == 'opportunities'
                          ? allOpportunities
                          : ''
                  }
                  opportunities={allOpportunities}
                  page={props.page}
                />
              ) : (
                ''
              )}
            </button>
          ) : (
            ''
          )}

          {props.page != 'single' ? (
            <p className='text-sm pl-8 pr-4 my-auto tracking-tighter'>
              Selected items:
            </p>
          ) : (
            ''
          )}

          {props.page != 'single' ? (
            <div
              className='flex overflow-auto'
              style={{ width: '800px', maxWidth: '40%' }}
            >
              {props.page == 'assetStatus' &&
                upsetFlags.map((item, _key) => {
                  return (
                    <div key={_key} className='bg-navy-800 text-white text-sm flex justify-center mx-3 h-4 m-auto w-24 rounded-xl flex-grow-1 flex-shrink-0'>
                      <p className='m-auto'>{item}</p>
                    </div>
                  )
                })}

              {props.page == 'predictions' &&
                predictionFlags.map((item, _key) => {
                  return (
                    <div key={_key} className='bg-navy-800 text-white text-sm flex justify-center mx-3 h-4 m-auto w-24 rounded-xl flex-grow-1 flex-shrink-0'>
                      <p className='m-auto'>{item}</p>
                    </div>
                  )
                })}

              {props.page == 'opportunities' &&
                opportunities.map((item, _key) => {
                  return (
                    <div key={_key} className='bg-navy-800 text-white text-sm flex justify-center mx-3 h-4 m-auto w-24 rounded-xl flex-grow-1 flex-shrink-0'>
                      <p className='m-auto'>{item}</p>
                    </div>
                  )
                })}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

export default FilterBar
