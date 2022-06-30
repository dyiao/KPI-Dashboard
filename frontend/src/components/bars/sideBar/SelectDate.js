import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import "./sidebar.css";

const SelectDate = ({ toggle }) => {
    const [startDate, setStartDate] = useState(new Date("2014/02/08"));
    const [endDate, setEndDate] = useState(new Date("2014/02/10"));
    return (
        <div className={toggle ? "selectDate" : "selectDateHidden"}>
            <div className="my-3">
                <p className="text-lg text-white">Start date:</p>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    value={startDate}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="bg-white rounded-md border-none text-lg "
                />
            </div>
            <div className="my-5">
                <p className="text-lg text-white">End date:</p>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    value={endDate}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="bg-white rounded-md border-none text-lg"
                />
            </div>
            <button className="setButton"
                onClick={(e) => {
                    localStorage.startDate = startDate;
                    localStorage.endDate = endDate;
                }}>Set Date</button>
        </div>
    )
}

export default SelectDate