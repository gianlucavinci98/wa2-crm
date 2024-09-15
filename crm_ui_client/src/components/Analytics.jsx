import "./HomePage.css";
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from 'recharts'
import {useEffect, useState} from "react"
import AnalyticsAPI from "../api/analytics/AnalyticsAPI.js"

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
                    for (let i = 0; i < result.timeStatistic.length; i++) { //Number of jobOffers
                        for (let j = 0; j < 6; j++) { //Number of possible states
                            if (result.timeStatistic[i].jobOfferHistory[j] != null) { //The data related to that status exists
                                numberOfElements[j]++;
                                averageTimes[j] = averageTimes[j] + result.timeStatistic[i].jobOfferHistory[j].timeElapsed
                            } else {
                                break;
                            }
                        }
                    }

                    for (let i = 0; i < 6; i++) {
                        if (numberOfElements[i] !== 0) {
                            averageTimes[i] = (averageTimes[i] / 3600000) / numberOfElements[i]
                        } else {
                            averageTimes[i] = 0
                        }
                    }

                setData([
                        {name: "Created", timeSpent: averageTimes[0]},
                        {name: "Selection Phase", timeSpent: averageTimes[1]},
                        {name: "Candidate Proposal", timeSpent: averageTimes[2]},
                        {name: "Consolidated", timeSpent: averageTimes[3]},
                        {name: "Done", timeSpent: averageTimes[4]},
                        {name: "Aborted", timeSpent: averageTimes[5]}
                    ])
                    setLoad(true)
                }
            ).catch((err) => console.log(err))
        }
    }, [averageTimes, load, numberOfElements]);

    console.log(data)
    return (
        <LineChart width={600} height={300} data={data} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
            <Line type="monotone" dataKey="timeSpent" stroke="#8884d8"/>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
            <XAxis dataKey="name"/>
            <YAxis/>

            <Tooltip/>
        </LineChart>
    )
}


export default AnalyticsCharts;