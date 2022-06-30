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
import './verticalStackedBarPlot.css'
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


  if (isLoading || isFetching) {
    return (
      <div className="w-full h-full flex justify-center">
        <LoadingSpinner />
      </div>
    )
  } else {
    return (

      <ResponsiveContainer className='chart' width='100%' height='100%' >
        <BarChart layout='vertical' data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <Tooltip />
          <XAxis type='number' interval={0}>
            <Label
              value='Total Count'
              offset={-5}
              position='insideBottom'
            />
          </XAxis>
          <YAxis
            type='category'
            interval={0}
            label={{
              value: 'Category',
              angle: -90,
              position: 'insideLeft'
            }}
          />
          {dataKeyArray.map((item, index) => (
            <Bar key={index} dataKey={item.flag} stackId='a' fill={item.color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
      // <div className='-my-2 overflow-x-auto h-full sm:-mx-6 lg:-mx-8 overflow-y-hidden'>
      // <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 h-full w-full'>
    )
  }
}

export default StackedBarPlot
