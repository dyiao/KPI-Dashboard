import React from 'react'
import "./statBoard.css"
import RingPlot from '../ringPlot/RingPlot'

// { totalUpset = 200, totalPredictions = 100, totalCorrectPredictions = 90, upsetsPredicted = 90 / 200, correctPredictions = 90 / 100,
//     totalMissedUpsets = 110, totalFalseAlarams = 50, totalTrueNegatives = 800,
//     totalUpsetTime = 360000, totalPredictionTime = 200000, averageTimeWindow = 300000,
// }

const StatBoard = ({ data, isLoading, isFetching, flag }) => {

    const convertTime = (min) => {
        let d = Math.floor(min / (60 * 24));
        let h = Math.floor((min - d * (60 * 24)) / 60);
        let m = min - d * (60 * 24) - h * 60;
        if (d) {
            return d + "D" + h + "H" + parseFloat(m).toFixed(0) + "M";
        } else if (h) {
            return h + "H" + parseFloat(m).toFixed(0) + "M"
        } else if (m) {
            return parseFloat(m).toFixed(0) + "M"
        } else {
            return "N/A"
        }
    }

    if (!(isLoading || isFetching)) {
        return (
            (<div className="statboard">
                <div className="w-full flex flex-1 flex-wrap h-full text-black">
                    <div className=" text-white w-full h-6 flex justify-start">
                        <div className="w-8 bg-predictions-upset h-full"></div>
                        <p className="text-black mx-1 tracking-tighter"> : Missed Upsets (FN) </p>
                        <div className="w-8 bg-predictions-warning h-full"></div>
                        <p className="text-black mx-1 tracking-tighter"> : False Alarm (FP)</p>
                        <div className="w-8 bg-predictions-correct h-full"></div>
                        <p className="text-black mx-1 tracking-tighter"> : Upsets Predicted (TP)</p>
                    </div>
                    <div className="graph">
                        <RingPlot flag={flag} data={data} />
                    </div>

                    <div className="column">
                        <div className="textBox">
                            <div className="numDisplay text-red-400 ">{data.totalUpsets}</div>
                            <div className="descriptor">
                                {"Total Upsets Observed"}
                            </div>
                        </div>
                        <div className="textBox">
                            <div className="numDisplay text-yellow-400">{data.totalWarnings}</div>
                            <div className="descriptor">
                                {"Total Predictions Made"}
                            </div>
                        </div>

                        <div className="textBox">
                            <div className="numDisplay text-green-400">{data.predictedUpsets}</div>
                            <div className="descriptor">
                                {"Total Correct Predictions Made (TP)"}
                            </div>

                        </div>
                    </div>
                    <div className="column">
                        <div className="textBox">
                            <div className="numDisplay">{data.unexpectedUpsets}</div>
                            <div className="descriptor">
                                {"upsets NOT predicted (FN)"}
                            </div>
                        </div>
                        <div className="textBox">
                            <div className="numDisplay">{data.falseAlarms}</div>
                            <div className="descriptor">
                                {"false predictions (FP)"}
                            </div>
                        </div>
                        <div className="textBox"></div>
                        {/* - True Negative Parameter, not needed
                        <div className="textBox">
                            <div className="numDisplay">
                            </div>
                            <div className="descriptor">
                                {"intervals with no upset or predictions"}
                            </div>
                        </div>
                        */}
                    </div>
                    <div className="column">
                        <div className="textBox">
                            <div className="smallerNumDisplay">
                                {parseFloat(data.predictedUpsets / data.totalUpsets * 100).toFixed(2) + '%'}</div>
                            <div className="descriptor">
                                {"of upsets predicted"}
                            </div>
                        </div>
                        <div className="textBox">
                            <div className="smallerNumDisplay">
                                {parseFloat(data.predictedUpsets / data.totalWarnings * 100).toFixed(2) + '%'}</div>
                            <div className="descriptor">
                                {"of predictions made are correct"}
                            </div>
                        </div>
                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.totalUpsetTime)}</div>
                            <div className="descriptor">
                                {"of total upset time"}
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.totalPredictionTime)}</div>
                            <div className="descriptor">
                                {"of total prediction time"}
                            </div>
                        </div>
                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.avgPredictedWarningDuration)}</div>
                            <div className="descriptor">
                                {"between prediction and upset on average"}
                            </div>
                        </div>
                        <div className="textBox"></div>
                    </div>
                </div>

            </div>))
    } else {
        return ""
    }


}

export default StatBoard