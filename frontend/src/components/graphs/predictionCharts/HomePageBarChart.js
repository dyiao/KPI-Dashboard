import React from 'react'

import {
    ResponsiveContainer, BarChart,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend, Label,
    Bar
} from 'recharts';

const HomePageBarChart = ({ data }) => {
    return (
        <ResponsiveContainer>
            <BarChart width={"100%"} barGap={0} height={"90%"} data={data} layout={'vertical'} >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" >
                    <Label value="Count" offset={0} position="bottom" />
                </XAxis>
                <YAxis dataKey="flag" type="category" interval={0}>
                    <Label value="Flag" offset={0} position="left" />
                </YAxis>
                <Tooltip />
                <Legend verticalAlign='top' margin={{ bottom: "10px" }} />

                <Bar dataKey="totalWarnings" name="Number of Predictions" fill="#9381ff" />
                <Bar dataKey="totalUpsets" name="Number of Upsets" fill="#f694c1" />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default HomePageBarChart