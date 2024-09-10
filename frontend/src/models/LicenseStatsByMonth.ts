import MonthlyStats from "./MonthlyStats";

interface LicenseStatsByMonth {
    current: MonthlyStats[];
    canceled: MonthlyStats[];
}
  
export default LicenseStatsByMonth;