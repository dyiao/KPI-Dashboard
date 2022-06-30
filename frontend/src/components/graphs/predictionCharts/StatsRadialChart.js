import React from 'react'
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, PolarAngleAxis, Tooltip } from 'recharts';
import "./predictionChart.css"

const StatsRadialChart = ({ data }) => {
    const style = {
        top: '60%',
        right: "40%",
        transform: 'translate(0, 0)',
        lineHeight: '15px',
    };
    const list = ['']
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="100%" innerRadius="140%" outerRadius="200%" startAngle={180} endAngle={0} barSize={10} data={data}>
                <RadialBar
                    minAngle={15}
                    // label={{ position: 'insideStart', fill: '#fff' }}
                    background="black"
                    clockWise
                    angleAxisId={0}
                    dataKey="value"
                />
                <PolarAngleAxis type="number" domain={[0, 1]} angleAxisId={0} tick={false} />
                <Legend iconSize={15} layout="vertical" verticalAlign="middle" wrapperStyle={style} />
                <Tooltip labelFormatter={(label) => {
                    return data[label].name
                }}
                    formatter={(value, name, props) => {
                        return parseFloat(value * 100).toFixed(2) + "%"
                    }} />
            </RadialBarChart>
        </ResponsiveContainer>
    )
}

export default StatsRadialChart