import React, { useEffect, useState } from "react";
import { fileApi } from "../../services/apiService";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import StatsCard from "../../components/StatsCard/StatsCard";

interface FileData {
  id: number;
  createdAt: string;
  format: string;
  size: number;
}

interface SizeByExtension {
  Extension: string;
  Size: number;
}

interface FileCountByMonth {
  month: string;
  count: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const getColorByExtension = (extension: string, extensionColorMap: { [key: string]: string }): string => {
  if (!extensionColorMap.hasOwnProperty(extension)) {
    const colorIndex = Object.keys(extensionColorMap).length % COLORS.length;
    extensionColorMap[extension] = COLORS[colorIndex];
  }
  return extensionColorMap[extension];
};

const Statistics: React.FC = () => {
  const [fileData, setFileData] = useState<FileData[]>([]);
  const [todayFilesCount, setTodayFilesCount] = useState<number>(0);
  const [fileSizesByExtension, setFileSizesByExtension] = useState<SizeByExtension[]>([]);
  const [filesByMonth, setFilesByMonth] = useState<FileCountByMonth[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fileApi.getAll();
        setFileData(data);

        // Count the number of files uploaded today
        const today = new Date();
        const todayDateString = today.toISOString().split("T")[0];
        const filesUploadedToday = data.filter((file) =>
          file.createdAt.startsWith(todayDateString)
        );
        setTodayFilesCount(filesUploadedToday.length);

        // Count size by extension
        const sizesByExtension: { [key: string]: number } = {};
        data.forEach((file) => {
          const ext = file.format;
          sizesByExtension[ext] = (sizesByExtension[ext] || 0) + file.size;
        });

        const sizesArray: SizeByExtension[] = Object.entries(sizesByExtension).map(
          ([key, value]) => ({
            Extension: key,
            Size: value,
          })
        );

        setFileSizesByExtension(sizesArray);

        // Count files by month
        const countsByMonth: { [key: string]: number } = {};
        data.forEach((file) => {
          const date = new Date(file.createdAt);
          const month = `${date.getFullYear()}-${(
            "0" + (date.getMonth() + 1)
          ).slice(-2)}`;
          countsByMonth[month] = (countsByMonth[month] || 0) + 1;
        });

        const countsArray: FileCountByMonth[] = Object.entries(countsByMonth)
          .map(([month, count]) => ({
            month,
            count,
          }))
          .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

        setFilesByMonth(countsArray);
      } catch (error) {
        console.error("Error fetching file statistics:", error);
      }
    };

    fetchData();
  }, []);

  const extensionColorMap: { [key: string]: string } = {};

  return (
    <div>
      <div className="flex flex-row justify-between">
        <StatsCard stat={fileData.length} name=" Upload from start" color="#FFA800" />
        <StatsCard stat={todayFilesCount} name=" Upload Today" color="#E757B6" />
        <StatsCard stat={32} name="Shared Today" color="#24B34C" />
        <StatsCard stat={32} name="Name" color="#7C57E7" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <h2 style={{ textAlign: "center" }}>Sizes by Extension</h2>
        <div style={{ display: "flex", width: "100%", height: 250 }}>
          <div style={{ width: "50%", height: "100%" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={fileSizesByExtension}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="Size"
                >
                  {fileSizesByExtension.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColorByExtension(entry.Extension, extensionColorMap)}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => [
                    `${value} Octets`,
                    props.payload.Extension,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ width: "50%", height: "100%" }}>
            <ResponsiveContainer>
              <BarChart
                data={fileSizesByExtension}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Extension" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Size" fill="#8884d8">
                  {fileSizesByExtension.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColorByExtension(entry.Extension, extensionColorMap)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div style={{ width: "100%", height: 250 }}>
        <h2 style={{ textAlign: "center" }}>File Uploads by Month</h2>
        <ResponsiveContainer>
          <LineChart
            data={filesByMonth}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#FFA800"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistics;
