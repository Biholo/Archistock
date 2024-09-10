import User from "./UserModel";
import Subscription from "./Subscription";

interface UserSubscription {
    id: number;
    name: string;
    startDate: string;  
    status: string;   
    userId: number;
    subscriptionId: number;
    createdAt: string;  
    updatedAt: string;  
    user: User;         
    subscription: Subscription;
    totalSize: number; 
}

export default UserSubscription; 