import { Company } from './CompanyModel';

export interface SharedStorageSpace {
    id?: number | null | undefined;
    name: string;
    companyId?: number;
    company?: Company;
}