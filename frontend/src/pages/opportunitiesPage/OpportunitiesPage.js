import React from 'react'
import './opportunitiesPage.css'
import FilterBar from '../../components/bars/filterBar/FilterBar'
import OpportunityTable from '../../components/tables/opportunityTable/OpportunityTable'
import OpportunityBarPlot from '../../components/graphs/barPlot/OpportunityBarPlot'

const OpportunityPage = () => {
    return (
        <div className='flex justify-center h-screen  overflow-auto bg-lightb-100'>
            <div className=' container  bg-gray-100'>
                <div className='w-full h-4 mt-12'></div>
                <FilterBar page={'opportunities'} />
                {/* <div className='itemRow p-2'>
          <div className='upsetStats'>
            <UpsetTable />
          </div>
        </div> */}
                <div className='itemRow p-2'>
                    <div className='upsetStats'>
                        <OpportunityTable />
                    </div>
                </div>
                <div className='label w-full '>
                    <p>Total Opportunities by Opportunity Type</p>
                </div>
                <div className='itemRow'>
                    <div className='item w-full h-96'>
                        <div className=' w-full'>
                            <OpportunityBarPlot />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OpportunityPage