import React from 'react'
import { ThreeDots } from 'react-loader-spinner'

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center text-center w-full">
            <div className="m-auto">
                <ThreeDots className="m-auto ml-24" type="ThreeDots" color="#034f8a" height="100" width="100" />
            </div>
        </div>

        // <div className="w-full flex justify-center m-auto text-center">
        //     <div className="m-auto flex text-center">
        //         <ThreeDots type="ThreeDots" className="m-auto w-full" color="#034f8a" height="50%" width="50%" />
        //     </div>
        // </div>
    )
}

export default LoadingSpinner