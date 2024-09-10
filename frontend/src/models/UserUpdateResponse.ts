import User from "./UserModel";

interface UserUpdateResponse {
    message: string;
    data: User;
    status: number;
}

export default UserUpdateResponse;