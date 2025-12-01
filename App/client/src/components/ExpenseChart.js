import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const ExpenseChart = () => {
  const data = [
    { name: "Housing", value: 1200 },
    { name: "Food", value: 800 },
    { name: "Transportation", value: 400 },
    { name: "Entertainment", value: 250 },
    { name: "Utilities", value: 350 },
  ];

  const COLORS = ["#3A5A40", "#588157", "#A3B18A", "#DAD7CD", "#344E41"];

  return (
    <div className="expense-chart-container">
      <h3 className="chart-title">Monthly Expenses</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            fill="#82ca9d"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
