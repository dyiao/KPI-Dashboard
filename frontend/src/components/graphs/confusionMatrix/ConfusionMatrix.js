import React from 'react'
import LoadingSpinner from '../../loadingSpinner/LoadingSpinner'
import "./confusionMatrix.css"

const ConfusionMatrix = ({ data, isFetching, isLoading, TP = 1, FP = 1, FN = 1, TN = 1 }) => {
    if (isFetching || isLoading) {
        return (<div className="h-full flex flex-col justify-center"><LoadingSpinner /></div>)
    } else {
        return (
            <div className="outer">
                <div className="h-6 font-bold" style={{ width: "70%", paddingLeft: "30%" }}> Prediction</div>
                <div className="h-6 flex justify-center" style={{ width: "70%", paddingLeft: "35%" }}>
                    <div className="mx-12">True</div>
                    <div className="mx-16">False</div>

                </div>


                <div className="flex h-full">
                    <div className="verticalColDiv">
                        <div className="verticalCol m-auto font-bold">Actual</div>
                    </div>
                    <div className="verticalColDiv">
                        <div className="verticalCol m-auto">True</div>
                        <div className="verticalCol  m-auto">False</div>
                    </div>

                    <div className="matrix">
                        <div className="quarter bg-navy-900 border-black border-r-4 border-b-4 flex ">
                            <p className="text-5xl text-white m-auto">{data[0].predictedUpsets}</p>
                        </div>
                        <div className="quarter bg-gray-700 border-black border-b-4 flex">
                            <p className="text-5xl text-white m-auto">{data[0].unexpectedUpsets}</p>
                        </div>

                        <div className="quarter bg-gray-700 border-black border-r-4 flex">
                            <p className="text-5xl text-white m-auto">{data[0].falseAlarms}</p>
                        </div>
                        <div className="quarter bg-navy-900 flex">
                            <p className="text-5xl text-white m-auto">{"N/A"}</p>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default ConfusionMatrix