
import React, { useState, useContext, useEffect } from 'react'
import UpsetPieChart from '../../graphs/upsetPieChart/UpsetPieChart'
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import LoadingSpinner from '../../loadingSpinner/LoadingSpinner';
import { FilterContext } from "../../../context/FilterContext";
import { TiArrowUpThick, TiArrowDownThick } from 'react-icons/ti'
import StatsRadialChart from '../../graphs/predictionCharts/StatsRadialChart';
import HomePageBarChart from '../../graphs/predictionCharts/HomePageBarChart';



const PredictionPanel = ({ currDate, midDate, firstDate }) => {

    const calcDiff = (curr, prev) => {
        const diff = "(" + parseFloat((curr - prev) / prev * 100).toFixed(2) + "%" + ")";
        return diff
    }
    const genStats = (data) => {
        if (!data || !data.length) {
            return [
                { name: "precision", value: 0, fill: "#38b000" },
                { name: "recall", value: 0, fill: "#ffdd00" },
                { name: "f1 score", value: 0, fill: "#01befe" }];
        }
        let totalPredictedUpsets = 0;
        let totalUnexpectedUpsets = 0;
        let totalFalseAlarms = 0;

        for (let i = 0; i < data.length; i++) {
            totalPredictedUpsets += data[i].predictedUpsets;
            totalUnexpectedUpsets += data[i].unexpectedUpsets;
            totalFalseAlarms += data[i].falseAlarms;
        }
        const precision = totalPredictedUpsets / (totalPredictedUpsets + totalFalseAlarms);
        const recall = totalPredictedUpsets / (totalPredictedUpsets + totalUnexpectedUpsets);
        const f1score = totalPredictedUpsets /
            (totalPredictedUpsets +
                (0.5 * (totalUnexpectedUpsets + totalFalseAlarms)))

        const result = [
            { name: "totalPredictedUpsets", value: totalPredictedUpsets },
            { name: "totalUnexpectedUpsets", value: totalUnexpectedUpsets },
            { name: "totalFalseAlarms", value: totalFalseAlarms }];

        const calced = [
            { name: "precision", value: precision ? precision : 0, fill: "#38b000" },
            { name: "recall", value: recall ? recall : 0, fill: "#ffdd00" },
            { name: "f1 score", value: f1score ? f1score : 0, fill: "#01befe" }]
        return calced;
    }

    const getTotals = (data) => {
        let totalPredictedUpsets = 0;
        let totalUnexpectedUpsets = 0;
        let totalFalseAlarms = 0;
        let totalUpsets = 0;

        for (let i = 0; i < data.length; i++) {
            totalPredictedUpsets += data[i].predictedUpsets;
            totalUnexpectedUpsets += data[i].unexpectedUpsets;
            totalFalseAlarms += data[i].falseAlarms;
            totalUpsets += data[i].totalUpsets;
        }
        const precision = totalPredictedUpsets / (totalPredictedUpsets + totalFalseAlarms);
        const recall = totalPredictedUpsets / (totalPredictedUpsets + totalUnexpectedUpsets);
        const f1score = totalPredictedUpsets /
            (totalPredictedUpsets +
                (0.5 * (totalUnexpectedUpsets + totalFalseAlarms)))

        const result = [
            { name: "totalPredictedUpsets", value: totalPredictedUpsets },
            { name: "totalUnexpectedUpsets", value: totalUnexpectedUpsets },
            { name: "totalFalseAlarms", value: totalFalseAlarms },
            { name: 'totalUpsets', value: totalUpsets }];

        return result;
    }

    const { allPredictionFlags } = useContext(FilterContext);



    const queryClient = useQueryClient()
    const { isLoading: currIsLoading, isError: currIsError,
        data: currData, error: currError, refetch: currRefetch,
        isFetching: currIsFetching } = useQuery("currentPredictionStats", () => axios({
            url: "http://localhost:3001/performance/statistics",
            method: "GET",
            params: { startDate: midDate, endDate: currDate, flag: "default" }
        }).then(res => res.data)
        )

    const { isLoading: prevIsLoading, isError: prevIsError,
        data: prevData, error: prevError, refetch: prevRefetch,
        isFetching: prevIsFetching } = useQuery("previousPredictionStats", () => axios({
            url: "http://localhost:3001/performance/statistics",
            method: "GET",
            params: { startDate: firstDate, endDate: midDate, flag: "default" }
        }).then(res => res.data)
        )


    useEffect(() => {
        if (currIsFetching) {
            queryClient.cancelQueries("currentPredictionStats")
        }
        currRefetch();
        if (prevIsFetching) {
            queryClient.cancelQueries("previousPredictionStats")
        }
        prevRefetch();
        currRefetch();

    }, [firstDate, midDate])




    if (currIsLoading || currIsFetching || prevIsLoading || prevIsFetching) {
        return <div className="w-full m-auto">
            <LoadingSpinner />
        </div>
    } else {
        return (
            <div className="item">
                <div className="w-full h-full flex justify-start ">
                    <div className="h-full  flex flex-col justify-end pt-5" style={{ maxWidth: "800px", width: "600px", minWidth: "400px" }}>
                        <div className="text-2xl flex m-auto py-1">
                            Precision:
                            <div>
                                {parseFloat(genStats(currData)[0].value * 100).toFixed(2) + "%"}
                            </div>
                            <div className={genStats(currData)[0].value >= genStats(prevData)[0].value ? "text-green-400 flex" : "text-red-400 flex"}>
                                {genStats(currData)[0].value >= genStats(prevData)[0].value ? <TiArrowUpThick /> : <TiArrowDownThick />}
                                {calcDiff(genStats(currData)[0].value, genStats(prevData)[0].value)}
                            </div>
                        </div>
                        <div className="text-2xl flex m-auto py-1">
                            Recall:
                            <div>
                                {parseFloat(genStats(currData)[1].value * 100).toFixed(2) + "%"}
                            </div>
                            <div className={genStats(currData)[1].value >= genStats(prevData)[1].value ? "text-green-400 flex" : "text-red-400 flex"}>
                                {genStats(currData)[1].value >= genStats(prevData)[1].value ? <TiArrowUpThick /> : <TiArrowDownThick />}
                                {calcDiff(genStats(currData)[1].value, genStats(prevData)[1].value)}
                            </div>
                        </div>
                        <div className="text-2xl flex m-auto py-1 ">
                            F1 Score:
                            <div>
                                {parseFloat(genStats(currData)[2].value * 100).toFixed(2) + "%"}
                            </div>
                            <div className={genStats(currData)[2].value >= genStats(prevData)[2].value ? "text-green-400 flex" : "text-red-400 flex"}>
                                {genStats(currData)[2].value >= genStats(prevData)[2].value ? <TiArrowUpThick /> : <TiArrowDownThick />}
                                {calcDiff(genStats(currData)[2].value, genStats(prevData)[2].value)}
                            </div>
                        </div>
                        <div className="w-full h-full">
                            <StatsRadialChart data={genStats(currData)} />
                        </div>
                    </div>
                    <div className="w-full h-full flex flex-col justify-center pl-18" style={{ alignContent: "flex-start" }}>
                        <div className="text-2xl flex py-1">
                            <div className="text-5xl text-yellow-400">
                                {getTotals(currData)[3].value}
                            </div>
                            Total Upsets
                            <div className={getTotals(currData)[3].value >= getTotals(prevData)[3].value ? "text-green-400 flex" : "text-red-400 flex"}>
                                {getTotals(currData)[3].value >= getTotals(prevData)[3].value ? <TiArrowUpThick /> : <TiArrowDownThick />}
                                {calcDiff(getTotals(currData)[3].value, getTotals(prevData)[3].value)}
                            </div>
                        </div>
                        <div className="text-2xl flex py-1 ">

                            <div className="text-5xl text-green-500">
                                {getTotals(currData)[0].value}
                            </div>
                            Correctly Predicted Upsets
                            <div className={getTotals(currData)[0].value >= getTotals(prevData)[0].value ? "text-green-400 flex" : "text-red-400 flex"}>
                                {getTotals(currData)[0].value >= getTotals(prevData)[0].value ? <TiArrowUpThick /> : <TiArrowDownThick />}
                                {calcDiff(getTotals(currData)[0].value, getTotals(prevData)[0].value)}
                            </div>
                        </div>
                        <div className="text-2xl flex  py-1  ">
                            <div className="text-5xl text-red-500">
                                {getTotals(currData)[1].value}
                            </div>
                            Total Unpredicted Upsets
                            <div className={getTotals(currData)[1].value >= getTotals(prevData)[1].value ? "text-green-400 flex" : "text-red-400 flex"}>
                                {getTotals(currData)[1].value >= getTotals(prevData)[1].value ? <TiArrowUpThick /> : <TiArrowDownThick />}
                                {calcDiff(getTotals(currData)[1].value, getTotals(prevData)[1].value)}
                            </div>
                        </div>

                        <div className="text-2xl flex py-1  ">
                            <div className="text-5xl text-orange-400">
                                {getTotals(currData)[2].value}
                            </div>
                            False Predictions
                            <div className={getTotals(currData)[2].value >= getTotals(prevData)[2].value ? "text-green-400 flex" : "text-red-400 flex"}>
                                {getTotals(currData)[2].value >= getTotals(prevData)[2].value ? <TiArrowUpThick /> : <TiArrowDownThick />}
                                {calcDiff(getTotals(currData)[2].value, getTotals(prevData)[2].value)}
                            </div>
                        </div>

                    </div>
                    <div className="w-full h-full ">
                        <HomePageBarChart data={currData} />
                    </div>

                </div>
            </div>
        )
    }
}

export default PredictionPanel