import { Rights } from './RightsModel';
import Address from "./AddressModel";

interface User {
    id?: number | null;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address?: Address;
    password?: string | null;
    passwordConfirm?: string | null;
    rights: Rights[];

}

export default User;


