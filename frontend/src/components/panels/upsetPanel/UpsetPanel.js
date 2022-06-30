import React, { useState, useContext, useEffect } from 'react'
import UpsetPieChart from '../../graphs/upsetPieChart/UpsetPieChart'
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import LoadingSpinner from '../../loadingSpinner/LoadingSpinner';
import { TiArrowUpThick, TiArrowDownThick } from 'react-icons/ti'
import {
    ResponsiveContainer, BarChart,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend,
    Bar
} from 'recharts';


const UpsetPanel = ({ view, currDate, midDate, firstDate }) => {

    const queryClient = useQueryClient()
    const { isLoading: currIsLoading, isError: currIsError,
        data: currData, error: currError, refetch: currRefetch,
        isFetching: currIsFetching } = useQuery("currentOverallUpsets", () => axios({
            url: "http://localhost:3001/status/flagComposition",
            method: "GET",
            params: { startDate: midDate, endDate: currDate }
        }).then(res => res.data)
        )

    const { isLoading: prevIsLoading, isError: prevIsError,
        data: prevData, error: prevError, refetch: prevRefetch,
        isFetching: prevIsFetching } = useQuery("previousOverallUpsets", () => axios({
            url: "http://localhost:3001/status/flagComposition",
            method: "GET",
            params: { startDate: firstDate, endDate: midDate }
        }).then(res => res.data)
        )

    useEffect(() => {
        if (currIsFetching) {
            queryClient.cancelQueries("currentOverallUpsets")
        }
        currRefetch();
        if (prevIsFetching) {
            queryClient.cancelQueries("previousOverallUpsets")
        }
        prevRefetch();
        currRefetch();
    }, [firstDate, midDate])

    const getCount = (data) => {
        if (data) {
            let count = 0;
            for (let i = 0; i < data.length; i++) {
                if (!data[i].upsetComposition) continue;
                count += data[i].upsetComposition.length;
            }
            return count;
        } else return 0;
    }

    const getTotalTime = (data) => {
        if (data) {
            let totalTime = 0;
            for (let i = 0; i < data.length; i++) {
                if (!data[i].upsetComposition) continue;
                for (let j = 0; j < data[i].upsetComposition.length; j++) {
                    totalTime += data[i].upsetComposition[j].upsetDurationInMin;
                }
            }
            return totalTime;
        } else return 0;
    }

    const generateDataForPieChart = (data) => {
        if (data) {
            let result = [];
            // data.sort((a, b) => {
            //     if (a.category > b.category) {
            //         return -1;
            //     } else if (b.category > a.category) {
            //         return 1;
            //     } else return 0;
            // })

            for (let i = 0; i < data.length; i++) {
                result[i] = { name: data[i].flag, value: data[i].upsetComposition.length, category: data[i].category };
            }
            result.sort((a, b) => {
                if (a.category > b.category) {
                    return 1;
                } else if (b.category > a.category) {
                    return -1;
                } else return 0;
            })
            return result;
        }
    }

    const genCategoricalData = (data) => {
        if (data) {
            data.sort((a, b) => {
                if (a.category > b.category) {
                    return 1;
                } else if (b.category > a.category) {
                    return -1;
                } else return 0;
            })

            let count = [];
            for (let i = 0; i < data.length; i++) {
                count[data[i].category] =
                    !count[data[i].category] ? data[i].upsetComposition.length
                        : (data[i].upsetComposition.length + count[data[i].category]);
            }
            let result = [];
            for (let i = 0; i < count.length; i++) {
                result[i] = { name: i, value: count[i] }
            }
            return result;
        }
    }

    const calcDiff = (curr, prev) => {
        const diff = "(" + parseFloat((curr - prev) / prev * 100).toFixed(2) + "%" + ")";
        return diff
    }

    if (currIsLoading || currIsFetching || prevIsLoading || prevIsFetching) {
        return <div className="w-full m-auto">
            <LoadingSpinner />
        </div>
    }

    return (
        <div className="item">
            <div className="w-full h-full flex justify-start ">
                <div className="h-full w-full overflow-visible" style={{ maxHeight: "400px", maxWidth: "700px" }}>
                    <UpsetPieChart data={generateDataForPieChart(currData)}
                        categoricalData={genCategoricalData(currData)} />
                </div>
                <div className="w-full h-full ">{(currData && prevData) ? (
                    <div>
                        <div className="w-full h-full flex flex-col flex-start">

                            <div className=' flex justify-start w-full align-text-bottom h-16'>
                                <div className="text-5xl h-full flex-0 text-red-400 flex flex-col justify-end">{getCount(currData) ? getCount(currData) : 0}</div>
                                <div className="text-2xl flex-0  h-full flex flex-col justify-end pl-2">Total Upsets</div>
                                <div className={getCount(currData) >= getCount(prevData) ?
                                    "text-green-300 text-3xl flex-0 flex flex-col justify-end ml-4" :
                                    "text-red-400 text-3xl flex-0 flex flex-col justify-end ml-4"}>
                                    <div className="flex">
                                        {getCount(currData) >= getCount(prevData) ? <TiArrowUpThick /> : <TiArrowDownThick />}
                                        {calcDiff(getCount(currData), getCount(prevData))}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="w-full h-full flex flex-col">
                            <div className='h-16 flex justify-start w-full align-text-bottom'>
                                <div className="text-5xl h-full flex-0 text-red-400 flex flex-col justify-end">{getTotalTime(currData) ? getTotalTime(currData) : 0}</div>
                                <div className="text-2xl flex-0  h-full flex flex-col justify-end pl-2">Total Upset Duration in Minutes</div>
                                <div className={getTotalTime(currData) >= getTotalTime(prevData) ?
                                    "text-green-300 text-3xl flex-0 flex flex-col justify-end ml-4" :
                                    "text-red-400 text-3xl flex-0 flex flex-col justify-end ml-4"}>
                                    <div className="flex">
                                        {getTotalTime(currData) >= getTotalTime(prevData) ? <TiArrowUpThick /> : <TiArrowDownThick />}
                                        {calcDiff(getTotalTime(currData), getTotalTime(prevData))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : ""}</div>
            </div>
        </div>
    )
}

export default UpsetPanel