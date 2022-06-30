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

function StackedBarPlot() {
  const queryClient = useQueryClient()
  const { startDate, changeStartDate, endDate, changeEndDate } = useContext(
    DateContext
  )
  const { upsetFlags, chooseUpsetFlags } = useContext(FilterContext)
  const mountRef = useRef(false)

  const { isLoading, isError, data, error, refetch, isFetching } = useQuery(
    'stackedBarData',
    () =>
      axios({
        url: 'http://localhost:3001/status/stackedBarChart',
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
        queryClient.cancelQueries('stackedBarData')
      }
      if (endDate) {
        refetch()
      }
    }
  }, [startDate, endDate, upsetFlags])

  console.log(data)
  console.log(dataKeyArray)

  const data1 = [
    {
      category: '0',
      flag_0: 75,
      flag_38: 26,
      flag_39: 23
    },
    {
      category: '1',
      flag_37: 54,
      flag_1: 29,
      flag_2: 11
    },
    {
      category: '2',
      flag_68: 5,
      flag_69: 16,
      flag_70: 53
    },
    {
      category: '5',
      flag_7: 75,
      flag_8: 30
    }
  ]

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
          <XAxis dataKey='category'>
            <Label value='Category' offset={0} position='insideBottom' />
          </XAxis>
          <YAxis
            type='number'
            label={{
              value: 'Total Count',
              angle: -90,
              offset: 0,
              position: 'insideRight'
            }}
          />
          {dataKeyArray.map(item => (
            <Bar dataKey={item.flag} stackId='a' fill={item.color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    )
  }
}

export default StackedBarPlot
