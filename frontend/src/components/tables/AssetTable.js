import React, { useState, useEffect, useContext, useRef } from 'react'
import "./assetTable.css"
import { Link } from 'react-router-dom'
import axios from 'axios';
import { DateContext } from '../../context/DateContext'
import { FilterContext } from '../../context/FilterContext'
import { useQuery } from 'react-query';
import { ThreeDots } from 'react-loader-spinner';
import { useQueryClient } from 'react-query';



const AssetTable = () => {
    const queryClient = useQueryClient()
    const { startDate, changeStartDate, endDate, changeEndDate } = useContext(DateContext);
    const { upsetFlags, chooseUpsetFlags } = useContext(FilterContext);

    const mountRef = useRef(false);

    const { isLoading, isError, data, error, refetch, isFetching } = useQuery("upsetTableData", () => axios({
        url: "http://localhost:3001/status/flagComposition",
        method: "GET",
        params: { startDate: startDate, endDate: endDate, flag: upsetFlags.toString() }
    }).then(res => res.data)
    )

    useEffect(() => {
        if (mountRef.current == false) {
            mountRef.current = true;
        } else {
            if (isFetching) {
                queryClient.cancelQueries("upsetTableData")
            }
            if (endDate) {
                refetch()
            }
        }
    }, [startDate, endDate, upsetFlags])

    // {
    //     url: "http://localhost:3000/status/flagComposition",
    //         method: "GET",
    //             params: { startDate: startDate, endDate: endDate, flag: upsetFlags.toString() }
    // }
    // useEffect(() => {
    //     const options = {
    //         url: "http://localhost:3000/status/flagComposition",
    //         method: "GET",
    //         params: { startDate: startDate, endDate: endDate, flag: upsetFlags.toString() }

    //     }
    //     axios(options)
    //         .then(res => {
    //             setTableData(res.data);
    //             console.log(res.data)
    //         })
    //     console.log(options.params);
    // }, [upsetFlags, startDate, endDate])

    // const upsetStats = [
    //     {
    //         name: 'Flag 1',
    //         category: 'Category 1',
    //         totalUpsets: 355,
    //         totalDays: 25,
    //         avgUpset: 20,
    //         maxUpset: 23,
    //         minUpset: 0,
    //         avgTimeUpset: 3600,
    //         maxTimeUpset: 60000,
    //         avgUpsetDuration: 5,
    //         maxUpsetDuration: 2000,
    //         minUpsetDuration: 0
    //     }
    // ]

    if (isLoading || isFetching) {
        return (<div className="m-auto w-full h-full flex justify-center">
            <ThreeDots type="ThreeDots" color="#034f8a" height="500" width="200" />
        </div>)
    }
    else {
        return (
            <div className="-my-2 overflow-x-auto h-full sm:-mx-6 lg:-mx-8 overflow-y-hidden">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 h-full w-full">
                    <table className="table">
                        <thead className="bg-gray-100 block">
                            <tr className="">
                                <th className="tableHeader">Flag Name</th>
                                <th className="tableHeader">Category</th>
                                <th className="tableHeader"># Upsets</th>
                                <th className="tableHeader"># Days</th>
                                <th className="tableHeader">Avg upsets/day</th>
                                <th className="tableHeader">Max upsets/day</th>
                                {/* <th className="tableHeader">Min upsets/day</th> */}
                                <th className="tableHeader">Avg time between flags (Min)</th>
                                <th className="tableHeader">Max time between flags (Min)</th>
                                <th className="tableHeader">Avg duration (Min)</th>
                                <th className="tableHeader">Min duration (Min)</th>
                                <th className="tableHeader">Max duration (Min)</th>
                                <th className="tableHeader">Browse</th>

                            </tr>
                        </thead>
                        {/* divide-y divide-gray-200 divide-x-2 */}
                        <tbody className="bg-white block">
                            {data.map((upset) => (
                                <tr key={upset.name} className=" w-full">
                                    <td className="tableData">
                                        {<p className="text-xl font-bold">{upset?.flag}</p>}
                                    </td>
                                    <td className="tableData">
                                        {<p className="text-xl">{upset?.category}</p>}
                                    </td>
                                    <td className="tableData">
                                        {upset.upsetStatistics ? <p className="text-lg">{upset.upsetStatistics[0].stats.totalUpsets}</p> : "N/A"}
                                    </td>
                                    <td className="tableData">
                                        {upset.upsetStatistics ? <p className="text-lg">{upset.upsetStatistics[0].stats.totalDays}</p> : "N/A"}
                                    </td>
                                    <td className="tableData">
                                        {upset.upsetStatistics !== null ? <p className="text-lg">{parseFloat(upset.upsetStatistics[0].stats.avgUpsetsPerDay).toFixed(3)}</p> : "N/A"}
                                    </td>
                                    <td className="tableData">
                                        {upset.upsetStatistics ?
                                            upset.upsetStatistics[0].stats.maxUpsetsPerDay ?
                                                <p className="text-lg">{(upset.upsetStatistics[0].stats.maxUpsetsPerDay)}</p> : "0" : "N/A"}
                                    </td>
                                    {/* <td className="tableData">
                                        {upset.upsetStatistics ? <p className="text-lg">{(upset.upsetStatistics[0].stats.minUpsetsPerDay)}</p> : "N/A"}
                                    </td> */}
                                    <td className="tableData">
                                        {upset.upsetStatistics ?
                                            (upset.upsetStatistics[0].stats.avgNormalTime) !== null && (upset.upsetStatistics[0].stats.avgNormalTime) != 0 ?
                                                <p className="text-lg">{parseFloat(upset.upsetStatistics[0].stats.avgNormalTime).toFixed(2)}</p> : "N/A" : "N/A"}
                                    </td>
                                    <td className="tableData">
                                        {upset.upsetStatistics ?
                                            (upset.upsetStatistics[0].stats.maxNormalTime) !== null && (upset.upsetStatistics[0].stats.maxNormalTime) != 0 ?
                                                <p className="text-lg">{(upset.upsetStatistics[0].stats.maxNormalTime)}</p> : "N/A" : "N/A"}
                                    </td>
                                    <td className="tableData">
                                        {upset.upsetStatistics ?
                                            (upset.upsetStatistics[0].stats.avgUpsetDuration) !== null && (upset.upsetStatistics[0].stats.avgUpsetDuration) != 0 ?
                                                <p className="text-lg">{(parseFloat(upset.upsetStatistics[0].stats.avgUpsetDuration)).toFixed(2)}</p> : "N/A" : "N/A"}
                                    </td>

                                    <td className="tableData">
                                        {upset.upsetStatistics ?
                                            (upset.upsetStatistics[0].stats.minUpsetDuration) !== null && (upset.upsetStatistics[0].stats.minUpsetDuration) != 999999 ?
                                                <p className="text-lg">{(parseFloat(upset.upsetStatistics[0].stats.minUpsetDuration)).toFixed(2)}</p> : "N/A" : "N/A"}
                                    </td>

                                    <td className="tableData">
                                        {upset.upsetStatistics ? <p className="text-lg">{upset.upsetStatistics[0].stats.maxUpsetDuration}</p> : "N/A"}
                                    </td>
                                    <td className="tableData">
                                        <Link to={``}>
                                            <button className="bg-navy-800 hover:bg-navy-900 text-white font-bold py-2 px-4 rounded">
                                                View
                                            </button>
                                        </Link>
                                    </td>




                                    {/* <td className="whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{person.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                        Edit
                                    </a>
                                </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>)
    }

}

export default AssetTable
