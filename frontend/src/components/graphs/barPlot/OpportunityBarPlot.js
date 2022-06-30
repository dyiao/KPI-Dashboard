import React, { useState, useEffect, useContext, useRef } from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  Legend,
  ResponsiveContainer
} from 'recharts'
import axios from 'axios'
import { DateContext } from '../../../context/DateContext'
import { FilterContext } from '../../../context/FilterContext'
import { useQuery, useQueryClient } from 'react-query'
import { BiEraser } from 'react-icons/bi'
import { ThreeDots } from 'react-loader-spinner'
import { dataKeyArray } from './dataKeyArray'
import LoadingSpinner from '../../loadingSpinner/LoadingSpinner'

function OpportunityBarPlot() {
  const queryClient = useQueryClient()
  const { startDate, changeStartDate, endDate, changeEndDate } = useContext(
    DateContext
  )
  const { opportunities, chooseOpportunities } = useContext(FilterContext)
  const mountRef = useRef(false)



  const { isLoading, isError, data, error, refetch, isFetching } = useQuery(
    'opportunityBarData',
    () =>
      axios({
        url: 'http://localhost:3001/opportunities/opportunityBarChart',
        method: 'GET',
        params: {
          startDate: startDate,
          endDate: endDate,
          flag: opportunities.toString()
        }
      }).then(res => res.data)
  )

  useEffect(() => {
    if (mountRef.current == false) {
      mountRef.current = true
    } else {
      if (isFetching) {
        queryClient.cancelQueries('opportunityBarData')
      }
      if (endDate) {
        refetch()
      }
    }
  }, [startDate, endDate, opportunities])

  let updateBarTitle=(data)=>{
    data.forEach((element) =>{
      element.opp_type = element.opp_type.substr(-1)
    })
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className='value'>{`  Opportunity: ${label}  `}</p>
          <p className='value'>{`  Count: ${payload[0].value}  `}</p>
        </div>
      );
    }
  
    return null;
  };

  if (isLoading || isFetching) {
    return (
      <div className='w-full h-full flex justify-center'>
        <LoadingSpinner />
      </div>
    )
  } else {
    updateBarTitle(data)
    return (
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart layout='horizontal' width='50%' height='50%' data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <Tooltip content={<CustomTooltip/>} wrapperStyle={{ background: "white", padding: '15px' }}/>
          
          <XAxis dataKey='opp_type' interval={0} tickMargin={15} angle={0}>
            <Label value='Opportunity Type' offset={-20} position='insideBottom' />
          </XAxis>
          <YAxis
            type='number'
            label={{
              value: 'Total Count',
              angle: -90,
              offset: 0,
              position: "insideLeft"
            }}
          />
          <Bar dataKey='TotalOpportunities' stackId='b' fill='#8884d8' />
        </BarChart>
      </ResponsiveContainer>
    )
  }
}

export default OpportunityBarPlot
