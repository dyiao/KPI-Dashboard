import React from 'react'
import "./predictionPage.css"
import Stat from "../../components/graphs/predictionsById/Stat"
import ConfusionMatrix from '../../components/graphs/confusionMatrix/ConfusionMatrix'
import StatBoard from '../../components/graphs/predictionsById/StatBoard'
import FilterBar from '../../components/bars/filterBar/FilterBar'
import { useEffect, useState, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { DateContext } from '../../context/DateContext';
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import DailyCountPlot from '../../components/graphs/predictionsById/dailyCountPlot/DailyCountPlot'
import DailyPredictionErrorPlot from '../../components/graphs/predictionsById/dailyCountPlot/DailyPredictionErrorPlot'
import ColourBandPlot from '../../components/graphs/predictionsById/dailyCountPlot/ColourBandPlot'


const PredictionPageById = () => {
    const queryClient = useQueryClient()
    const { startDate, endDate } = useContext(DateContext);

    const { flag } = useParams();

    const { isLoading, isError, data, error, refetch, isFetching } = useQuery("singlePredictionStatistics", () => axios({
        url: "http://localhost:3001/performance/statistics",
        method: "GET",
        params: { startDate: startDate, endDate: endDate, flag: flag.toString() }
    }).then(res => res.data))


    useEffect(() => {
        if (isFetching) {
            queryClient.cancelQueries("singlePredictionStatistics")
        }
        if (endDate) {
            refetch()
        }
    }, [startDate, endDate, flag])


    return (
        <div className="flex justify-center h-screen  overflow-auto bg-lightb-100">

            <div className=" container  bg-gray-100">

                <div className="w-full h-4 mt-12"></div>
                <FilterBar page={"single"} />
                <div className="mt-4 mx-3">
                    <div className="bg-navy-800 w-full py-4 rounded-lg text-left pl-4">
                        <p className="text-2xl text-white uppercase tracking-tight h-8">
                            {isLoading || isFetching ? "" : <div>
                                Flag {data[0].flag}</div>}
                        </p>
                    </div>
                </div>
                <div className="label">
                    <p>Metrics</p>
                </div>
                <div className="itemRow">
                    <div className="item">
                        <Stat type="Precision"
                            isLoading={isLoading}
                            isFetching={isFetching}
                            value={data ?
                                data[0].predictedUpsets / (data[0].predictedUpsets + data[0].falseAlarms)
                                : ""} />
                    </div>
                    <div className="item">
                        <Stat type="Recall" isLoading={isLoading}
                            isFetching={isFetching}
                            value={data ?
                                data[0].predictedUpsets / (data[0].predictedUpsets + data[0].unexpectedUpsets)
                                : ""} />
                    </div>
                    <div className="item">
                        <Stat type="F1-Score" isLoading={isLoading}
                            isFetching={isFetching}
                            value={data ? data[0].predictedUpsets /
                                (data[0].predictedUpsets +
                                    (0.5 * (data[0].unexpectedUpsets + data[0].falseAlarms)))
                                : ""} />
                    </div>
                    {/* - Accuracy Metric, not needed
                    <div className="item">
                        <Stat type="Accuracy" isLoading={isLoading}
                            isFetching={isFetching}
                            value={"N/A"} />
                    </div>
                    */}

                </div>

                <div className="label">
                    <p>Statistics</p>
                </div>
                <div className="itemRow" >
                    {/* style={{ height: "450px", flexGrow: "0" }} */}
                    <div className="item" style={{ minWidth: "900px", height: "450px" }}>
                        <StatBoard data={data ? data[0] : ""} isLoading={isLoading}
                            isFetching={isFetching} isError={isError}
                            flag={flag} />
                    </div>
                </div>

                <div className="itemRow">
                    {/* <div className="ringPlotItem" >
                        <div className="label">
                            <p>Upset Statistics</p>
                        </div>
                        <RingPlot />
                    </div> */}

                    <div className="confusionMatrixItem">
                        <div className="label h-4">
                            <p>Confusion Matrix</p>
                        </div>
                        <ConfusionMatrix data={data} isFetching={isFetching} isLoading={isLoading} />
                    </div>
                    <div className="item flex-col" style={{ padding: "0px" }}>
                        <div className="label w-full">
                            <p>Daily Upset & Prediction Counts</p>
                        </div>
                        <div className="w-full h-full p-4">
                            <DailyCountPlot flag={flag} />
                        </div>
                    </div>
                </div>
                <div className="itemRow" >
                    {/* style={{ height: "450px", flexGrow: "0" }} */}
                    <div className="item flex-col" style={{ height: "450px" }}>
                        <div className="label w-full">
                            <p>Daily Prediction Error Counts</p>
                        </div>
                        <div className="w-full h-full p-4">
                            <DailyPredictionErrorPlot flag={flag} />
                        </div>
                    </div>
                </div>
                <div className="itemRow" >
                    {/* style={{ height: "450px", flexGrow: "0" }} */}
                    <div className="item flex-col overflow-auto" style={{ height: "450px" }}>
                        <div className="label w-full">
                            <p>Colour Band Time Line Plot</p>
                        </div>
                        <div className="w-full h-full p-4 m-4">
                            <ColourBandPlot flag={flag} />
                        </div>
                    </div>
                </div>
                {/* - Second daily Upset & Prediction Count Graph
                <div className="label w-full">
                    <p>Daily Upset & Prediction Counts</p>
                </div>
                <div className="itemRow" style={{ height: "450px" }}>
                    <div className="item flex-col">

                        <DailyCountPlot flag={flag} />
                    </div>
                </div>
                */}

            </div>

        </div>
    )
}

export default PredictionPageById