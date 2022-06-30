import React, { useState, useContext, useEffect } from 'react'
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { DateContext } from '../../../../context/DateContext';
import LoadingSpinner from '../../../loadingSpinner/LoadingSpinner';
import moment from 'moment';
import {
    ResponsiveContainer, BarChart,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend,
    Bar, Label
} from 'recharts';

const DailyPredictionErrorCountPlot = ({ flag }) => {
    const [dailyData, setDailyData] = useState([]);
    const queryClient = useQueryClient()
    const { startDate, endDate } = useContext(DateContext);
    const { isLoading, isError, data, error, refetch, isFetching } = useQuery("singlePredictionDailyErrorStats", () => axios({
        url: "http://localhost:3001/predictions/errors",
        method: "GET",
        params: { startDate: startDate, endDate: endDate, flag: flag.toString() }
    }).then(res => res.data)
    )

    const formatData = (data) => {
        if (data !== undefined) {
            const dailyErrors = data[0].dailyErrors;
            dailyErrors.forEach((dailyError) => {
                const date = new Date(dailyError.date)
                dailyError.date = date.getFullYear() + "/"
                    + (date.getMonth() + 1) + "/" + date.getDate()
            })

            setDailyData(data ? data[0].dailyErrors : []);
            const numDays = (endDate - startDate) / (3600 * 24 * 1000);
            const result = [];


            for (let i = 0; i <= numDays; i++) {
                let currDay = new Date(startDate.getTime() + (3600 * 24 * 1000 * i));

                const dayString = currDay.getFullYear() + "/"
                    + (currDay.getMonth() + 1) + "/" + currDay.getDate();

                const predictError = dailyErrors.find((item) =>
                    item.date == dayString);
                result[i] = {
                    date: parseInt(currDay.getTime()), errorCount: predictError ? predictError.errorCount : 0
                }


            }
            return result;
        }
    }

    const formatXAxis = (item) => {
        return moment(item).format("YYYY/MM/DD")
    }


    useEffect(() => {
        if (isFetching) {
            queryClient.cancelQueries("singlePredictionDailyErrorStats")
        }
        if (endDate) {
            refetch()
        }
    }, [startDate, endDate, flag])

    useEffect(() => {
        setDailyData(formatData(data));

    }, [data])


    if (isFetching || isLoading) {
        return <LoadingSpinner />
    }
    else return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} barGap={0}>
                <CartesianGrid strokeDasharray="#f5f5f5" />
                <XAxis dataKey="date" domain={[startDate.getTime() - (24 * 60 * 60 * 1000 / 2), 'dataMax']}
                    // domain={[new Date(startDate).getTime(), new Date(endDate).getTime()]}  
                    type="number"
                    tickCount={10}
                    tickFormatter={formatXAxis} >
                    <Label value="Date (YYYY/MM/DD)" position="bottom" />
                </XAxis>
                <YAxis type="number" label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                <Tooltip labelFormatter={(e) => {
                    const date = new Date(e);
                    return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
                }} />
                <Legend verticalAlign='top' />

                <Bar dataKey="errorCount" name="Error count" fill="#f694c1" />

            </BarChart>
        </ResponsiveContainer>
    )
}

export default DailyPredictionErrorCountPlot;