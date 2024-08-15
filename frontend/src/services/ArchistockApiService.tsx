import User from "../models/User";
import AccessTokenResponse from "../models/AccessTokenResponse";
import UserAndTokens from "../models/UserAndTokens";
import LoginUser from "../models/LoginUser";
import Address from "../models/Address";
import { getCookie } from "../contexts/AuthContext";

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

  private getCookie(name: string): string | null {
    return getCookie(name);
  }

  async getUserStorage(): Promise<any> {
      try {
          const response = await fetch(`${this.url}/usersubscription/me`, {
              method: 'GET',
              headers: {
                  Authorization: `${getCookie('accessToken')}`,
              },
          });
          
          const jsonResponse = await response.json();
          return jsonResponse;
      } catch (error) {
          console.error("Failed to fetch user storage:", error);
          throw error;  // rethrow the error if you want to handle it further up in your components
      }
  }

  async getUserStorageWithFiles(): Promise<any> {
    try {
        const response = await fetch(`${this.url}/usersubscription/files/me`, {
            method: 'GET',
            headers: {
                Authorization: `${getCookie('accessToken')}`,
            },
        });
        
        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (error) {
        console.error("Failed to fetch user storage:", error);
        throw error;  // rethrow the error if you want to handle it further up in your components
    }
  }

  async getSubscriptions(): Promise<any> {
      try {
          const response = await fetch(`${this.url}/subscription/all`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `${getCookie('accessToken')}`,
              },
          });
          const jsonResponse = await response.json();
          return jsonResponse;
      } catch (error) {
          console.error("Failed to fetch subscriptions:", error);
          throw error;  // rethrow the error if you want to handle it further up in your components
      }
  }

    async purchaseSubscription(subscriptionId: number): Promise<any> {
            try {
                const response = await fetch(`${this.url}/usersubscription/add`, {
                    method: 'POST',
                    headers: {
                        Authorization: `${getCookie('accessToken')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ subscriptionId }),
                });
                const jsonResponse = await response.json();
                return jsonResponse;
            } catch (error) {
                console.error("Failed to purchase subscription:", error);
                throw error;  // rethrow the error if you want to handle it further up in your components
            }
    }

    async getStorageRoot(storageId:number): Promise<any> {
        try {
            const response = await fetch(`${this.url}/folder/root/${storageId}`, {
                method: 'GET',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            });
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to fetch root folder:", error);
            throw error;  // rethrow the error if you want to handle it further up in your components
        }
    }

    async updateStorage(storageId:number, storage:any): Promise<any> {
        try {
            const response = await fetch(`${this.url}/usersubscription/update/${storageId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(storage),
            });
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to update storage:", error);
            throw error;  // rethrow the error if you want to handle it further up in your components
        }
    }

    async createFolder(folder:any): Promise<any> {
        try {
            const response = await fetch(`${this.url}/folder/add`, {
                method: 'POST',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(folder),
            });
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to create folder:", error);
            throw error;  // rethrow the error if you want to handle it further up in your components
        }
    }

    async getFolder(folderId:number): Promise<any> {
        try {
            const response = await fetch(`${this.url}/folder/${folderId}`, {
                method: 'GET',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            });
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to fetch folder:", error);
            throw error;  // rethrow the error if you want to handle it further up in your components
        }
    }

    async updateFolder(id:number, folder:any): Promise<any> {
        try {
            const response = await fetch(`${this.url}/folder/update/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(folder),
            });
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to update folder:", error);
            throw error;  // rethrow the error if you want to handle it further up in your components
        }
    }

    async deleteFolder(folderId:number): Promise<any> {
        try {
            const response = await fetch(`${this.url}/folder/delete/${folderId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            });
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to delete folder:", error);
            throw error;  // rethrow the error if you want to handle it further up in your components
        }
    }

    async updateFile(fileId:number, file:any): Promise<any> {
        try {
            const response = await fetch(`${this.url}/file/update/${fileId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(file),
            });
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to update file:", error);
            throw error;  // rethrow the error if you want to handle it further up in your components
        }
    }

}

export default ArchistockApiService;
