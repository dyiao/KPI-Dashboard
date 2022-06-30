import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './tabBar.css'

//TODO make the tab on navbar corresponding to current view have some sort of special effect

const TabBar = ({ auth }) => {

  const [currentPage, setCurrentPage] = useState('')

  return (
    <nav
      className='
        absolute
        w-full
        flex flex-wrap
        items-center
        justify-center
        py-2
        bg-white
        text-gray-500
        shadow-lg z-10

        '
    >
      <div className='container-fluid w-4/5 flex items-center justify-between px-6 py-1'>
        {auth ? (
          <ul className='w-full flex justify-around'>
            <li className='nav-item pr-2'>
              <Link
                className={
                  window.location.pathname == '/' ? 'activeNavItem' : 'navItem'
                }
                to='/'
                onClick={e => {
                  setCurrentPage('/')
                }}
              >
                Home
              </Link>
            </li>
            <li className='px-2'>
              <Link
                className={
                  window.location.pathname.startsWith('/upset')
                    ? 'activeNavItem'
                    : 'navItem'
                }
                to='/upset'
                onClick={e => {
                  setCurrentPage('upset')
                }}
              >
                Upsets
              </Link>
            </li>
            <li className='nav-item pr-2'>
              <Link
                className={
                  window.location.pathname.startsWith('/predictions')
                    ? 'activeNavItem'
                    : 'navItem'
                }
                to='/predictions'
                onClick={e => {
                  setCurrentPage('predictions')
                }}
              >
                Predictions
              </Link>
            </li>
            <li className='nav-item pr-2'>
              <Link
                className={
                  window.location.pathname.startsWith('/opportunities')
                    ? 'activeNavItem'
                    : 'navItem'
                }
                to='/opportunities'
                onClick={e => {
                  setCurrentPage('opportunities')
                }}
              >
                Opportunities
              </Link>
            </li>
            {/* <li className='nav-item pr-2'>
            <Link
              className={
                window.location.pathname.startsWith('/login')
                  ? 'activeNavItem'
                  : 'navItem'
              }
              to='/auth/login'
              onClick={e => {
                setCurrentPage('auth/login')
              }}
            >
              Log in
            </Link>
          </li> */}
            <li className='nav-item pr-2'>
              <a className="navItem" href="/auth/logout">Logout</a>
            </li>
          </ul>) :
          <ul className='w-full flex justify-around'>
            <li className='nav-item pr-2'>
              <a className="navItem" href="/auth/login">Login</a>
            </li>
          </ul>
        }
      </div>
    </nav>
  )
}

export default TabBar
