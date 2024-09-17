import "./HomePage.css";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
    ResponsiveContainer, Rectangle
} from 'recharts'
import {useEffect, useState} from "react"
import AnalyticsAPI from "../api/analytics/AnalyticsAPI.js"


function TimeElapsedChart() {
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
                                averageTimes[j] = averageTimes[j] + (result.timeStatistic[i].jobOfferHistory[j].timeElapsed / result.timeStatistic[i].jobOfferHistory[j].count)
                            } else {
                                break;
                            }
                        }
                    }

                    for (let i = 0; i < 6; i++) {
                        if (numberOfElements[i] !== 0) {
                            averageTimes[i] = (averageTimes[i] / (3600000 * 8 * numberOfElements[i])) /* from millies to working days (8hrs) */
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

    return (
        <ResponsiveContainer width={"60%"} height={"80%"}>
            <LineChart width={600} height={300} data={data} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                <Line type="monotone" dataKey="timeSpent" stroke="#8884d8"/>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
            </LineChart>
        </ResponsiveContainer>
    )
}

/*
function TimeElapsedChart() {

    const data = [
        {name: "Created", timeSpent: 1},
        {name: "Selection Phase", timeSpent: 2.2},
        {name: "Candidate Proposal", timeSpent: 3.4},
        {name: "Consolidated", timeSpent: 1},
        {name: "Done", timeSpent: 0.5},
        {name: "Aborted", timeSpent: 0}
    ]

    return (
        <ResponsiveContainer width={"60%"} height={"80%"}>
            <LineChart width={600} height={300} data={data} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                <Line type="monotone" dataKey="timeSpent" stroke="#8884d8"/>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
            </LineChart>
        </ResponsiveContainer>
    )
}
*/

function SkillsCountChart() {

    const [data, setData] = useState(null)
    const [load, setLoad] = useState(false)

    useEffect(() => {
        if (!load) {
            AnalyticsAPI.GetSkillsCount().then((result) => {
                Object.entries(result.skillCount).forEach((key, value) => {
                    setData(oldState => oldState.push({
                            name: key,
                            jobOffersNum: value
                        })
                    )
                })

                for (let i = 0; i < result.length; i++) {
                    setData(oldState => oldState.push({
                        name: result.skillCount.key(),
                        jobOffersNum: result.skillCount.value()
                    }))
                }

                setLoad(true)
            }).catch(err => console.log(err))
        }
    }, [load]);

    return (
        <ResponsiveContainer width={"60%"} height={"80%"}>
            <BarChart width={600} height={300} data={data} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                <Bar dataKey="jobOffersNum" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />}/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
            </BarChart>
        </ResponsiveContainer>
    )
}

/*
function SkillsCountChart() {

    const data = [{name: "Pizzaiolo", jobOffersNum: 3}, {name: "Venditore", jobOffersNum: 4}, {
        name: "Commesso",
        jobOffersNum: 2
    }]

    return (
        <ResponsiveContainer width={"60%"} height={"80%"}>
            <BarChart width={600} height={300} data={data} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                <Bar dataKey="jobOffersNum" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue"/>}/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
            </BarChart>
        </ResponsiveContainer>
    )
}
*/

function Analytics() {
    return (
        <div className="flex flex-col flex-1 justify-around">
            <TimeElapsedChart/>
            <SkillsCountChart/>
        </div>)
}


export default Analytics;