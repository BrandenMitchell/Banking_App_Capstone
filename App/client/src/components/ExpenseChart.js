import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

// Export spending data so other components can use it
export const spendingData = [
  { name: "Housing", value: 1200 },
  { name: "Food", value: 800 },
  { name: "Transportation", value: 400 },
  { name: "Entertainment", value: 250 },
  { name: "Utilities", value: 350 },
];

const ExpenseChart = ({ data }) => {
  const chartData = data || spendingData;

  const COLORS = ["#81f57f", "#fe9449", "#4089b6", "#cfbb4e", "#DAD7CD", "#d96161", "#707070"];

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#023047",
              border: "1px solid #0a9396",
              color: "#ffffff",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={35}
            wrapperStyle={{ color: "#ffffff" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
