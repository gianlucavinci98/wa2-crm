function arrayQueryParams(baseUrl, key, value) {
    for (let i = 0; i < value.length; i++) {
        if (value[i] !== null) {
            baseUrl += key + '=' + value[i] + '&'
        }
    }

    return baseUrl
}

function buildUrlQueryParams(baseUrl, filter) {
    for (let key in filter) {
        let value = filter[key]

        if (value instanceof Array) {
            baseUrl += arrayQueryParams(baseUrl, key, value)
        } else if (value !== null) {
            baseUrl += key + '=' + value + '&'
        }
    }

    return baseUrl
}

export function buildUrl(baseUrl, filter, pagination) {
    let url1 = ""
    let url2 = ""
    if (filter ?? false) {
        url1 = buildUrlQueryParams(url1, filter)
    }
    if (pagination ?? false) {
        url2 = buildUrlQueryParams(url2, pagination)
    }

    if (url1.length > 0) {
        if (url2.length > 0) {
            return baseUrl + "?" + url1 + "&" + url2
        } else {
            return baseUrl + "?" + url1
        }
    } else if (url2.length > 0) {
        return baseUrl + "?" + url2
    } else {
        return baseUrl
    }
}
