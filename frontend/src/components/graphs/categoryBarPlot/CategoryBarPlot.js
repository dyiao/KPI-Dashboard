import React from 'react'
import {
    BarChart,
    Bar, Cell,
    XAxis, YAxis,
    CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from 'recharts';

const CategoryBarPlot = () => {


    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                layout="horizontal"
            >

                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" stackId={1} fill="#8884d8" />
                <Bar dataKey="amt" stackId={1} fill="#82ca9d" />
                <Bar dataKey="uv" fill="#ffc658" />
                {/* {data.forEach((item, index) => {
                    console.log(Object.keys(item))
                    Object.keys(item).map((type) => {
                        console.log(type)
                        return (<Bar dataKey={type} stackId={0} />)
                    })

                })} */}
                {/* {Object.keys(data[0]).map((item) => {
                    if (item !== 'name')
                        return <Bar dataKey={item} stackId={0} />
                })} */}


            </BarChart>
        </ResponsiveContainer>
    )
}

export default CategoryBarPlot