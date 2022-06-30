
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Router } from 'react-router-dom'
import TabBar from './components/bars/tabBar/TabBar'
import AssetPage from './pages/assetPage/AssetPage'
import PredictionPage from './pages/predictionPage/PredictionPage'
import '@material-tailwind/react/tailwind.css'
import { DateProvider } from './context/DateContext'
import { FilterProvider } from './context/FilterContext'
import PredictionPageById from './pages/predictionPage/PredictionPageById'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import HomePage from './pages/homePage/HomePage'
import OpportunityPage from './pages/opportunitiesPage/OpportunitiesPage'
import UpsetPageById from './pages/assetPage/UpsetPageById'
import LoginPage from './pages/loginPage/LoginPage'
import OpportunitiesPageById from './pages/opportunitiesPage/OpportunitiesPageById'

function App() {
  const [auth, setAuth] = useState(null);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000,
        retry: (failureCount, error) =>
          failureCount < 10 && (error.status === null || error.status >= 500)
      }
    }
  })
  const [showSidebar, setShowSidebar] = useState(false)
  useEffect(() => {
    axios.get('/auth/current-session').then(({ data }) => {
      setAuth(data);
    })
  }, [])
  if (false) {
    return (
      <Router>
        <Routes>
          <Navigate to="/auth/login" />
        </Routes>
      </Router>)
  } else {
    return (
      <QueryClientProvider client={queryClient}>
        <DateProvider>
          <FilterProvider>
            <BrowserRouter>
              <div className='h-screen w-full'>
                <TabBar auth={auth} />
                {/* <FilterBar /> */}
                {auth ? (
                  <div className='text-center flex justify-end overflow-auto'>
                    {/* <SideBar showSidebar={showSidebar} setShowSidebar={setShowSidebar} /> */}
                    <div
                      className={
                        showSidebar
                          ? ' w-4/5 duration-700'
                          : 'w-full duration-700'
                      }
                    >
                      {/* <MainPage /> */}
                      <Routes>
                        <Route exact path='/' element={<HomePage />} />
                        <Route
                          exact
                          path='/upset'
                          element={<AssetPage />}
                        />
                        <Route
                          path='/upsets/:flag'
                          element={<UpsetPageById />}
                        />

                        <Route
                          exact
                          path='/predictions'
                          element={<PredictionPage />}
                        />
                        <Route
                          path='/predictions/:flag'
                          element={<PredictionPageById />}
                        />
                        <Route
                          exact
                          path='/opportunities'
                          element={<OpportunityPage />}
                        />
                        <Route
                          path='/opportunities/:flag'
                          element={<OpportunitiesPageById />}
                        />
                        <Route
                          exact
                          path='/login'
                          element={<LoginPage auth={auth} setAuth={setAuth} />}
                        />
                      </Routes>
                    </div>
                  </div>) : ""}
              </div>
            </BrowserRouter>
          </FilterProvider>
        </DateProvider>
      </QueryClientProvider>
    )
  }
}

export default App
