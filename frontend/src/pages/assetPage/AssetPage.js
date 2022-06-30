import React from 'react'
import './assetPage.css'
import FilterBar from '../../components/bars/filterBar/FilterBar'
import VerticalStackedBarPlot from '../../components/graphs/barPlot/VerticalStackedBarPlot'
import TotalUpsetsPerFlagBarPlot from '../../components/graphs/barPlot/TotalUpsetsPerFlagBarPlot'
import UpsetTable from '../../components/tables/assetTable/UpsetTable'

const AssetPage = () => {
  return (
    <div className='flex justify-center h-screen  overflow-auto bg-lightb-100'>
      <div className=' container  bg-gray-100'>
        <div className='w-full h-4 mt-12'></div>
        <FilterBar page={'assetStatus'} />
        <div className='label'>
          <p>Upset Statistics</p>
        </div>

        <div className='itemRow p-2'>
          <div className='upsetStats'>
            <UpsetTable />
          </div>
        </div>

        <div className='label w-full '>
          <p>Upset distribution by category</p>
        </div>
        <div className='itemRow'>
          <div className='item w-full h-96'>
            <div className=' w-full'>
              <VerticalStackedBarPlot />
            </div>
          </div>
        </div>
        {/*
         <div className='itemRow'>
          <div className='item w-full h-96'>
            <div className=' w-full'>
              <HorizontalStackedBarPlot />
            </div>
          </div>
        </div>
        */}
        <div className='label w-full '>
          <p>Total Upsets by Flag</p>
        </div>
        <div className='itemRow'>
          <div className='item w-full h-96'>
            <div className=' w-full'>
              <TotalUpsetsPerFlagBarPlot />
            </div>
          </div>
        </div>

        {/* - Empty Box
        <div className='itemRow'>
          <div className='item w-full h-96'>
            <div className=' w-full'>

            </div>
          </div>
        </div>
      */}
      </div>
    </div>
  )
}

export default AssetPage
