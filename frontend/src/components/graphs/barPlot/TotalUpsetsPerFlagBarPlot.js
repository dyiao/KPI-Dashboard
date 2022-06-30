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

function FlagBarPlot() {
  const queryClient = useQueryClient()
  const { startDate, changeStartDate, endDate, changeEndDate } = useContext(
    DateContext
  )
  const { upsetFlags, chooseUpsetFlags } = useContext(FilterContext)
  const mountRef = useRef(false)

  const { isLoading, isError, data, error, refetch, isFetching } = useQuery(
    'flagBarData',
    () =>
      axios({
        url: 'http://localhost:3001/status/flagBarChart',
        method: 'GET',
        params: {
          startDate: startDate,
          endDate: endDate,
          flag: upsetFlags.toString()
        }
      }).then(res => res.data)
  )

  useEffect(() => {
    if (mountRef.current == false) {
      mountRef.current = true
    } else {
      if (isFetching) {
        queryClient.cancelQueries('flagBarData')
      }
      if (endDate) {
        refetch()
      }
    }
  }, [startDate, endDate, upsetFlags])

  if (isLoading || isFetching) {
    return (
      <div className="w-full h-full flex justify-center">
        <LoadingSpinner />
      </div>
    )
  } else {
    return (
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart layout='horizontal' width='50%' height='50%' data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <Tooltip />
          <XAxis dataKey='flag' interval={0} tickMargin={15} angle={-90}>
            <Label value='Flag' offset={-20} position='insideBottom' />
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
          <Bar dataKey='totalUpsets' stackId='b' fill='#8884d8' />
        </BarChart>
      </ResponsiveContainer>
    )
  }
}

export default FlagBarPlot