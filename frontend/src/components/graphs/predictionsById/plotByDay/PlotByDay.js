import React, { useState, useEffect } from 'react'
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts'
import moment from 'moment'
const PlotByDay = () => {

    const [data, setDate] = useState([]);
    const data1 = [
        {
            date: new Date("2022-01-26").getTime(),
            upset: 50,
            predictions: 36
        },
        {
            date: new Date("2022-01-28").getTime(),
            upset: 20,
            predictions: 3
        },
        {
            date: new Date("2022-01-29").getTime(),
            upset: 32,
            predictions: 12
        },
        {
            date: new Date("2022-01-30").getTime(),
            upset: 12,
            predictions: 4
        }
    ]
    const formatXAxis = (item) => {
        return moment(item).format("YYYY/MM/DD")
    }
    return (
        <ResponsiveContainer width={"100%"} height={"100%"} >
            <LineChart data={data1}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" domain={['auto', 'auto']} tickCount={10} name='Time' type="number"
                    tickFormatter={formatXAxis} angle={-45} />
                <YAxis />
                <Tooltip labelFormatter={(label) => {
                    return moment(label + 1).format("YYYY/MM/DD")
                }} />
                <Legend verticalAlign="top" />
                <Line type="monotone" dataKey="upset" stroke="#8884d8" />
                <Line type="monotone" dataKey="predictions" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default PlotByDay