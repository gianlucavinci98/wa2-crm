import {buildUrl} from "../utils/buildUrlQueryParams.js";
import {JobOfferTimeStatistic} from "./dto/JobOfferTimeStatistic.js";
import {JobOfferSkillsStatistic} from "./dto/JobOfferSkillsStatistic.js";


const URL_ANALYTICS = 'http://localhost:8082/crm/api/analytics'


async function GetElapsedStatusTime() {
    const response = await fetch(
        buildUrl(`${URL_ANALYTICS}/timecount`, null, null), {
            method: 'GET',
            credentials: 'include'
        })
    const obj = await response.json()

    if (response.ok) {
        return obj.map((e) => JobOfferTimeStatistic.fromJsonObject(e))
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
        return obj.map((e) => JobOfferSkillsStatistic.fromJsonObject(e))
    } else {
        throw obj
    }
}


const AnalyticsAPI = {
    GetElapsedStatusTime,
    GetSkillsCount
}

export default AnalyticsAPI
