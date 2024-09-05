import Address from "./AddressModel";

export interface Company {
    id?: number | null;
    name: string;
    address: Address;
    addressId?: number | null;
    icon?: string | null;
}