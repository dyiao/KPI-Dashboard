import React, { useState, useEffect, useContext, useRef, useMemo } from 'react'
import "./predictionPage.css"
import FilterBar from '../../components/bars/filterBar/FilterBar'

import PredictionTable from '../../components/tables/predictionTable/PredictionTable'
import CountById from '../../components/graphs/predictions/CountById'
import TotalCount from '../../components/graphs/predictions/TotalCount'

import { FilterContext } from '../../context/FilterContext'
import axios from 'axios';
import { DateContext } from '../../context/DateContext'
import { useQuery } from 'react-query';
import { useQueryClient } from 'react-query';



const PredictionPage = () => {
  const queryClient = useQueryClient()


  const { predictionFlags } = useContext(FilterContext);

  const [carousel, setCarousel] = useState(false)
  const [predictionTableData, setPredictionTableData] = useState([]);
  const { startDate, endDate } = useContext(DateContext);
  const mountRef = useRef(false);

  const { isLoading, isError, data, error, refetch, isFetching } = useQuery(["predictionTableData"], () => axios({
    url: "http://localhost:3001/performance/statistics",
    method: "GET",
    params: { startDate: startDate, endDate: endDate, flag: predictionFlags.toString() }
  }).then(res => res.data)
  )


  useEffect(() => {
    setPredictionTableData(data);
    if (mountRef.current == false) {
      mountRef.current = true;
    } else {
      if (isFetching) {
        queryClient.cancelQueries("predictionTableData")
      }
      if (endDate) {
        refetch()
      }
    }
  }, [startDate, endDate, predictionFlags])

  useEffect(() => {
    setPredictionTableData(data);
  }, [data])

  useEffect(() => {
    setCarousel(true);
    return () => {
      setCarousel(false);
    };
  }, [carousel]);

  return (
    <div className="flex justify-center h-screen  overflow-auto bg-lightb-100">

      <div className=" container  bg-gray-100">

        <div className="w-full h-4 mt-12"></div>
        <FilterBar page={"predictions"} />


        <div className='itemRow p-2'>
          <div className="item" style={{ justifyContent: "center" }}>
            <TotalCount predictionTableData={predictionTableData} setPredictionTableData={setPredictionTableData}
              data={data}
              isLoading={isLoading} isFetching={isFetching} />
          </div>
        </div>

        <div className='label'>
          <p>Prediction Statistics</p>
        </div>

        <div className='itemRow p-2'>
          <div className='upsetStats'>
            <PredictionTable predictionTableData={predictionTableData} setPredictionTableData={setPredictionTableData} data={data}
              isLoading={isLoading} isFetching={isFetching} />
          </div>
        </div>

        <div className='label'>
          <p>Daily Counts</p>
        </div>
        <div className='itemRow p-2'>
          <div className='item h-96'>
            <CountById />
          </div>
        </div>

      </div>

    </div>
  )
}

export default PredictionPage