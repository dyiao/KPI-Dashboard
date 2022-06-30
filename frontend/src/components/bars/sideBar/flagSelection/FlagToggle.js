import React from 'react'

const FlagToggle = ({ flags, setSelectedCategory, selectedCategory, selectedFlag, setSelectedFlag }) => {

    const chooseFlags = (e) => {
        if (e.target.checked) {
            setSelectedFlag(selectedFlag.concat(e.target.value))
        } else {
            setSelectedFlag(selectedFlag.filter((item) => item !== e.target.value))
        }
    }
    let arr = [];

    return (
        <div className="flex flex-col justify-center">
            {flags.map((item, key) => {
                return <div>
                    <div className="flagCheckbox "
                        value={item}>
                        {selectedFlag.includes(item) ? <input className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white
                         checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-middle
                         bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value={item}
                            onChange={chooseFlags} checked />
                            : <input className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white
                            checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-middle
                            bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value={item}
                                onChange={chooseFlags} />}

                        <label className="form-check-label inline-block text-white">
                            Flag {item}
                        </label>
                    </div>


                </div>
            })}
        </div>
    )
}

export default FlagToggle