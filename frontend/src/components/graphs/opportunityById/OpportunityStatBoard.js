import React from 'react'

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
                            <div className="numDisplay text-red-400 ">{data.totalOpps}</div>
                            <div className="descriptor">
                                {"Total Opportunities Observed"}
                            </div>
                        </div>

                        <div className="textBox">
                            <div className="numDisplay text-red-400">{parseInt(data.maxOppPerDay)}</div>
                            <div className="descriptor">
                                {"Max Opportunities per day"}
                            </div>

                        </div>

                        <div className="textBox">
                            <div className="numDisplay text-yellow-400">{parseFloat(data.avgOppPerDay).toFixed(3)}</div>
                            <div className="descriptor">
                                {"Average Opportunities per day"}
                            </div>
                        </div>


                    </div>

                    <div className="column">

                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.avgOppDuration)}</div>
                            <div className="descriptor">
                                {"Average Opportunities duration"}
                            </div>
                        </div>
                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.minOppDuration)}</div>
                            <div className="descriptor">
                                {"Minimum Opportunities duration"}
                            </div>
                        </div>
                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.maxOppDuration)}</div>
                            <div className="descriptor">
                                {"Maximum Opportunities duration"}
                            </div>
                        </div>
                        <div className="textBox"></div>
                    </div>

                    <div className="column">
                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.avgNormalTime)}</div>
                            <div className="descriptor">
                                {"Average time between Opportunities"}
                            </div>
                        </div>
                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.minNormalTime)}</div>
                            <div className="descriptor">
                                {"Minimum time between Opportunities"}
                            </div>
                        </div>
                        <div className="textBox">
                            <div className="smallerNumDisplay">{convertTime(data.maxNormalTime)}</div>
                            <div className="descriptor">
                                {"Maximum time between Opportunities"}
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