import { User } from './UserModel';
import { Company } from './CompanyModel';
import { SharedStorageSpace } from './SharedStorageSpaceModel';

export interface InvitationRequest {
    id?: number | null | undefined;
    type : string;
    userId?: number | null | undefined;
    companyId?: number | null | undefined;
    sharedStorageSpaceId?: number | null | undefined;
    user?: User;
    company?: Company;
    sharedStorageSpace?: SharedStorageSpace;
    acceptedRole?: string | null | undefined;
    status?: 'pending' | 'accepted' | 'rejected' | 'canceled';
    acceptedBy: number;
}