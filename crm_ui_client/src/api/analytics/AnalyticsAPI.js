import {buildUrl} from "../utils/buildUrlQueryParams.js";
import {JobOfferTimeStatistic} from "./dto/JobOfferTimeStatistic.ts";
import {JobOfferSkillsStatistic} from "./dto/JobOfferSkillsStatistic.ts";


const URL_ANALYTICS = 'http://localhost:8082/analytics/api/jobofferstatistics'


async function GetElapsedStatusTime() {
    const response = await fetch(
        buildUrl(`${URL_ANALYTICS}/timecount`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return JobOfferTimeStatistic.fromJsonObject(obj)
    } else {
        throw obj
    }
}

async function GetSkillsCount() {
    const response = await fetch(
        buildUrl(`${URL_ANALYTICS}/skillscount`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return JobOfferSkillsStatistic.fromJsonObject(obj)
    } else {
        throw obj
    }
}


const AnalyticsAPI = {
    GetElapsedStatusTime,
    GetSkillsCount
}

export default AnalyticsAPI
