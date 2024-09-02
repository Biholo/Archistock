import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import StatsCard from "../../components/StatsCard/StatsCard";
import Select from "../Select/Select";
import ArchistockApiService from "../../services/ArchistockApiService";

interface Stats {
  accountsCount: number;
  companiesCount: number;
}

interface LicenseStats {
  currentLicenses: number;
  canceledLicenses: number;
}

interface MonthlyStats {
  month: string;
  count: number;
}

interface LicenseStatsByMonth {
  current: MonthlyStats[];
  canceled: MonthlyStats[];
}

const OPTIONS = [
  { value: "daily", label: "Journalier" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuel" },
  { value: "yearly", label: "Annuel" },
];

// Regroupement des données en fonction de l'intervalle sélectionné
const groupDataByInterval = (
  data: FileData[],
  interval: string
): MonthlyStats[] => {
  const countsByInterval: Record<string, number> = {};

  data.forEach((file) => {
    const date = new Date(file.createdAt);
    let key: string;

    switch (interval) {
      case "daily":
        key = date.toISOString().split("T")[0];
        break;
      case "weekly":
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        key = startOfWeek.toISOString().split("T")[0];
        break;
      case "monthly":
        key = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(
          -2
        )}`;
        break;
      case "yearly":
        key = `${date.getFullYear()}`;
        break;
      default:
        key = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(
          -2
        )}`;
    }

    countsByInterval[key] = (countsByInterval[key] || 0) + 1;
  });
  return Object.entries(countsByInterval)
    .map(([key, count]) => ({ month: key, count }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
};

const AdminStatistics = () => {
  const [selectedInterval, setSelectedInterval] = useState("monthly");
  const [accountStats, setAccountStats] = useState<Stats>({
    accountsCount: 0,
    companiesCount: 0,
  });
  const [licenseStats, setLicenseStats] = useState<LicenseStats>({
    currentLicenses: 0,
    canceledLicenses: 0,
  });
  const [licenseStatsByMonth, setLicenseStatsByMonth] =
    useState<LicenseStatsByMonth>({
      current: [],
      canceled: [],
    });

  const [accountStatsByMonth, setAccountStatsByMonth] = useState<MonthlyStats>(
    []
  );
  const [companyStatsByMonth, setCompanyStatsByMonth] = useState<MonthlyStats>(
    []
  );

  const archistockApiService = new ArchistockApiService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération des informations pour les adminitrateurs
        const accounts = await archistockApiService.findAllUsers();
        const companies = await archistockApiService.findAllCompanies();
        const licenses = await archistockApiService.findAllSubscriptions();

        setAccountStats({
          accountsCount: accounts.length,
          companiesCount: companies.length,
        });

        // Faire le paréto entre les licences actives et les licences résiliés
        const canceledLicenses = licenses.filter(
          (license) => license.status === "canceled"
        );
        const currentLicenses = licenses.filter(
          (license) => license.status === "active"
        );

        setLicenseStats({
          currentLicenses: currentLicenses.length,
          canceledLicenses: canceledLicenses.length,
        });

        // Récupère les données de souscriptions par mois
        const currentLicensesByMonth = groupDataByInterval(
          currentLicenses,
          selectedInterval
        );
        const canceledLicensesByMonth = groupDataByInterval(
          canceledLicenses,
          selectedInterval
        );

        setLicenseStatsByMonth({
          current: currentLicensesByMonth,
          canceled: canceledLicensesByMonth,
        });

        // Récupération des stats par mois pour les comptes et les entreprises
        const accountsByMonth = groupDataByInterval(accounts, selectedInterval);
        const companiesByMonth = groupDataByInterval(
          companies,
          selectedInterval
        );

        setAccountStatsByMonth(accountsByMonth);
        setCompanyStatsByMonth(companiesByMonth);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedInterval]);

  return (
    <div>
      <Select
        options={OPTIONS}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
          setSelectedInterval(event.target.value)
        }
        value={selectedInterval}
      />
      <div
        className="flex flex-row justify-between m-5"
        style={{ gap: "16px" }}
      >
        <StatsCard
          stat={accountStats.accountsCount}
          name="Comptes Inscrits"
          color="#FFA800"
        />
        <StatsCard
          stat={accountStats.companiesCount}
          name="Entreprises inscrites"
          color="#E757B6"
        />
        <StatsCard
          stat={licenseStats.currentLicenses}
          name="Licences en cours"
          color="#24B34C"
        />
        <StatsCard
          stat={licenseStats.canceledLicenses}
          name="Licences résiliées"
          color="#7C57E7"
        />
      </div>
      <h2 style={{ textAlign: "center" }}>
        Nombre de comptes et d'entreprises
      </h2>
      <div style={{ display: "flex", width: "100%", height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={accountStatsByMonth.map((item, index) => ({
              ...item,
              companiesCount: companyStatsByMonth[index]?.count || 0,
            }))}
            margin={{ top: 5, right: 50, left: 50, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#00C49F"
              activeDot={{ r: 4 }}
              name="Comptes"
            />
            <Line
              type="monotone"
              dataKey="companiesCount"
              stroke="#FF1963"
              activeDot={{ r: 4 }}
              name="Entreprises"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2 style={{ textAlign: "center" }}>Évolution des licences</h2>
      <div style={{ display: "flex", width: "100%", height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={licenseStatsByMonth.current.map((item, index) => ({
              ...item,
              canceledCount: licenseStatsByMonth.canceled[index]?.count || 0,
            }))}
            margin={{ top: 5, right: 50, left: 50, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              name="Licences en cours"
              stroke="#00C49F"
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="canceledCount"
              name="Licences résiliées"
              stroke="#FF8042"
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminStatistics;
