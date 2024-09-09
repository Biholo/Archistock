import User from "../models/UserModel";
import AccessTokenResponse from "../models/AccessTokenResponseModel";
import UserAndTokens from "../models/UserAndTokens";
import LoginUser from "../models/LoginUserModel";
import Address from "../models/AddressModel";
import { getCookie } from "../contexts/AuthContext";

class ArchistockApiService {
    public readonly url: string;

    constructor() {
        this.url = "http://localhost:8000";
    }

    // POST /user/register - Créer un utilisateur
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

    // POST /user/login - Connecter un utilisateur
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

   
    // POST /user/update-password - Mettre à jour le mot de passe de l'utilisateur
    async updatePassword( password: string, jwtToken: string | undefined ): Promise<{ message: string }> {
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

    // POST /user/reset-password - Réinitialiser le mot de passe de l'utilisateur
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

    // GET /user/email-available/{email} - Vérifier si un email est disponible
    async isEmailAvailable(email: string): Promise<boolean> {
    const response = await fetch(`${this.url}/user/email-available/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json();
    return jsonResponse
  }

  // GET /user/profile - Obtenir le profil de l'utilisateur
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

    private setCookie(name: string, value: string) {
        document.cookie = `${name}=${value}; Secure; SameSite=Strict; Path=/;`;
    }

    // PUT /user/update - Mettre à jour le profil de l'utilisateur
    async updateProfile(user: User) : Promise<any> {
        console.log("user", user);
        try {
            const response = await fetch(`${this.url}/user/update`, {
                method: 'PUT',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to update profile:", error);
            throw error;  // rethrow the error if you want to handle it further up in your components
        }
    }
    
    // POST /user/refreshToken - Obtenir un nouveau jeton d'accès
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

    // GET /user-subscription/me - Obtenir l'abonnement de l'utilisateur
    async getUserStorage(): Promise<any> {
        try {
            const response = await fetch(`${this.url}/user-subscription/me`, {
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

    // GET /user-subscription/files/:id - Obtenir le stockage de l'utilisateur
    async findUserStorageById(id: number): Promise<any> {
        try {
            const response = await fetch(`${this.url}/user-subscription/files/${id}`, {
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

    // GET /user-subscription/files/me - Obtenir le stockage de l'utilisateur avec les fichiers
    async getUserStorageWithFiles(): Promise<any> {
        try {
            const response = await fetch(`${this.url}/user-subscription/files/me`, {
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

    // GET /subscription/all - Obtenir toutes les souscriptions
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

    // POST /user-subscription/add - Acheter un abonnement
    async purchaseSubscription(subscriptionId: number): Promise<any> {
        try {
            const response = await fetch(`${this.url}/user-subscription/add`, {
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

    // GET /folder/root/{storageId} - Obtenir le dossier racine du stockage
    async getStorageRoot(storageId: number): Promise<any> {
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

    // PUT user-subscription/update/{storageId} - Mettre à jour le stockage de l'utilisateur
    async updateStorage(storageId: number, storage: any): Promise<any> {
        try {
            const response = await fetch(`${this.url}/user-subscription/update/${storageId}`, {
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

    // POST /folder/add - Créer un dossier
    async createFolder(folder: any): Promise<any> {
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

    // GET /folder/{folderId} - Obtenir un dossier
    async getFolder(folderId: number): Promise<any> {
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

    // PUT /folder/update/{folderId} - Mettre à jour un dossier
    async updateFolder(id: number, folder: any): Promise<any> {
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

    // DELETE /folder/delete/{folderId} - Supprimer un dossier
    async deleteFolder(folderId: number): Promise<any> {
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

    // POST /user-subscription/add-files - Ajouter des fichiers
    async uploadFileWithProgress(formData: FormData, onProgress: (progress: number) => void): Promise<any> {
        const token = getCookie('accessToken');
        if (!token) {
            throw new Error("No access token found.");
        }

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${this.url}/user-subscription/add-files`, true);

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

    // GET /user-subscription/files/me?searchTerm - Obtenir les fichiers de l'utilisateur
    async searchFiles(searchTerm:string): Promise<any> {
        try {
            const response = await fetch(`${this.url}/user-subscription/files/me?searchTerm=${searchTerm}`, {
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
  
    // GET /file/update/{fileId} - Obtenir un fichier
    async updateFile(fileId: number, file: any): Promise<any> {
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
    
    // GET /file/download/{filename} - Télécharger un fichier
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

    // DELETE /file/delete/{filename} - Supprimer un fichier
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

    // GET /user/invoices - Obtenir les factures de l'utilisateur
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
      
    // GET /country/all - Obtenir tous
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
    
    //Stripe
    async createPaiementSubscription(subscriptionId: number, userId: string): Promise < any > {
        try {
            const response = await fetch(`${this.url}/stripe/create-subscription`, {
                method: 'POST',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscriptionId, userId }),
            });
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch(error) {
            console.error("Failed to create paiement subscription:", error);
            throw error;
        }
    }

    // POST /user/confirm-account - Confirmer le compte de l'utilisateur
    async confirmAccount(token: string): Promise<any> {
        try {
            const response = await fetch(`${this.url}/user/confirm-account`, {
                method: 'POST',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            throw error;
        }
    }
       
    // GET /user-subscription/me - Obtenir l'abonnement de l'utilisateur
    async findAllSubscriptionByUserId(): Promise<any> {
        try {
            const response = await fetch(`${this.url}/user-subscription/me`, {
                method: 'GET',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            })
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to find subscription:", error);
            throw error; 
        }
    }

    // GET /user/all - Obtenir tous les utilisateurs
    async findAllUsers(): Promise<any> {
        try {
            const response = await fetch(`${this.url}/user/all`, {
                method: 'GET',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            })
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to find subscription:", error);
            throw error; 
        }
    }

    // GET /user-subscription/all - Obtenir tous les abonnements
    async findAllSubscriptions(): Promise<any> {
        try {
            const response = await fetch(`${this.url}/user-subscription/all`, {
                method: 'GET',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            })
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to find subscription:", error);
            throw error; 
        }
    }

    // GET /user-subscription/users-with-storage - Obtenir tous les utilisateurs avec un stockage
    async findAllUserStorages(): Promise<any> {
        try {
            const response = await fetch(`${this.url}/user-subscription/users-with-storage`, {
                method: 'GET',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            })
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to find subscription:", error);
            throw error; 
        }
    }

    // DELETE /user/account/{userId} - Supprimer un utilisateur
    async deleteUser(userId: number): Promise<any> {
        try {
            const response = await fetch(`${this.url}/user/account/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `${getCookie('accessToken')}`,
                },
            })
            const jsonResponse = await response.json();
            return jsonResponse;
        } catch (error) {
            console.error("Failed to delete user", error);
            throw error; 
        }
    }

    async getInvoiceUrl(invoiceName: string) {
        return `${this.url}/files/invoices/${invoiceName}`;
    }

    async generateAiResponse(message: string): Promise<any> {
        try {
            const response = await fetch('http://localhost:8000/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message }),
            });
    
            const data = await response.json();
            return data;
        } catch(e) {
            console.error("Failed to generate AI response:", e);
            throw e;
        }

    }
}

export default ArchistockApiService;
