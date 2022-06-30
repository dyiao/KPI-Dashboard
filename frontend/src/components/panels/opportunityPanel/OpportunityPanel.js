import React, { useEffect } from 'react'
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import LoadingSpinner from '../../loadingSpinner/LoadingSpinner';
import { FilterContext } from "../../../context/FilterContext";
import { TiArrowUpThick, TiArrowDownThick } from 'react-icons/ti'
import HomepageOpportunityBarPlot from '../../graphs/barPlot/HomepageOpportunityBarPlot';

const OpportunityPanel = ({ view, currDate, midDate, firstDate }) => {

    const queryClient = useQueryClient()
    const { isLoading: currIsLoading, isError: currIsError,
        data: currData, error: currError, refetch: currRefetch,
        isFetching: currIsFetching } = useQuery('currentOpportunityBarData', () => axios({
            url: "http://localhost:3001/opportunities/opportunityBarChart",
            method: "GET",
            params: { startDate: midDate, endDate: currDate }
        }).then(res => res.data)
    )

    const { isLoading: prevIsLoading, isError: prevIsError,
        data: prevData, error: prevError, refetch: prevRefetch,
        isFetching: prevIsFetching } = useQuery('previousOpportunityBarData', () => axios({
            url: "http://localhost:3001/opportunities/opportunityBarChart",
            method: "GET",
            params: { startDate: firstDate, endDate: midDate }
        }).then(res => res.data)
    )

    useEffect(() => {
        if (currIsFetching) {
            queryClient.cancelQueries("currentOpportunityBarData")
        }
        currRefetch();
        if (prevIsFetching) {
            queryClient.cancelQueries("previousOpportunityBarData")
        }
        prevRefetch();
        currRefetch();
    }, [firstDate, midDate])

    const getCount = (data) => {
        if (data) {
            let count = 0;
            for (let i = 0; i < data.length; i++) {
                if (!data[i].TotalOpportunities) continue;
                count += data[i].TotalOpportunities;
            }
            return count;
        } else return 0;
    }

    const calcDiff = (curr, prev) => {
        const diff = "(" + parseFloat((curr - prev) / prev * 100).toFixed(2) + "%" + ")";
        return diff
    }

    if (currIsLoading || currIsFetching) {
        return <div className="w-full m-auto">
            <LoadingSpinner />
        </div>
    } else {
        return (
            <div className="item">
                <div className="w-full h-full flex justify-start ">
                    <div className=' w-full'>
                        <HomepageOpportunityBarPlot data={currData} />
                    </div>
                    <div className="w-full h-full ">{(currData && prevData) ? (
                        <div>
                            <div className="w-full h-full flex flex-col flex-start mt-36 ">

                                <div className=' flex justify-start  w-full align-text-bottom h-16'>
                                    <div className="text-5xl h-full flex-0 text-red-400 flex flex-col justify-end">{getCount(currData) ? getCount(currData) : 0}</div>
                                    <div className="text-2xl flex-0  h-full flex flex-col justify-end pl-2">Total Opportunities</div>
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
                        </div>
                    ) : ""}</div>
                </div>
            </div>
        )
    }
}

export default OpportunityPanel