import React from 'react'
import { ThreeDots } from 'react-loader-spinner';
import LoadingSpinner from '../../loadingSpinner/LoadingSpinner';
const stat = ({ type, value, isLoading, isFetching, data, upset }) => {

    const style = {
    }
    if (isFetching || isLoading) {
        return (<LoadingSpinner />
        )
    } else {
        return (
            <div className="flex flex-col justify-center text-left w-full">
                <p className="text-3xl pb-3 font-bold">{type}
                </p>
                {!upset &&
                    <p className="w-full text-5xl text-right text-navy-900">
                        {(value != 0 && value != null && value) ? parseFloat(value * 100).toFixed(2) + "%" : "N/A"}
                    </p>}
                {upset &&
                    <p className="w-full text-5xl text-right text-navy-900">
                        {(value != 0 && value != null && value) ? parseInt(value).toFixed() : "N/A"}
                    </p>
                }
                {/* <p>
                            Past quarter: {parseFloat(value).toFixed(2)}
                        </p> */}
            </div>
        )
    }

}

export default stat