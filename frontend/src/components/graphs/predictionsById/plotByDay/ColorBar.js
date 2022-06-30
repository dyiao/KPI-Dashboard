import React, { useState, useEffect } from 'react'
import { ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, Scatter, YAxis, ZAxis, Tooltip, Legend, Line } from 'recharts'
import moment from 'moment'
import axios from 'axios'

const ColorBar = () => {
    const [predictionData, setPredictionData] = useState([]);
    const [upsetData, setUpsetData] = useState([]);
    useEffect((() => {
        const predictionOptions = {
            method: "GET",
            url: "http://localhost:3000/predictions/flagComposition?flag=0"
        }
        axios(predictionOptions)
            .then(res => {
                setPredictionData(res.data[0].warningComposition)
            })
            .catch(err => console.log(err))
        const upsetOptions = {
            method: "GET",
            url: "http://localhost:3000/status/flagComposition?flag=0"
        }
        axios(upsetOptions)
            .then(res => {
                setUpsetData(res.data[0].upsetComposition)
            })
            .catch(err => console.log(err));
    }
    ), [])
    const data01 = [
        {
            "x": 100,
            "y": 200,
            "z": 200
        },
        {
            "x": 120,
            "y": 100,
            "z": 260
        },
        {
            "x": 170,
            "y": 300,
            "z": 400
        },
        {
            "x": 140,
            "y": 250,
            "z": 280
        },
        {
            "x": 150,
            "y": 400,
            "z": 500
        },
        {
            "x": 110,
            "y": 280,
            "z": 200
        }
    ];
    const data02 = [
        {
            "x": 200,
            "y": 260,
            "z": 240
        },
        {
            "x": 240,
            "y": 290,
            "z": 220
        },
        {
            "x": 190,
            "y": 290,
            "z": 250
        },
        {
            "x": 198,
            "y": 250,
            "z": 210
        },
        {
            "x": 180,
            "y": 280,
            "z": 260
        },
        {
            "x": 210,
            "y": 220,
            "z": 230
        }
    ];

    return (
        <ResponsiveContainer height={"100%"} width={"100%"}>
            <ScatterChart width={730} height={250}
                margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="beginTime" name="beginTime" data={predictionData} unit="cm" />
                <YAxis dataKey="warningDurationInMin" name="weight" unit="kg" />
                <ZAxis dataKey="warningDurationInMin" name="score" unit="km" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter data={predictionData} fill="#8884d8" shape={"square"} />

            </ScatterChart>

        </ResponsiveContainer>
    )
}

export default ColorBar