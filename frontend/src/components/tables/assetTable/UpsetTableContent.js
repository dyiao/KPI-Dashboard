import React, { useMemo } from 'react'
import { useTable, useSortBy, usePagination } from "react-table"
import UpsetTableLayout from './UpsetTableLayout'
import { Link } from "react-router-dom"

const UpsetTableContent
    = ({ upsetTableData, totalUpset }) => {
        const [columns] = useMemo(
            () => {
                const columns = [
                    {
                        Header: 'Flag',
                        accessor: 'flag',
                        Cell: e => <p className="text-lg font-bold">{e.value}</p>
                    },
                    {
                        Header: 'Category',
                        accessor: 'category',
                        Cell: e => e.value !== null ?
                            <p className="text-lg">{(e.value)}</p>
                            : ""
                    },
                    {
                        Header: '# Upsets',
                        accessor: 'totalUpsets',
                        Cell: e =>
                            <p className="text-lg">{e.value}</p>

                    },
                    {
                        Header: 'Avg upsets per day',
                        accessor: 'avgUpsetsPerDay',
                        Cell: e => {
                            return e.value ? <p className="text-lg">{parseFloat(e.value).toFixed(2)}</p> : "N/A"
                        }

                    },
                    {
                        Header: 'Max upsets per day',
                        accessor: 'maxUpsetsPerDay',
                        Cell: e => e.value ? <p className="text-lg">{parseFloat(e.value).toFixed()}</p> : "N/A"

                    },
                    {
                        Header: 'Avg duration (min)',
                        accessor: 'avgUpsetDuration',
                        Cell: e => e.value ? <p className="text-lg">{parseFloat(e.value).toFixed()}</p> : "N/A"

                    },
                    {
                        Header: 'max duration (min)',
                        accessor: 'maxUpsetDuration',
                        Cell: e => e.value ? <p className="text-lg">{parseFloat(e.value).toFixed()}</p> : "N/A"

                    },
                    {
                        Header: 'min duration (min)',
                        accessor: 'minUpsetDuration',
                        Cell: e => e.value && e.value != 999999 ? <p className="text-lg">{parseFloat(e.value).toFixed()}</p> : "N/A"

                    },
                    {
                        Header: 'Avg Time between flags (min)',
                        accessor: 'avgNormalTime',
                        Cell: e => e.value ? <p className="text-lg">{parseFloat(e.value).toFixed(2)}</p> : "N/A"

                    },
                    {
                        Header: 'Max time between flags (Min)',
                        accessor: 'maxNormalTime',
                        Cell: e => e.value ? <p className="text-lg">{parseFloat(e.value).toFixed()}</p> : "N/A"

                    },
                    {
                        Header: 'Min time between flags (Min)',
                        accessor: 'minNormalTime',
                        Cell: e => e.value && e.value != 999999 ? <p className="text-lg">{parseFloat(e.value).toFixed()}</p> : "N/A"
                    },
                    {
                        Header: 'Days',
                        accessor: 'totalDays',
                        Cell: e => e.value && e.value != 999999 ? <p className="text-lg">{parseFloat(e.value).toFixed()}</p> : "N/A"
                    },
                    {
                        Header: 'Browse',
                        accessor: '',
                        Cell: e => <div>
                            <Link className="bg-navy-800 px-4 py-2 text-white rounded-md"
                                to={`/upsets/${e.row.original['flag']}`}>
                                View </Link>
                        </div>
                    }

                    // {
                    //     Header: 'Predicted Upsets',
                    //     accessor: 'predictedUpsets',
                    //     Cell: e =>
                    //         <p className="text-lg">{e.value}</p>
                    // },
                    // {
                    //     Header: 'False Alarms',
                    //     accessor: 'falseAlarms',
                    //     Cell: e =>
                    //         <p className="text-lg">{e.value}</p>
                    // },
                    // {
                    //     Header: 'Unexpected Upsets',
                    //     accessor: 'unexpectedUpsets',
                    //     Cell: e =>
                    //         <p className="text-lg">{e.value}</p>
                    // },
                    // {
                    //     Header: 'Average Warning duration (Min)',
                    //     accessor: 'avgWarningDuration',
                    //     Cell: e => e.value ?
                    //         <p className="text-lg">{parseFloat(e.value).toFixed(2)}</p>
                    //         : "N/A"
                    // },
                    // {
                    //     Header: 'Max Warning Duration',
                    //     accessor: 'maxWarningDuration',
                    //     Cell: e => e.value ?
                    //         <p className="text-lg">{e.value}</p> : "N/A"
                    // },
                    // {
                    //     Header: 'Average Successful Prediction Duration',
                    //     accessor: 'avgPredictedWarningDuration',
                    //     Cell: e => e.value ?
                    //         <p className="text-lg">{parseFloat(e.value).toFixed(2)}</p> : "N/A"
                    // },
                    // {
                    //     Header: 'Min Warning Duration',
                    //     accessor: 'minWarningDuration',
                    //     Cell: e => e.value != 999999 ?
                    //         <p className="text-lg">{parseFloat(e.value).toFixed(2)}</p> : "N/A"
                    // },
                    // {
                    //     Header: '# Days',
                    //     accessor: 'totalDays',
                    //     Cell: e => <p className="text-lg">{e.value}</p>
                    // },
                    // {
                    //     Header: 'Browse',
                    //     accessor: '',
                    //     Cell: e => <div>
                    //         <Link className="bg-navy-800 px-4 py-2 text-white rounded-md"
                    //             to={`/predictions/${e.row.original['flag']}`}>
                    //             View </Link>
                    //     </div>
                    // },

                ];
                return [columns, upsetTableData];
            },
            [upsetTableData]
        );
        const tableInstance = useTable({ columns, data: (upsetTableData ? upsetTableData : []), initialState: { pageIndex: 0 } }, useSortBy, usePagination);
        return (<div>
            {upsetTableData && <UpsetTableLayout {...tableInstance} totalUpset={totalUpset} />}
        </div>
        )
    }

export default UpsetTableContent
