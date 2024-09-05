import User from "./UserModel";

interface UserAndTokens {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export default UserAndTokens;