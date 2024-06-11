import User from "../models/User";
import AccessTokenResponse from "../models/AccessTokenResponse";
import UserAndTokens from "../models/UserAndTokens";
import LoginUser from "../models/LoginUser";
import Address from "../models/Address";

class ArchistockApiService {
  private readonly url: string;

  constructor() {
    this.url = "http://localhost:8000";
  }

  async registerUser(user: User, address: Address): Promise<UserAndTokens> {
    const response = await fetch(`${this.url}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, address }), // Combine user and address into one object
    });

    const jsonResponse = await response.json();

    if (jsonResponse.accessToken) {
      this.setCookie("accessToken", jsonResponse.accessToken);
    }
    if (jsonResponse.refreshToken) {
      this.setCookie("refreshToken", jsonResponse.refreshToken);
    }

    return jsonResponse;
  }

  async loginUser(user: LoginUser): Promise<UserAndTokens> {
    const response = await fetch(`${this.url}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const jsonResponse = await response.json();
    if (jsonResponse.accessToken) {
      this.setCookie("accessToken", jsonResponse.accessToken);
    }
    if (jsonResponse.refreshToken) {
      this.setCookie("refreshToken", jsonResponse.refreshToken);
    }

    return jsonResponse;
  }

  async getUserByToken(accessToken: string): Promise<User | null> {
    if (!accessToken) {
      return null;
    }

    const response = await fetch(`${this.url}/user/profile`, {
      method: "GET",
      headers: {
        Authorization: accessToken,
      },
    });
    const jsonResponse = await response.json();
    return jsonResponse;
  }

  async getNewAccessToken(refreshToken: string): Promise<AccessTokenResponse> {
    const response = await fetch(`${this.url}/user/refreshToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
    const jsonResponse = await response.json();
    return jsonResponse;
  }

  async updatePassword(
    password: string,
    jwtToken: string | undefined
  ): Promise<{ message: string }> {
    const response = await fetch(`${this.url}/user/update-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, jwtToken }),
    });
    const jsonResponse = await response.json();
    return jsonResponse;
  }

  async resetPassword(email: string): Promise<boolean> {
    const response = await fetch(`${this.url}/user/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (response.status !== 200) {
      return false;
    }
    return true;
  }

  private setCookie(name: string, value: string) {
    document.cookie = `${name}=${value}; Secure; SameSite=Strict; Path=/;`;
  }
}

export default ArchistockApiService;
