"use client"; // Wajib ada karena Recharts butuh interaksi browser

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

type ChartProps = {
  data: any[];
};

export default function SalesChart({ data }: ChartProps) {
  // Ambil top 10 data saja biar grafik gak penuh sesak
  const chartData = [...data]
    .sort((a, b) => b.daily_sales - a.daily_sales)
    .slice(0, 10);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Top 10 Sales Performance</h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
              interval={0}
              angle={-45} // Miringkan teks biar gak tabrakan
              textAnchor="end"
              height={70} 
            />
            <YAxis 
              tickFormatter={(value) => `Rp${(value / 1000000).toFixed(0)}jt`} // Format sumbu Y jadi "Rp10jt"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Sales']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="daily_sales" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index < 3 ? "#2563eb" : "#94a3b8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}