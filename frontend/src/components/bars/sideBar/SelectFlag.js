import React from 'react'
import { flagByCategory } from './flags/flagByCategory'
import CategoryToggle from './flagSelection/CategoryToggle'
const SelectFlag = ({ toggle, selectedCategory, setSelectedCategory, selectedFlag, setSelectedFlag }) => {
    const categories = [
        {
            "_id": "category 1",
            "count": 529
        },
        {
            "_id": "category 0",
            "count": 1610
        },
        {
            "_id": "category 2",
            "count": 529
        },
        {
            "_id": "category 3",
            "count": 46
        }
    ]
    // use a state for category -> uncollapsing a category -> adding it to the state, else remove it 
    // use a state for flag -> checking the flag -> adding it to the state, else remove 
    // for each flag under the categories ->either pass it as a prop or let the flags sort inside the categories.
    return (
        <div className={toggle ? "selectCategory" : "selectCategoryHidden "}>

            {categories.map((item, key) => {
                return (<CategoryToggle category={item._id}
                    key={item._id}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedFlag={selectedFlag}
                    setSelectedFlag={setSelectedFlag} />)
            })}

            <button className="setFlagButton" onClick={(e) => {
                console.log(selectedFlag)
                localStorage.flags = selectedFlag
            }}>Set flags</button>
        </div>
    )
}

export default SelectFlag