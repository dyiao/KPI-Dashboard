import React, { useState, useContext, useEffect } from 'react'
import { QueryClient, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { DateContext } from '../../../context/DateContext';
import LoadingSpinner from '../../loadingSpinner/LoadingSpinner';
import moment from 'moment';
import {
    ResponsiveContainer, BarChart,
    CartesianGrid, XAxis, YAxis, Tooltip, Legend,
    Bar, Label, Cell
} from 'recharts';

const OpportunityColourBandPlot = ({ flag }) => {
    const [dailyData, setDailyData] = useState([]);
    const queryClient = useQueryClient()
    const { startDate, endDate } = useContext(DateContext);
    const { isLoading, isError, data, error, refetch, isFetching } = useQuery("colourBandPlot", () => axios({
        url: "http://localhost:3001/opportunities/colourBand",
        method: "GET",
        params: { startDate: startDate, endDate: endDate, flag: flag.toString() }
    }).then(res => res.data)
    )

    const formatData = async (data) => {
        if (data !== undefined) {
            let iteration = 0;
            let currentStatus = ""
            for (let dataEntry of data[0]) {
                if (currentStatus !== dataEntry.status) {
                    currentStatus = dataEntry.status
                    iteration = 0;
                }
                dataEntry.duration += iteration;
                iteration += 5;
            }
            setDailyData(data[0]);
        }
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`Status: ${payload[0].payload.status}`}</p>
                    <p className="label">{`Time: ${moment(payload[0].payload.beginTime).subtract(1, "days").utc().format('YYYY/MM/DD HH:MM')}`}</p>
                    <p className="label">{`Current Duration (min): ${payload[0].payload.duration}`}</p>
                </div>
            );
        }

        return null;
    };

    const dayWidth = (dataLength) => {
        let result = (dataLength / 288) * 100;
        return (result) + "%";
    }

    useEffect(() => {
        if (isFetching) {
            queryClient.cancelQueries("colourBandPlot")
        }
        if (endDate) {
            refetch()
        }
    }, [startDate, endDate, flag])

    useEffect(() => {
        formatData(data);
    }, [data])


    if (isFetching || isLoading) {
        return <LoadingSpinner />
    }
    else return (
        <ResponsiveContainer width={dayWidth(dailyData.length)} height="100%">
            <BarChart data={dailyData} barCategoryGap={10}>
                <CartesianGrid strokeDasharray="#f5f5f5" stroke={'black'} />
                <XAxis dataKey="beginTime"
                    //type="number"
                    tickCount={15}
                    /*interval={54}*/
                    tickFormatter={timeStr => moment(timeStr).subtract(1, "days").utc().format('YYYY/MM/DD HH:MM')}
                    domain={['dataMin', 'dataMax']} >
                    <Label value="Duration (Minutes)" position="bottom" />
                </XAxis>
                <YAxis type="number" label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Count">
                    {
                        dailyData.map((entry, _index) => {
                            return (
                                <Cell key={_index} fill={entry.status === "NORMAL" ? '#000077' : '#00FF00'} fillOpacity={0.5} />
                            )
                        })
                    }
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    )
}



export default OpportunityColourBandPlot;