import React, { useState, useContext, useEffect } from 'react'
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { DateContext } from '../../../context/DateContext';
import { FilterContext } from '../../../context/FilterContext';
import LoadingSpinner from '../../loadingSpinner/LoadingSpinner';
import moment from 'moment';
import {
    ResponsiveContainer, BarChart,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend,
    Bar, Label
} from 'recharts';
import { Result } from 'postcss';

const CountById = () => {

    const [counts, setCounts] = useState([]);
    const { startDate, endDate } = useContext(DateContext);
    const { predictionFlags } = useContext(FilterContext);
    const queryClient = useQueryClient()

    const reduceData = (data) => {
        if (!data) return [];
        const upsets = [];
        const predictions = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].dailyUpsets.length > 0) {
                for (let j = 0; j < data[i].dailyUpsets.length; j++) {
                    const val = data[i].dailyUpsets[j];
                    const res = upsets.find(x => x.date === val.date);

                    if (res) {
                        res.upsetCount = Number.parseInt(res?.upsetCount) + Number.parseInt(val?.upsetCount);
                    } else {
                        upsets.push(val);
                    }

                }
            }
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].dailyWarnings.length > 0) {
                for (let j = 0; j < data[i].dailyWarnings.length; j++) {
                    const val = data[i].dailyWarnings[j];
                    const res = predictions.find(x => x.date === val.date);
                    if (res) {
                        res.warningCount = Number.parseInt(res?.warningCount) + Number.parseInt(val.warningCount);
                    } else {
                        predictions.push(val);
                    }
                }
            }
        }

        for (let i = 0; i < predictions.length; i++) {
            const res = upsets.find(x => x.date === predictions[i].date);
            if (res) {
                res.warningCount = predictions[i].warningCount;
            } else {
                upsets.push(predictions[i]);
            }
        }


        const result = upsets;
        // const next = result.map(item => {
        //     const date = new Date(item.date);
        //     item.date = date.getFullYear() + "/"
        //         + (date.getMonth() + 1) + "/" + date.getDate();
        //     return item;
        // })


        for (let i = 0; i < result.length; i++) {
            const date = new Date(result[i].date);
            result[i].date = date.getFullYear() + "/"
                + (date.getMonth() + 1) + "/" + date.getDate();
        }

        // problem is before this point

        const numDays = (endDate - startDate) / (3600 * 24 * 1000);

        for (let i = 0; i <= numDays; i++) {
            let currDay = new Date(startDate.getTime() + (3600 * 24 * 1000 * i));

            const dayString = currDay.getFullYear() + "/"
                + (currDay.getMonth() + 1) + "/" + currDay.getDate();

            const daily = result.find((item) =>
                item.date == dayString);
            if (daily) {
                if (!daily.warningCount) daily.warningCount = 0;
                if (!daily.upsetCount) daily.upsetCount = 0;
            } else {
                result.push({ date: dayString, warningCount: 0, upsetCount: 0 });
            }
        }

        result.sort((a, b) => {
            if (new Date(a.date).getTime() > new Date(b.date).getTime()) return 1;
            if (new Date(a.date).getTime() < new Date(b.date).getTime()) return -1;
            else return 0;
        })
        let k = 0;
        result.forEach(item => {
            k += item.warningCount;
        })
        return result;
    }

    const formatXAxis = (item) => {
        return moment(item).format("YYYY/MM/DD")
    }


    const { isLoading, isError, data, error, refetch, isFetching } = useQuery("DailyStats", () => axios({
        url: "http://localhost:3001/performance/bothComposition",
        method: "GET",
        params: { startDate: startDate, endDate: endDate, flag: predictionFlags.toString() }
    }).then(res => res.data)
    )



    useEffect(() => {
        if (isFetching) {
            queryClient.cancelQueries("DailyStats")
        }
        if (endDate) {
            refetch()
        }
    }, [startDate, endDate, predictionFlags])


    useEffect(() => {
        setCounts(reduceData(data));
    }, [data])

    if (isFetching || isLoading) {
        return <LoadingSpinner />
    }
    else return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={counts} barGap={0}>
                {/* barGap={0} */}
                <CartesianGrid strokeDasharray="#f5f5f5" />
                <XAxis dataKey="date" domain={[startDate.getTime() - (24 * 60 * 60 * 1000 / 2), 'dataMax']}
                    // domain={[new Date(startDate).getTime(), new Date(endDate).getTime()]}
                    tickCount={5}
                    tickFormatter={formatXAxis} >
                    <Label value="Date (YYYY/MM/DD)" position="bottom" />
                </XAxis>
                <YAxis type="number" label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                <Tooltip labelFormatter={(e) => {
                    const date = new Date(e);
                    return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
                }} />
                <Legend verticalAlign='top' />

                <Bar dataKey="upsetCount" name="Upset count" fill="#f694c1" />
                <Bar dataKey="warningCount" name="Prediction count" fill="#FFB74D" />
            </BarChart>
        </ResponsiveContainer>
    )

}


export default CountById