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

  const COLORS = ["#15616d", "#ff7d00", "#ffecd1", "#78290f", "#001524"];

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
            fill="#15616d"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#001524",
              border: "1px solid #15616d",
              color: "#ffecd1",
            }}
          />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: "#ffecd1" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
