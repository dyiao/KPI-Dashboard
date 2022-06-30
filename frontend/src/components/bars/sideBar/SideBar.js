import React, { useState } from 'react'
import "./sidebar.css";
import { MdDoubleArrow, MdToggleOff, MdDateRange, MdCategory } from 'react-icons/md';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

import "react-datepicker/dist/react-datepicker.css";
import SelectDate from './SelectDate';
import SelectFlag from './SelectFlag';


const SideBar = ({ showSidebar, setShowSidebar }) => {
    const [dateToggle, setDateToggle] = useState(false);
    const [flagToggle, setFlagToggle] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedFlag, setSelectedFlag] = useState([68, 70]);  //change this to empty

    const toggle = (e) => {
        e.preventDefault();
        setShowSidebar(!showSidebar);
    }

    return (
        <div>
            <div className={showSidebar ? "sidebar-active" : "sidebar"}>
                <div className="flex flex-col justify-start h-full">
                    <button className="sidebarItem mx-auto" onClick={(e) => setDateToggle(!dateToggle)}>
                        <div className="sidebarIconText">
                            <MdDateRange className="sidebarItemIcon" />
                            <span className="sidebarItemText">Select Date </span>
                        </div>
                        {dateToggle ?
                            <IoIosArrowUp className="sidebarItemArrow" />
                            :
                            <IoIosArrowDown className="sidebarItemArrow" />}
                    </button>

                    {dateToggle ?
                        <SelectDate toggle={true} /> : <SelectDate toggle={false} />}

                    <button className="sidebarItem mx-auto" onClick={(e) => setFlagToggle(!flagToggle)}>
                        <div className="sidebarIconText">
                            <MdCategory className="sidebarItemIcon" />
                            <span className="sidebarItemText">Select Category </span>
                        </div>
                        {flagToggle ?
                            <IoIosArrowUp className="sidebarItemArrow" />
                            :
                            <IoIosArrowDown className="sidebarItemArrow" />}
                    </button>

                    {flagToggle ?
                        <SelectFlag toggle={true}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            selectedFlag={selectedFlag}
                            setSelectedFlag={setSelectedFlag} />
                        : <SelectFlag toggle={false}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            selectedFlag={selectedFlag}
                            setSelectedFlag={setSelectedFlag} />}
                </div>

            </div>

            <button
                className={showSidebar ? "btn-active" : "btn-inactive"}
                onClick={toggle}>
                {showSidebar
                    ? <MdDoubleArrow className="toggle-active" />
                    : <MdDoubleArrow className="toggle-inactive" />}
            </button>
        </div>
    )
}

export default SideBar