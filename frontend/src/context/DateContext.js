import React, { createContext, useState } from 'react';

export const DateContext = createContext();


export const DateProvider = (props) => {
    const [startDate, setStartDate] = useState(localStorage.startDate ? new Date(localStorage.startDate) :
        new Date(new Date().getTime()));
    const [endDate, setEndDate] = useState(localStorage.endDate ? new Date(localStorage.endDate) : new Date())
    const changeStartDate = (value) => {
        setStartDate(value);
        localStorage.startDate = value;
    }
    const changeEndDate = (value) => {
        setEndDate(value)
        localStorage.endDate = value;
    }
    return (
        <DateContext.Provider value={{ startDate, changeStartDate, endDate, changeEndDate }}>
            {props.children}
        </DateContext.Provider>
    )
}

