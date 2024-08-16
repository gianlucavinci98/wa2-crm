function buildUrlQueryParams(baseUrl, filter) {
    let i = 1
    let size = Object.keys(filter).length

    for (let key in filter) {
        let value = filter[key]

        if (i < size - 1) {
            value = key + '=' + value + '&'
        } else {
            value = key + '=' + value
        }

        i++
    }

    return baseUrl
}

export function buildUrl(baseUrl, filter, pagination) {
    let urlQueryParams = "?"

    if (filter ?? false) {
        buildUrlQueryParams(urlQueryParams, filter)
    }
    if (pagination ?? false) {
        buildUrlQueryParams(urlQueryParams, pagination)
    }

    return baseUrl + (urlQueryParams !== "?" ? urlQueryParams : "")
}
