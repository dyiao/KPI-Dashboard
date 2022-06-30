import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import axios from 'axios';
import { DateContext } from '../../../context/DateContext'
import { FilterContext } from '../../../context/FilterContext'
import { useQuery } from 'react-query';
import { ThreeDots } from 'react-loader-spinner';
import { useQueryClient } from 'react-query';
import UpsetTableContent from "./UpsetTableContent";
import "../predictionTable/predictionTable.css"


const UpsetTable = () => {

    const { startDate, endDate } = useContext(DateContext);
    const { upsetFlags } = useContext(FilterContext);
    const [upsetTableData, setUpsetTableData] = useState([]);
    const [totalUpset, setTotalUpset] = useState(0);
    const queryClient = useQueryClient()

    const mountRef = useRef(false);

    const { isLoading, isError, data: upsetData, error, refetch, isFetching } = useQuery("upsetTableData1", () => axios({
        url: "http://localhost:3001/status/statistics",
        method: "GET",
        params: { startDate: startDate, endDate: endDate, flag: upsetFlags.toString() }
    }).then(res => res.data)
    )

    const getUpsetCount = (data) => {
        if (!data) return 0;
        if (data.length < 1) return 0;
        let count = 0;
        for (let i = 0; i < data.length; i++) {
            count += data[i].totalUpsets;
        }
        return count;

    }

    useEffect(() => {
        setUpsetTableData(upsetData);
        if (mountRef.current == false) {
            mountRef.current = true;
        } else {
            if (isFetching) {
                queryClient.cancelQueries("upsetTableData1")
            }
            if (endDate) {
                refetch()
            }
        }
    }, [startDate, endDate, upsetFlags])

    useEffect(() => {
        setUpsetTableData(upsetData);
        setTotalUpset(getUpsetCount(upsetData));
    }, [upsetData])

    if (isLoading || isFetching && upsetData) {
        return (<div className="m-auto w-full h-full flex justify-center">
            <ThreeDots type="ThreeDots" color="#034f8a" height="500" width="200" />
        </div>)
    }

    else {
        return (
            <div>
                <UpsetTableContent upsetTableData={upsetData} totalUpset={totalUpset} />
            </div>

        )
    }

}

export default UpsetTable