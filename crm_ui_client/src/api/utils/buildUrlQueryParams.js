function arrayQueryParams(baseUrl, key, value) {
    for (let i = 0; i < value; i++) {
        if (i < value.length - 2) {
            baseUrl += key + '=' + value + '&'
        } else {
            baseUrl += key + '=' + value
        }
    }

    return baseUrl
}

function buildUrlQueryParams(baseUrl, filter) {
    for (let key in filter) {
        let value = filter[key]

        if (value instanceof Array) {
            baseUrl += arrayQueryParams(baseUrl, key, value)
        } else {
            baseUrl += key + '=' + value + '&'
        }
    }

    return baseUrl
}

export function buildUrl(baseUrl, filter, pagination) {
    let urlQueryParams = "?"

    if (filter ?? false) {
        urlQueryParams = buildUrlQueryParams(urlQueryParams, filter)
    }
    if (pagination ?? false) {
        urlQueryParams = buildUrlQueryParams(urlQueryParams, pagination)
    }

    return baseUrl + (urlQueryParams !== "?" ? urlQueryParams : "")
}
