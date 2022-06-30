import React, { useState, useContext, useEffect } from 'react'
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { DateContext } from '../../../context/DateContext';
import LoadingSpinner from '../../loadingSpinner/LoadingSpinner';
import moment from 'moment';
import "./upsetPieChart.css"
import {
    ResponsiveContainer, BarChart,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend, Label, PieChart, Pie, Cell, Sector,
    Bar
} from 'recharts';




const UpsetPieChart = ({ view, data, categoricalData }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    }


    const queryClient = useQueryClient()

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value, category, name } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g >
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                    {payload.name}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Flag: ${name}`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#333">{`Category: ${category}`}</text>

                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={36} textAnchor={textAnchor} fill="#999">
                    {`${value} upsets(${(percent * 100).toFixed(2)}%)`}
                </text>
            </g>
        );
    };

    const colors = [
        "#fbf8cc", "#fde4cf", "#ffcfd2", "#f1c0e8", "#cfbaf0",
        "#a3c4f3", "#90dbf4", "#8eecf5", "#98f5e1", "#b9fbc0",
        "#eae4e9", "#bde0fe", "#dce0d9", "#ff87ab"
    ]



    return (
        <ResponsiveContainer width="100%" height="100%" className="  overflow-visible">
            <PieChart >
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="70%" outerRadius="90%"
                    fill="#000000" stroke="gray" endAngle={450}
                    paddingAngle={1}
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={onPieEnter}>
                    {data.map((entry, index) => {
                        return <Cell key={index} fill={colors[entry.category]} />
                    })}

                    {/* <Label
                        value={"flag "} position="centerBottom" className='label-top' fontSize='2.5em' style={{ fill: "#000000" }}
                    />
                    <Label
                        value={data.totalUpsets + " upsets, " + data.totalWarnings + " predictions"}
                        position="centerTop" className='label' fontSize="1em" style={{ fill: "#000000" }}
                    /> */}
                </Pie>
                <Pie data={categoricalData} dataKey="value" fill="#d8e2dc"
                    cx="50%" cy="50%" innerRadius="0%" outerRadius="60%" >
                    {categoricalData.map((entry, index) => {
                        return <Cell fill={colors[index]} />
                    })}
                </Pie>
            </PieChart>
        </ResponsiveContainer >
    )
}

export default UpsetPieChart