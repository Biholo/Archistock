import  {Company}  from './CompanyModel';
import { User } from './UserModel';
import { SharedStorageSpace } from './SharedStorageSpaceModel';

export interface Rights {
    id: number;
    roles: 'owner' | 'admin' | 'employee' | 'manager';
    userId: number;
    companyId?: number | null;
    sharedStorageSpaceId?: number | null;
    user?: User;
    company?: Company;
    sharedStorageSpace?: SharedStorageSpace;
  }