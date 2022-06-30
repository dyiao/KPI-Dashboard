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

const HomepageOpportunityBarPlot = ({data}) => {

    let updateBarTitle = (data) => {
        if(data) {
            data.forEach((element) => {
                element.opp_type = element.opp_type.substr(-2)
            })
        }
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className='value'>{`  Opportunity: ${label}  `}</p>
                    <p className='value'>{`  Count: ${payload[0].value}  `}</p>
                </div>
            );
        }

        return null;
    };

    updateBarTitle(data)
    return (
        <ResponsiveContainer width='100%' height='100%'>
            <BarChart layout='horizontal' width='50%' height='50%' data={data}>
                <CartesianGrid strokeDasharray='3 3' />
                <Tooltip content={<CustomTooltip />} wrapperStyle={{ background: "white", padding: '15px' }} />

                <XAxis dataKey='opp_type' interval={0} tickMargin={15} angle={0}>
                    <Label value='Opportunity Type' offset={-20} position='insideBottom' />
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
                <Bar dataKey='TotalOpportunities' stackId='b' fill='#8884d8' />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default HomepageOpportunityBarPlot