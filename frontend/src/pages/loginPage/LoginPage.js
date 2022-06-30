import React from 'react'

const LoginPage = ({ auth, setAuth }) => {
    return (
        <div className='flex justify-center h-screen  overflow-auto bg-lightb-100'>
            <div className='container  '>
                <div className='w-full h-4 mt-12'></div>
                {auth == null ? "null" : "notNull"}
            </div>
        </div>
    )
}

export default LoginPage