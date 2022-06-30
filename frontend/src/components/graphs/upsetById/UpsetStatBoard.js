import React from 'react'

// { totalUpset = 200, totalPredictions = 100, totalCorrectPredictions = 90, upsetsPredicted = 90 / 200, correctPredictions = 90 / 100,
//     totalMissedUpsets = 110, totalFalseAlarams = 50, totalTrueNegatives = 800,
//     totalUpsetTime = 360000, totalPredictionTime = 200000, averageTimeWindow = 300000,
// }

const UpsetStatBoard = ({ data, isLoading, isFetching, flag }) => {

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
                <div className="w-full flex flex-1 flex-wrap justify-around h-full text-black">

                    <div className="column">
                        <div className="textBox">
                            <div className="numDisplay text-red-400 ">{data.totalUpsets}</div>
                            <div className="descriptor">
                                {"Total Upsets Observed"}
                            </div>
                        </div>

                        <div className="textBox">
                            <div className="numDisplay text-red-400">{parseInt(data.maxUpsetsPerDay)}</div>
                            <div className="descriptor">
                                {"Max Upsets per day"}
                            </div>

                        </div>

                        <div className="textBox">
                            <div className="numDisplay text-yellow-400">{parseFloat(data.avgUpsetsPerDay).toFixed(3)}</div>
                            <div className="descriptor">
                                {"Average Upsets per day"}
                            </div>
                        </div>


                    </div>

                    <div className="column">

                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.avgUpsetDuration)}</div>
                            <div className="descriptor">
                                {"Average upset duration"}
                            </div>
                        </div>
                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.minUpsetDuration)}</div>
                            <div className="descriptor">
                                {"Minimum upset duration"}
                            </div>
                        </div>
                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.maxUpsetDuration)}</div>
                            <div className="descriptor">
                                {"Maximum upset duration"}
                            </div>
                        </div>
                        <div className="textBox"></div>
                    </div>

                    <div className="column">
                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.avgNormalTime)}</div>
                            <div className="descriptor">
                                {"Average time between upsets"}
                            </div>
                        </div>
                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.minNormalTime)}</div>
                            <div className="descriptor">
                                {"Minimum time between upsets"}
                            </div>
                        </div>
                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.maxNormalTime)}</div>
                            <div className="descriptor">
                                {"Maximum time between upsets"}
                            </div>
                        </div>
                    </div>
                </div>

            </div>))
    } else {
        return ""
    }


}

export default UpsetStatBoard