export class Pagination {
    pageNumber: number
    pageSize: number

    constructor(pageNumber: number, pageSize: number) {
        if (pageNumber < 0) {
            throw new Error("pageNumber should be equal or greater than 0")
        }

        if (pageSize < 1) {
            throw new Error("pageSize should be at least 1")
        }

        this.pageNumber = pageNumber
        this.pageSize = pageSize
    }
}
