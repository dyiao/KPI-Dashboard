import React from 'react'
import "./predictionTable.css";




import { ThreeDots } from 'react-loader-spinner';

import { useTable } from 'react-table'
import PredictionTableContent from "./PredictionTableContent";


const PredictionTable = ({ predictionTableData, data, isLoading, isFetching }) => {



    if (isLoading || isFetching && data) {
        return (<div className="m-auto w-full h-full flex justify-center">
            <ThreeDots type="ThreeDots" color="#034f8a" height="500" width="200" />
        </div>)
    }

    else {
        return (
            <PredictionTableContent predictionTableData={predictionTableData} />
        )
    }

}

export default PredictionTable