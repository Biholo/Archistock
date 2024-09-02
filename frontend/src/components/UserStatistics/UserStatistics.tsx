import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomPieChart from "../Stats/CustomPieChart/CustomPieChart";
import { useAuth } from "../../contexts/AuthContext";
import { userApi } from "../../services/apiService.js";
import ArchistockApiService from "../../services/ArchistockApiService";

// Interface pour typer les données de l'Api
interface FileData {
  id: string;
  createdAt: string;
  format: string;
  size: number;
}

// Les couleurs pour les graphiques
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
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
const getColorByCategory = (
  category: string,
  categoryColorMap: Record<string, string>
): string => {
  if (!categoryColorMap.hasOwnProperty(category)) {
    const colorIndex = Object.keys(categoryColorMap).length % COLORS.length;
    categoryColorMap[category] = COLORS[colorIndex];
  }
  return categoryColorMap[category];
};

const UserStatistics = () => {
  const { user } = useAuth();
  const [fileSizesByCategory, setFileSizesByCategory] = useState<
    { name: string; value: number }[]
  >([]);

  const [totalSize, setTotalSize] = useState(0);
  const [subscriptionSize, setSubscriptionSize] = useState(0);
  const archistockApiService = new ArchistockApiService();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupère les données de l'utilisateur connecté
        const data: FileData[] = await userApi.getFilesByUserId(user.id);

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
          (total: number, item) => total + item.subscription.size,
          0
        );

        setSubscriptionSize(totalSubscriptionSize);
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
    <div>
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
    </div>
  );
};

export default UserStatistics;
