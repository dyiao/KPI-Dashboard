import React from 'react'
import Stat from '../components/predictionsById/Stat'
import './mainpage.css'
import BarPlot from '../components/graphs/barPlot/BarPlot'

const MainPage = () => {
  return (
    <div className='flex justify-center h-screen  overflow-auto bg-lightb-100'>
      <div className=' container  bg-gray-100'>
        <div className='w-full h-24'></div>
        <div className='itemRow'>
          <div className='item'>
            <Stat type='Precision' value={parseFloat(100.9999).toFixed(2)} />
          </div>

          <div className='item'>
            <Stat type='Accuracy' value={-100} />
          </div>

          <div className='item'>
            <Stat type='Recall' value={-100} />
          </div>
          <div className='item'>
            <Stat type='F1-Score' value={-100} />
          </div>
        </div>
        <div className='itemRow'>
          <div className='item'>
            <Stat type='Precision' value={100} />
          </div>
        </div>
        <div className='itemRow'>
          <div className='item'>
            <Stat type='Precision' value={101231230} />
          </div>
          <div className='longItem'>
            <div className='h-64 w-full'>
              <BarPlot />
            </div>
            {/* 
                        <Stat type="Precision" value={100} /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage
