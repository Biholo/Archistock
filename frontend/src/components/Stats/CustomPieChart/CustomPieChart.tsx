import React from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index, colors, data }) => {
  const RADIAN = Math.PI / 180;
  const radius = 25 + innerRadius + (outerRadius - innerRadius);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={colors[index % colors.length]}  // Utilisation de la couleur correspondante
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${data[index].name}: ${data[index].value}`}
    </text>
  );
};

const CustomPieChart = ({ data, colors, width, height }) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={90}
          label={(props) => <CustomLabel {...props} colors={colors} data={data} />}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
