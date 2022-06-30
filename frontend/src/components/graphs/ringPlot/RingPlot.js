import React, { useEffect, useState } from 'react'
import "./RingPlot.css"
import {
    ResponsiveContainer, AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    Area,
    Pie,
    PieChart,
    Cell,
    Label
} from 'recharts';
import RingPlotLabel from './RingPlotLabel';
const RingPlot = ({ data, flag }) => {
    const data02 = [
        {
            "name": "Group A",
            "value": 2400
        },
        {
            "name": "Group B",
            "value": 4567
        },
        {
            "name": "Group C",
            "value": 1398
        }
    ];
    const [ringData, setRingData] = useState({});
    useEffect(() => {
        if (data) {
            setRingData([{ "name": "False Alarm", "value": data.falseAlarms },
            { "name": "Predicted Upsets", "value": data.predictedUpsets },
            { "name": "Unexpected Upsets", "value": data.unexpectedUpsets }])

        }
    }, [data])
    const itemStyle = {

        color: "purple",
        fontSize: "50px"
    }
    const colors = [
        "#001aff",
        "#00ff19",
        "#8f00ff"
    ]

    function CustomLabel({ viewBox, value1, value2 }) {
        const { cx, cy } = viewBox;
        return (
            <text x={cx} y={cy} fill="#FFFFFF" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
                <tspan alignmentBaseline="middle" dy="-0.7em" fontSize="50">{value1}</tspan>
                <tspan fontSize="30">{value2}</tspan>
            </text>
        )
    }

    const getPercentageLabels = ({ cx, cy }) => {

    }


    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart >
                <Pie data={ringData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="60%" outerRadius="80%"
                    fill="#000000" stroke="none"
                    startAngle={90} endAngle={450}
                    paddingAngle={0} label={true}>
                    {data02.map((entry, index) => {
                        return <Cell key={index} fill={colors[index]} />
                    })}
                    {/* <Label content={<CustomLabel value1={"1"} value2={"3 Upsets"} />} position="centerBottom" /> */}
                    <Label
                        value={"flag " + flag} position="centerBottom" className='label-top' fontSize='2.5em' style={{ fill: "#000000" }}
                    />
                    <Label
                        value={data.totalUpsets + " upsets, " + data.totalWarnings + " predictions"}
                        position="centerTop" className='label' fontSize="1em" style={{ fill: "#000000" }}
                    />

                </Pie>
            </PieChart>
        </ResponsiveContainer >
    )
}

export default RingPlot