import React from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const BarPlot = () => {
  // data will be passed in, change lock for color, make a color array of 10  colors, and then do modulus to get color for each flag.
  const data = [
    {
      _id: 'flag 2',
      count: 26
    },
    {
      _id: 'flag 3',
      count: 26
    },
    {
      _id: 'flag 0',
      count: 1045
    },
    {
      _id: 'flag 1',
      count: 26
    }
  ]
  const sortedData = data.sort((a, b) => {
    if (a._id < b._id) return -1
    else if (a._id > b._id) return 1
    else return 0
  })
  const colors = ['red', 'blue', 'yellow', 'orange']

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart
        width='50%'
        height='50%'
        data={sortedData}
        margin={{
          top: 30,
          right: 30,
          left: 20,
          bottom: 30
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='_id' />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Bar dataKey='count'>
          {sortedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default BarPlot
