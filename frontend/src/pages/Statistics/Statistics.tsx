import React, { useEffect, useState } from "react";
import { userApi } from "../../services/apiService.js";
import ArchistockApiService from "../../services/ArchistockApiService";
import { useAuth } from "../../contexts/AuthContext";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import StatsCard from "../../components/StatsCard/StatsCard";
import CustomPieChart from "../../components/Stats/CustomPieChart/CustomPieChart";
import Button from "../../components/Button/Button";

// Interface pour typer les données de l'Api
interface FileData {
  id: string;
  createdAt: string;
  format: string;
  size: number;
}

interface Stats {
  accountsCount: number;
  companiesCount: number;
}

interface LicenseStats{
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

// Les couleurs pour les graphiques
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF1963",
  "#19FFDC",
  "#DC19FF",
  "#FF5719",
  "#1963FF",
  "#FF7C19",
];

// Regroupement des extensions en les classant par catégorie pour plus de lisibilité
const EXTENSIONS_BY_CATEGORY: Record<string, string[]> = {
  Images: [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "tiff",
    "tif",
    "svg",
    "webp",
    "heic",
  ],
  Videos: ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm"],
  Documents: [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    "rtf",
    "odt",
    "ods",
    "odp",
    "epub",
    "md",
  ],
};

// Permet de faire la correspondance entre l'extension en paramètre avec le regroupement fais au dessus
const getCategoryByExtension = (extension: string): string => {
  for (const [category, extensions] of Object.entries(EXTENSIONS_BY_CATEGORY)) {
    if (extensions.includes(extension.toLowerCase())) {
      return category;
    }
  }
  return "Autres";
};

// Permet d'obtenir la couleur en fonction de la catégorie
const getColorByCategory = (category: string, categoryColorMap: Record<string, string>): string => {
  if (!categoryColorMap.hasOwnProperty(category)) {
    const colorIndex = Object.keys(categoryColorMap).length % COLORS.length;
    categoryColorMap[category] = COLORS[colorIndex];
  }
  return categoryColorMap[category];
};

const Statistics: React.FC = () => {
  const { user } = useAuth();
  const [fileData, setFileData] = useState<FileData[]>([]);
  const [todayFilesCount, setTodayFilesCount] = useState(0);
  const [fileSizesByCategory, setFileSizesByCategory] = useState<{ name: string;  value: number}[]>([]);
  const [filesByMonth, setFilesByMonth] = useState<MonthlyStats[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [subscriptionSize, setSubscriptionSize] = useState(0);
  const [activeTab, setActiveTab] = useState(
    user.role === "admin" ? "admin" : "user"
  );
  const [accountStats, setAccountStats] = useState<Stats>({
    accountsCount: 0,
    companiesCount: 0,
  });
  const [licenseStats, setLicenseStats] = useState<LicenseStats>({
    currentLicenses: 0,
    canceledLicenses: 0,
  });
  const [licenseStatsByMonth, setLicenseStatsByMonth] = useState<LicenseStatsByMonth>({
    current: [],
    canceled: [],
  });
  const [accountStatsByMonth, setAccountStatsByMonth] = useState<MonthlyStats>([]);
  const [companyStatsByMonth, setCompanyStatsByMonth] = useState<MonthlyStats>([]);

  const archistockApiService = new ArchistockApiService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupère les données de l'utilisateur connecté
        const data: FileData[] = await userApi.getFilesByUserId(user.id);
        setFileData(data);

        // Filtrage sur les fichiers du jour
        const today = new Date();
        const todayDateString = today.toISOString().split("T")[0];
        const filesUploadedToday = data.filter((file) =>
          file.createdAt.startsWith(todayDateString)
        );
        setTodayFilesCount(filesUploadedToday.length);

        // Calcule la taille des fichiers par catégorie pour les graphiques
        const sizesByCategory: Record<string, number> = {};
        let totalFileSize = 0;

        data.forEach((file) => {
          const category = getCategoryByExtension(file.format);
          sizesByCategory[category] =
            (sizesByCategory[category] || 0) + file.size;
          totalFileSize += file.size;
        });

        setTotalSize(totalFileSize);

        // Conversion des tailles en tableau pour les graphiques
        const sizesArray = Object.entries(sizesByCategory).map(
          ([key, value]) => ({
            name: key,
            value: value,
          })
        );

        setFileSizesByCategory(sizesArray);

        // Récupère les abonnements de l'utilisateur connecté pour avoir la capacité totale
        const userSubscriptions =
          await archistockApiService.findAllSubscriptionByUserId();
        const totalSubscriptionSize = userSubscriptions.reduce(
          (total: number, item ) => total + item.subscription.size,
          0
        );

        setSubscriptionSize(totalSubscriptionSize);

        // Calcul du nombre de fichiers téléchargés par mois
        const countsByMonth: Record<string, number> = {};
        data.forEach((file) => {
          const date = new Date(file.createdAt);
          const month = `${date.getFullYear()}-${(
            "0" +
            (date.getMonth() + 1)
          ).slice(-2)}`;
          countsByMonth[month] = (countsByMonth[month] || 0) + 1;
        });

        const countsArray = Object.entries(countsByMonth)
          .map(([month, count]) => ({ month, count }))
          .sort(
            (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
          );

        setFilesByMonth(countsArray);

        if (user.role === 'admin') {
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
  
          const licenseCountsByMonth = {
            current: {} as Record<string, number>,
            canceled: {} as Record<string, number>,
          };

          const accountCountsByMonth: Record<string, number> = {};
          const companyCountsByMonth: Record<string, number> = {};
  
          // Avoir le détail par mois des licences résiliés et des licences actives pour les graphiques
          licenses.forEach((license) => {
            const date = new Date(license.createdAt);
            const month = `${date.getFullYear()}-${(
              "0" +
              (date.getMonth() + 1)
            ).slice(-2)}`;
            if (license.status === "active") {
              licenseCountsByMonth.current[month] =
                (licenseCountsByMonth.current[month] || 0) + 1;
            } else if (license.status === "canceled") {
              licenseCountsByMonth.canceled[month] =
                (licenseCountsByMonth.canceled[month] || 0) + 1;
            }
          });
  
          // Avoir le nombre de comptes inscrits par mois pour les graphiques
          accounts.forEach((account) => {
            const date = new Date(account.createdAt);
            const month = `${date.getFullYear()}-${(
              "0" +
              (date.getMonth() + 1)
            ).slice(-2)}`;
            accountCountsByMonth[month] = (accountCountsByMonth[month] || 0) + 1;
          });
  
          // Idem que pour les comptes sauf que cette fois-ci c'est pour les entreprises
          companies.forEach((company) => {
            const date = new Date(company.createdAt);
            const month = `${date.getFullYear()}-${(
              "0" +
              (date.getMonth() + 1)
            ).slice(-2)}`;
            companyCountsByMonth[month] = (companyCountsByMonth[month] || 0) + 1;
          });
  
          const licenseCountsArrayCurrent = Object.entries(
            licenseCountsByMonth.current
          )
            .map(([month, count]) => ({ month, count }))
            .sort(
              (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
            );
  
          const licenseCountsArrayCanceled = Object.entries(
            licenseCountsByMonth.canceled
          )
            .map(([month, count]) => ({ month, count }))
            .sort(
              (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
            );
  
          const accountCountsArray = Object.entries(accountCountsByMonth)
            .map(([month, count]) => ({ month, count }))
            .sort(
              (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
            );
  
          const companyCountsArray = Object.entries(companyCountsByMonth)
            .map(([month, count]) => ({ month, count }))
            .sort(
              (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
            );
  
          setLicenseStatsByMonth({
            current: licenseCountsArrayCurrent,
            canceled: licenseCountsArrayCanceled,
          });
          setAccountStatsByMonth(accountCountsArray);
          setCompanyStatsByMonth(companyCountsArray); 
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const availableSpace = subscriptionSize - totalSize;
  const pieChartData = [
    ...fileSizesByCategory,
    {
      name: "Disponible",
      value: availableSpace > 0 ? availableSpace : 0,
    },
  ];

  const categoryColorMap = {};

  return (
    <div className="m-5">
      {/* Onglets pour basculer entre utilisateur et administrateur */}
      {user.role === "admin" && (
        <div style={{ marginBottom: "16px" }}>
          <Button onClick={() => setActiveTab("user")}>Utilisateur</Button>
          <span className="m-1"></span>
          <Button onClick={() => setActiveTab("admin")}>Administrateur</Button>
        </div>
      )}

      {/* Contenu des onglets */}
      {activeTab === "user" ? (
        <>
          <div
            className="flex flex-row justify-between"
            style={{ gap: "16px" }}
          >
            <StatsCard
              stat={fileData.length}
              name="Téléchargement depuis le début"
              color="#FFA800"
              style={{ flex: "1", minWidth: "150px" }}
            />
            <StatsCard
              stat={todayFilesCount}
              name="Téléchargement aujourd'hui"
              color="#E757B6"
              style={{ flex: "1", minWidth: "150px" }}
            />
            <StatsCard
              stat={32}
              name="Partage aujourd'hui"
              color="#24B34C"
              style={{ flex: "1", minWidth: "150px" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
            className="my-5"
          >
            <h2 style={{ textAlign: "center" }}>Taille par catégorie</h2>
            <div style={{ display: "flex", width: "100%", height: 250 }}>
              <ResponsiveContainer width="50%" height="100%">
                <CustomPieChart
                  data={pieChartData}
                  colors={COLORS}
                  width="100%"
                  height="100%"
                />
              </ResponsiveContainer>
              <ResponsiveContainer width="50%" height="100%">
                <BarChart
                  data={fileSizesByCategory}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {fileSizesByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getColorByCategory(entry.name, categoryColorMap)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <h2 style={{ textAlign: "center" }}>Fichier téléchargé par mois</h2>
          <ResponsiveContainer height={250} width="100%">
            <LineChart
              data={filesByMonth}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#FFA800"
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div>
          <div
            className="flex flex-row justify-between m-5"
            style={{ gap: "16px" }}
          >
            <StatsCard
              stat={accountStats.accountsCount}
              name="Comptes Inscrits"
              color="#FFA800"
              style={{ flex: "1", minWidth: "150px" }}
            />
            <StatsCard
              stat={accountStats.companiesCount}
              name="Entreprises inscrites"
              color="#E757B6"
              style={{ flex: "1", minWidth: "150px" }}
            />
            <StatsCard
              stat={licenseStats.currentLicenses}
              name="Licences en cours"
              color="#24B34C"
              style={{ flex: "1", minWidth: "150px" }}
            />
            <StatsCard
              stat={licenseStats.canceledLicenses}
              name="Licences résiliées"
              color="#7C57E7"
              style={{ flex: "1", minWidth: "150px" }}
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
                  canceledCount:
                    licenseStatsByMonth.canceled[index]?.count || 0,
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
      )}
    </div>
  );
};

export default Statistics;
