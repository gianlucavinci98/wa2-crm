interface AddressRawData {
    addressId: bigint
    address: string
}

export class Address implements AddressRawData {
    addressId: bigint
    address: string

    constructor(addressId: bigint, address: string) {
        this.addressId = addressId
        this.address = address
    }

    static fromJsonObject(obj: AddressRawData): Address | undefined {
        try {
            return new Address(obj.addressId, obj.address)
        } catch (e) {
            console.error(e)
            return undefined
        }
    }
}
