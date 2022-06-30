import React, { useMemo } from 'react'
import { useTable, useSortBy, usePagination } from 'react-table'
import OpportunityTableLayout from './OpportunityTableLayout'
import { Link } from 'react-router-dom'

const OpportunityTableContent = ({
  opportunityTableData,
  totalOpportunities
}) => {
  const [columns] = useMemo(() => {
    const columns = [
      {
        Header: 'Opportunity',
        accessor: 'opp_type',
        Cell: e => <p className='text-lg font-bold'>{e.value}</p>
      },
      // {
      //     Header: 'Category',
      //     accessor: 'category',
      //     Cell: e => e.value !== null ?
      //         <p className="text-lg">{(e.value)}</p>
      //         : ""
      // },
      {
        Header: '# Opportunities',
        accessor: 'totalOpps',
        Cell: e => e.value ? <p className="text-lg">{parseFloat(e.value).toFixed()}</p> : 0
      },
      {
        Header: 'Avg opportunities per day',
        accessor: 'avgOppPerDay',
        Cell: e => {
          return e.value ? (
            <p className='text-lg'>{parseFloat(e.value).toFixed(2)}</p>
          ) : (
            'N/A'
          )
        }
      },
      {
        Header: 'Max opportunities per day',
        accessor: 'maxOppPerDay',
        Cell: e =>
          e.value ? (
            <p className='text-lg'>{parseFloat(e.value).toFixed()}</p>
          ) : (
            'N/A'
          )
      },
      // {
      //     Header: 'Avg duration (min)',
      //     accessor: 'avgUpsetDuration',
      //     Cell: e => e.value ? <p className="text-lg">{parseFloat(e.value).toFixed()}</p> : "N/A"

      // },
      // {
      //     Header: 'max duration (min)',
      //     accessor: 'maxUpsetDuration',
      //     Cell: e => e.value ? <p className="text-lg">{parseFloat(e.value).toFixed()}</p> : "N/A"

      // },
      // {
      //     Header: 'min duration (min)',
      //     accessor: 'minUpsetDuration',
      //     Cell: e => e.value && e.value != 999999 ? <p className="text-lg">{parseFloat(e.value).toFixed()}</p> : "N/A"

      // },
      {
        Header: 'Avg Time between opportunities (min)',
        accessor: 'avgNormalTime',
        Cell: e =>
          e.value ? (
            <p className='text-lg'>{parseFloat(e.value).toFixed(2)}</p>
          ) : (
            'N/A'
          )
      },
      {
        Header: 'Max time between opportunities (Min)',
        accessor: 'maxNormalTime',
        Cell: e =>
          e.value ? (
            <p className='text-lg'>{parseFloat(e.value).toFixed()}</p>
          ) : (
            'N/A'
          )
      },
      {
        Header: 'Min time between opportunities (Min)',
        accessor: 'minNormalTime',
        Cell: e =>
          e.value && e.value != 999999 ? (
            <p className='text-lg'>{parseFloat(e.value).toFixed()}</p>
          ) : (
            'N/A'
          )
      },
      {
        Header: 'Days',
        accessor: 'totalDays',
        Cell: e =>
          e.value && e.value != 999999 ? (
            <p className='text-lg'>{parseFloat(e.value).toFixed()}</p>
          ) : (
            'N/A'
          )
          },
          {
            Header: 'Browse',
            accessor: '',
            Cell: e => (
              <div>
                <Link
                  className='bg-navy-800 px-4 py-2 text-white rounded-md'
                  to={`/opportunities/${parseFloat(e.row.original['opp_type'].substr(-2))}`}
                >
                  View{' '}
                </Link>
              </div>
            )
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
    ]
    return [columns, opportunityTableData]
  }, [opportunityTableData])
  const tableInstance = useTable(
    {
      columns,
      data: opportunityTableData ? opportunityTableData : [],
      initialState: { pageIndex: 0 }
    },
    useSortBy,
    usePagination
  )
  return (
    <div>
      {opportunityTableData && (
        <OpportunityTableLayout
          {...tableInstance}
          totalOpportunities={totalOpportunities}
        />
      )}
    </div>
  )
}

export default OpportunityTableContent
