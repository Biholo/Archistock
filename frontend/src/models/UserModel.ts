import { Rights } from './RightsModel';

export interface User {
    id?: number | null;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password?: string | null;
    passwordConfirm?: string | null;
    rights: Rights[];

}


