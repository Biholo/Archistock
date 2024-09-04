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

    async uploadFileWithProgress(formData: FormData, onProgress: (progress: number) => void): Promise<any> {
      const token = getCookie('accessToken');
      if (!token) {
          throw new Error("No access token found.");
      }

      return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${this.url}/usersubscription/add-files`, true);

          xhr.setRequestHeader('Authorization', `Bearer ${token}`);

          xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                  const percentage = (event.loaded / event.total) * 100;
                  onProgress(Math.round(percentage));
              }
          };

          xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                  resolve(JSON.parse(xhr.response));
              } else {
                  reject(new Error(`Failed to upload file: ${xhr.status} ${xhr.statusText}`));
              }
          };

          xhr.onerror = () => reject(new Error("Network error"));

          xhr.send(formData);
      });
  }

    async searchFiles(searchTerm:string): Promise<any> {
        try {
            const response = await fetch(`${this.url}/usersubscription/files/me?searchTerm=${searchTerm}`, {
                method: 'GET',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            });
            const jsonResponse = await response.json();
            console.log("json response", jsonResponse);
            return jsonResponse;
        } catch (error) {
            console.error("Failed to search files:", error);
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
    
    async downloadFile(filename: string) {
        try {
          const response = await fetch(`${this.url}/file/download/${filename}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${getCookie('accessToken')}`,
            },
          });
      
          if (!response.ok) {
            console.error(`Failed to download file: ${response.statusText}`);
            throw new Error(`Failed to download file: ${response.statusText}`);
          }
      
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
      
        } catch (error) {
          console.error("Failed to download file:", error);
          throw error;
        }
    }

    async deleteFile(filename: string): Promise<any> {
        try {
            const response = await fetch(`${this.url}/file/delete/${filename}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            });
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to delete file:", error);
            throw error;  // rethrow the error if you want to handle it further up in your components
        }
    }

    async getUserInvoices(): Promise<any> {
        try {
            const response = await fetch(`${this.url}/user/invoices`, {
                method: 'GET',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            });
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to fetch user invoices:", error);
            throw error;  // rethrow the error if you want to handle it further up in your components
        }
    }
      

    async findAllCountries(): Promise<any> {
        try {
            const response = await fetch(`${this.url}/country/all`, {
                method: 'GET',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            });
            const jsonResponse = await response.json();
            return jsonResponse.data;
        } catch (error) {
            console.error("Failed to fetch countries:", error);
            throw error; 
        }
    }

    async findAllCompanies(): Promise<any> {
        try {
            const response = await fetch(`${this.url}/company/all`, {
                method: 'GET',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            });
            const jsonResponse = await response.json();
            return jsonResponse.data;
        } catch (error) {
            console.error("Failed to fetch companies:", error);
            throw error; 
        }
    }

    async askToJoinCompany(companyId:number, userId: number): Promise<any> {
        try {
            const response = await fetch(`${this.url}/invitation-request/ask-to-join`, {
                method: 'POST',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ companyId, userId}),
            });
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to join company:", error);
            throw error; 
        }
    }

    async findInvitationsByUserId(userId:number): Promise<any> {
        try {
            const response = await fetch(`${this.url}/invitation-request/all/user/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            });
            const jsonResponse = await response.json();
            return jsonResponse.data;
        } catch (error) {
            console.error("Failed to fetch invitations:", error);
            throw error; 
        }
    }

    async findCompaniesByUserId(userId:number): Promise<any> {
        try {
            const response = await fetch(`${this.url}/company/all/user/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            });
            const jsonResponse = await response.json();
            return jsonResponse.data;
        } catch (error) {
            console.error("Failed to fetch companies:", error);
            throw error; 
        }
    }

    async createCompany (company: any, userId: number): Promise<any> {
        try {
            const formData = new FormData();
    
            formData.append('name', company.name);
            formData.append('city', company.city);
            formData.append('countryId', company.countryId);
            formData.append('street', company.street);
            formData.append('postalCode', company.postalCode);
            formData.append('userId', userId.toString());
    
            if (company.image) {
                formData.append('image', company.image);
            }
    
            const response = await fetch(`${this.url}/company/create`, {
                method: 'POST',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
                body: formData,
            });
    
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to create company:", error);
            throw error; 
        }
    }
    

    async findOneCompanyById (companyId:string, userId: number): Promise<any> {
        try {
            const response = await fetch(`${this.url}/company/one/${companyId}?userId=${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            });
            const jsonResponse = await response.json();
            return jsonResponse.data;
        } catch (error) {
            console.error("Failed to fetch company:", error);
            throw error; 
        }
    }

    async findAllInfosByCompanyId (companyId:string, userId: number): Promise<any> {
        try {
            const response = await fetch(`${this.url}/company/informations/one/${companyId}?userId=${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            });
            const jsonResponse = await response.json();
            return jsonResponse.data;
        } catch (error) {
            console.error("Failed to fetch company infos:", error);
            throw error; 
        }
    }

    async submitInvitationsToCompany(inviterId: number, users: any[], companyId: string): Promise<any> {
        try {
            const response = await fetch(`${this.url}/invitation-request/many-person`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getCookie('accessToken')}`, // Assuming Bearer token
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    users,
                    companyId,
                    inviterId
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to submit invitations:", error);
            throw error; 
        }
    }
    

    async registerInvitation (uuid:string, user: any): Promise<any> {
        try {
            const response = await fetch(`${this.url}/user/register-invitation/${uuid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to register invitation:", error);
            throw error; 
        }
    }
        

}

export default ArchistockApiService;
