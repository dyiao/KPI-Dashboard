import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import axios from 'axios'
import { DateContext } from '../../../context/DateContext'
import { FilterContext } from '../../../context/FilterContext'
import { useQuery } from 'react-query'
import { ThreeDots } from 'react-loader-spinner'
import { useQueryClient } from 'react-query'
import OpportunityTableContent from './OpportunityTableContent'
import { BiUnderline } from 'react-icons/bi'
// import "../opportunityTable/opportunityTable.css"

const OpportunityTable = () => {
  const { startDate, endDate } = useContext(DateContext)
  const { opportunities} = useContext(FilterContext)
  const [opportunityTableData, setOpportunityTableData] = useState([])
  const [TotalOpportunities, setTotalOpportunities] = useState(0)
  const queryClient = useQueryClient()

  const mountRef = useRef(false)

  const {
    isLoading,
    isError,
    data: opportunityData,
    error,
    refetch,
    isFetching
  } = useQuery('opportunityTableData1', () =>
    axios({
      url: 'http://localhost:3001/opportunities/oppTable',
      method: 'GET',
      params: {
        startDate: startDate,
        endDate: endDate,
        flag: opportunities.toString()
      }
    }).then(res => res.data)
  )

  const getOpportunityCount = data => {
    if (!data) return 0
    if (data.length < 1) return 0
    let count = 0
    for (let i = 0; i < data.length; i++) {
      if (data[i].totalOpps){
        count += data[i].totalOpps
      }
      else{
        count+=0
      }
    }
    return count
  }

  useEffect(() => {
    setOpportunityTableData(opportunityData)
    if (mountRef.current == false) {
      mountRef.current = true
    } else {
      if (isFetching) {
        queryClient.cancelQueries('opportunityTableData1')
      }
      if (endDate) {
        refetch()
      }
    }
  }, [startDate, endDate, opportunities])

  useEffect(() => {
    setOpportunityTableData(opportunityData)
    setTotalOpportunities(getOpportunityCount(opportunityData))
  }, [opportunityData])

  if (isLoading || (isFetching && opportunityData)) {
    return (
      <div className='m-auto w-full h-full flex justify-center'>
        <ThreeDots type='ThreeDots' color='#034f8a' height='500' width='200' />
      </div>
    )
  } else {
    return (
      <div>
        <OpportunityTableContent
          opportunityTableData={opportunityData}
          totalOpportunities={TotalOpportunities}
        />
      </div>
    )
  }
}

export default OpportunityTable
