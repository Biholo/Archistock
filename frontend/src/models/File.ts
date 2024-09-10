import UserSubscription from "./UserSubscription";

interface File {
    id: number;
    format: string;         
    size: number;           
    name: string;          
    pathName: string;      
    parentId: number;        
    userSubscriptionId: number; 
    createdAt: string;      
    updatedAt: string;      
    usersubscription: UserSubscription;
}

export default File;