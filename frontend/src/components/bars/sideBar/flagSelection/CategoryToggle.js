import React from 'react'
import { flagByCategory } from '../flags/flagByCategory'
import FlagToggle from './FlagToggle'
import "../sidebar.css"
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

const CategoryToggle = ({ category, setSelectedCategory, selectedCategory, selectedFlag, setSelectedFlag }) => {
    const chooseCategory = ((e) => {
        if (!selectedCategory.includes(category)) {
            setSelectedCategory(selectedCategory.concat(e.target.value));
        } else {
            setSelectedCategory(selectedCategory.filter((item) => {
                return item !== e.target.value
            }))
        }
    })

    const chooseCategoryArrow = ((e) => {
        e.stopPropagation();
        if (!selectedCategory.includes(category)) {
            setSelectedCategory(selectedCategory.concat(category));
        } else {
            setSelectedCategory(selectedCategory.filter((item) => {
                return item !== category
            }))
        }
    })
    return (
        <div>
            <button className={
                selectedCategory.includes(category) ? "collapsedCategory" : "notCollapsedCategory"
            } onClick={chooseCategory} value={category}>
                {category}

                {selectedCategory.includes(category) ?
                    <IoIosArrowUp className="collapseArrow" onClick={chooseCategoryArrow} /> :
                    <IoIosArrowDown className="collapseArrow" onClick={chooseCategoryArrow} />}
            </button>

            {selectedCategory.includes(category) ? (
                <FlagToggle flags={flagByCategory[category]}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedFlag={selectedFlag}
                    setSelectedFlag={setSelectedFlag} />) : ""}
        </div>
    )
}

export default CategoryToggle