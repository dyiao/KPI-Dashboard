import React, { useMemo } from 'react'
import { useTable, useSortBy } from "react-table"
import PredictionTableLayout from './PredictionTableLayout'
import { Link } from "react-router-dom"

const PredictionTableContent = ({ predictionTableData }) => {
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
                    Header: '# Predictions',
                    accessor: 'totalWarnings',
                    Cell: e =>
                        <p className="text-lg">{e.value}</p>
                },

                {
                    Header: 'Predicted Upsets',
                    accessor: 'predictedUpsets',
                    Cell: e =>
                        <p className="text-lg">{e.value}</p>
                },
                {
                    Header: 'False Alarms',
                    accessor: 'falseAlarms',
                    Cell: e =>
                        <p className="text-lg">{e.value}</p>
                },
                {
                    Header: 'Unexpected Upsets',
                    accessor: 'unexpectedUpsets',
                    Cell: e =>
                        <p className="text-lg">{e.value}</p>
                },
                {
                    Header: 'Average Warning duration (Min)',
                    accessor: 'avgWarningDuration',
                    Cell: e => e.value ?
                        <p className="text-lg">{parseFloat(e.value).toFixed(2)}</p>
                        : "N/A"
                },
                {
                    Header: 'Max Warning Duration',
                    accessor: 'maxWarningDuration',
                    Cell: e => e.value ?
                        <p className="text-lg">{e.value}</p> : "N/A"
                },
                {
                    Header: 'Average Successful Prediction Duration',
                    accessor: 'avgPredictedWarningDuration',
                    Cell: e => e.value ?
                        <p className="text-lg">{parseFloat(e.value).toFixed(2)}</p> : "N/A"
                },
                {
                    Header: 'Min Warning Duration',
                    accessor: 'minWarningDuration',
                    Cell: e => e.value != 999999 ?
                        <p className="text-lg">{parseFloat(e.value).toFixed(2)}</p> : "N/A"
                },
                {
                    Header: '# Days',
                    accessor: 'totalDays',
                    Cell: e => <p className="text-lg">{parseInt(e.value).toFixed()}</p>
                },
                {
                    Header: 'Browse',
                    accessor: '',
                    Cell: e => <div>
                        <Link className="bg-navy-800 px-4 py-2 text-white rounded-md"
                            to={`/predictions/${e.row.original['flag']}`}>
                            View </Link>
                    </div>
                },

            ];
            return [columns, predictionTableData];
        },
        [predictionTableData]
    );
    const tableInstance = useTable({ columns, data: (predictionTableData ? predictionTableData : []) }, useSortBy);
    return (<div>
        {predictionTableData && <PredictionTableLayout {...tableInstance} />}
    </div>
    )
}

export default PredictionTableContent