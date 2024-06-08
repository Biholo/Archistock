import User from "./User";

interface UserAndTokens {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export default UserAndTokens;