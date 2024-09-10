import User from "./UserModel";

interface UserResponse {
    [key: string]: User;
}

export default UserResponse;