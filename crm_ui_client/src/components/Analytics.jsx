"use strict";

import "./HomePage.css";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';
import AnalyticsAPI from "../api/analytics/AnalyticsAPI.js";
import {useEffect, useState} from "react";

function AnalyticsCharts() {

    const [data, setData] = useState(null)
    const [load, setLoad] = useState(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    let averageTimes = [0, 0, 0, 0, 0, 0] //Number of possible states
    // eslint-disable-next-line react-hooks/exhaustive-deps
    let numberOfElements = [0, 0, 0, 0, 0, 0] //Number of JobOffer which has reached the n status

    useEffect(() => {
        if (!load) {
            AnalyticsAPI.GetElapsedStatusTime().then((result) => {
                    setData(result)
                    setLoad(true)
                    for (let i = 0; i < data.size; i++) { //Number of jobOffers
                        for (let j = 0; j < 6; j++) { //Number of possible states
                            if (data.stats.times[j] != null) { //The data related to that status exists
                                numberOfElements[j]++;
                                averageTimes[j] = averageTimes[j] + data.stats.times[j]
                            } else {
                                break;
                            }
                        }
                    }

                    for (let i = 0; i < 6; i++) {
                        if (numberOfElements[i] !== 0)
                            averageTimes[i] = averageTimes[i] / numberOfElements[i]
                    }
                }
            ).catch()
        }
    }, [averageTimes, data.size, data.stats.times, load, numberOfElements]);


    return (
        <LineChart width={600} height={300} data={averageTimes} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8"/>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip/>
        </LineChart>
    )
}


export default AnalyticsCharts;