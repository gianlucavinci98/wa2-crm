interface AddressRawData {
    addressId: bigint | null
    address: string
}

export class Address implements AddressRawData {
    addressId: bigint | null
    address: string

    constructor(addressId: bigint | null, address: string) {
        this.addressId = addressId
        this.address = address
    }

    static fromJsonObject(obj: AddressRawData): Address | null {
        try {
            return new Address(obj.addressId, obj.address)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
