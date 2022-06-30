import React, { useState, useEffect } from 'react'
import './homePage.css'
import UpsetPieChart from '../../components/graphs/upsetPieChart/UpsetPieChart'
import UpsetPanel from '../../components/panels/upsetPanel/UpsetPanel'
import PredictionPanel from '../../components/panels/predictionPanel/PredictionPanel'
import OpportunityPanel from '../../components/panels/opportunityPanel/OpportunityPanel'

const HomePage = () => {
  const [view, setView] = useState('quarterly')
  const [currDate, setCurrDate] = useState(new Date())
  const [midDate, setMidDate] = useState(
    new Date(new Date().getTime() - 3600 * 30 * 24 * 1000)
  )
  const [firstDate, setFirstDate] = useState(
    new Date(new Date().getTime() - 3600 * 60 * 24 * 1000)
  )

  useEffect(() => {
    if (view === 'monthly') {
      setMidDate(new Date(new Date().getTime() - 3600 * 30 * 24 * 1000))
      setFirstDate(new Date(new Date().getTime() - 3600 * 60 * 24 * 1000))
    } else if (view == 'quarterly') {
      setMidDate(new Date(new Date().getTime() - 3600 * 90 * 24 * 1000))
      setFirstDate(new Date(new Date().getTime() - 3600 * 180 * 24 * 1000))
    }
  }, [view])

  return (
    <div className='flex justify-center h-screen  overflow-auto bg-lightb-100'>
      <div className='container  '>
        <div className='w-full h-4 mt-12'></div>
        <div className='w-full h-12 '>
          <div className='viewToggle'>
            <button
              className={view == 'monthly' ? 'activeView' : 'inactiveView'}
              onClick={e => setView('monthly')}
            >
              Monthly
            </button>
            <button
              className={view == 'quarterly' ? 'activeView' : 'inactiveView'}
              onClick={e => setView('quarterly')}
            >
              Quarterly
            </button>
          </div>
        </div>
        <div className='label'>
          <p>
            {midDate.getFullYear() +
              '/' +
              (midDate.getMonth() + 1) +
              '/' +
              midDate.getDate()}
            -
            {currDate.getFullYear() +
              '/' +
              (currDate.getMonth() + 1) +
              '/' +
              currDate.getDate()}{' '}
          </p>
        </div>

        <div className='label w-full'>
          <p>Predicted upsets & predictions</p>
        </div>
        <div className='itemRow'>
          <div className='itemClear' style={{ height: '400px' }}>
            <div className='flex h-full w-full'>
              <PredictionPanel
                view={view}
                currDate={currDate}
                midDate={midDate}
                firstDate={firstDate}
              />
            </div>
          </div>
        </div>

        <div className='label'>
          <p>Upsets</p>
        </div>

        <div className='itemRow'>
          <div className='itemClear' style={{ height: '450px' }}>
            <div className='flex h-full w-full'>
              <UpsetPanel
                view={view}
                currDate={currDate}
                midDate={midDate}
                firstDate={firstDate}
              />
            </div>
          </div>
        </div>

        <div className='label'>
          <p>Opportunities</p>
        </div>

        <div className='itemRow'>
          <div className='itemClear' style={{ height: '450px' }}>
            <div className='flex h-full w-full'>
              <OpportunityPanel
                view={view}
                currDate={currDate}
                midDate={midDate}
                firstDate={firstDate}
              />
            </div>
          </div>
        </div>



        {/* <div className='label'>
                        <p>Predictions</p>
                    </div> */}

        {/*<div className='label'>
                        <p>Opportunities</p>
                    </div>
                    <div className='itemRow'>
                        <div className='item'>
                        </div>
                </div> */}
      </div>
    </div>
  )
}

export default HomePage
