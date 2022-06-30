import React from 'react'
import { useEffect, useState, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { DateContext } from '../../context/DateContext';
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import FilterBar from '../../components/bars/filterBar/FilterBar';
import UpsetStatBoard from '../../components/graphs/upsetById/UpsetStatBoard';
import DailyUpsetPlot from '../../components/graphs/upsetById/DailyUpsetPlot';
import ColourBandPlot from '../../components/graphs/predictionsById/dailyCountPlot/ColourBandPlot';


const UpsetPageById = () => {
    const { startDate, endDate } = useContext(DateContext);

    const { flag } = useParams();
    const queryClient = useQueryClient()

    const { isLoading, isError, data, error, refetch, isFetching } = useQuery("singleUpsetStatistics", () => axios({
        url: "http://localhost:3001/status/statistics",
        method: "GET",
        params: { startDate: startDate, endDate: endDate, flag: flag }
    }).then(res => res.data))


    useEffect(() => {
        if (isFetching) {
            queryClient.cancelQueries("singleUpsetStatistics")
        }
        if (endDate) {
            refetch()
        }
    }, [startDate, endDate, flag])


    return (
        <div className="flex justify-center h-screen  overflow-auto bg-lightb-100">

            <div className=" container ">

                <div className="w-full h-4 mt-12"></div>
                <FilterBar page={"single"} />
                <div className="mt-4 mx-3">
                    <div className="bg-navy-800 w-full py-4 rounded-lg text-left pl-4">
                        <p className="text-2xl text-white uppercase tracking-tight h-8">
                            {isLoading || isFetching ? "" : <div>
                                Upset {data[0].flag}</div>}
                        </p>
                    </div>
                </div>
                <div className="label">
                    <p>Stats</p>
                </div>

                {/* <div className="itemRow">
                    <div className="item">
                        <Stat type="Total upsets"
                            isLoading={isLoading}
                            isFetching={isFetching}
                            upset={true}
                            value={data ?
                                data[0].totalUpsets
                                : ""} />
                    </div>
                </div> */}
                <div className="itemRow" >
                    <div className="item">
                        {/* <Stat type="Precision"
                            isLoading={isLoading}
                            isFetching={isFetching}
                            upset={true}
                            value={data ?
                                data[0].totalUpsets
                                : ""} /> */}
                        <UpsetStatBoard data={data ? data[0] : ""} isFetching={isFetching} isLoading={isLoading} flag={flag} />
                    </div>
                </div>

                <div className="label">
                    <p>Daily Upset Plot</p>
                </div>

                <div className="itemRow" style={{ height: "500px" }}>
                    <div className="item">
                        <DailyUpsetPlot flag={flag} />
                    </div>
                </div>

                <div className="itemRow" >
                    {/* style={{ height: "450px", flexGrow: "0" }} */}
                    <div className="item flex-col overflow-auto" style={{ height: "450px" }}>
                        <div className="label w-full ">
                            <p>Colour Band Time Line Plot</p>
                        </div>
                        <div className="w-full h-full p-4">
                            <ColourBandPlot flag={flag} />
                        </div>
                    </div>
                </div>





            </div>
        </div>
    )
}

export default UpsetPageById