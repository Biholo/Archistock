interface User {
    id?: number | null;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumner: string;
    password?: string | null;
    passwordConfirm?: string | null;

}

export default User;
