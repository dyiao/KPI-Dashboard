import { useState, useEffect, React } from 'react'
import LoadingSpinner from '../../loadingSpinner/LoadingSpinner'


const TotalCount = ({ predictionTableData, setPredictionTableData, data, isLoading, isFetching }) => {

    const [count, setCount] = useState({
        predictionCount: 0,
        upsetCount: 0
    })

    useEffect(() => {
        let upsets = 0;
        let predictions = 0;
        let falseAlarms = 0;
        let predictedUpsets = 0;
        let unexpectedUpsets = 0;

        if (!predictionTableData) return;
        for (let i = 0; i < predictionTableData.length; i++) {
            const item = predictionTableData[i];
            upsets += item.totalUpsets;
            predictions += item.totalWarnings;
            falseAlarms += item.falseAlarms;
            predictedUpsets += item.predictedUpsets;
            unexpectedUpsets += item.unexpectedUpsets;
        }
        setCount({
            predictionCount: predictions, upsetCount: upsets,
            falseAlarms: falseAlarms, predictedUpsets: predictedUpsets, unexpectedUpsets: unexpectedUpsets
        })

    }, [predictionTableData])


    if (isLoading || isFetching && data) {
        return (<div className="m-auto w-full h-full flex justify-center">
            <LoadingSpinner />
        </div>)
    } else {
        return (
            <div className="w-full flex justify-around ">
                <div className="flex">
                    <div className="text-3xl text-yellow-300">{count.predictionCount} </div>
                    <div className="text-xl text-black">total predictions</div>
                </div>


                <div className="flex">
                    <div className="text-3xl text-orange-400">{count.upsetCount}</div>
                    <div className="text-xl text-black">total upsets</div>
                </div>

                <div className="flex">
                    <div className="text-3xl text-green-400">{count.predictedUpsets}</div>
                    <div className="text-xl text-black">upsets predicted</div>
                </div>
                <div className="flex">
                    <div className="text-3xl text-orange-400">{count.falseAlarms}</div>
                    <div className="text-xl text-black">false predictions</div>
                </div>

                <div className="flex">
                    <div className="text-3xl text-red-500">{count.unexpectedUpsets}</div>
                    <div className="text-xl text-black">missed upsets</div>
                </div>

            </div>

        )
    }
}

export default TotalCount