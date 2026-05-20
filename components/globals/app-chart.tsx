"use client"

import React from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

interface ChartData {
  name: string
  value: number
}

interface PieChartProps {
  title?: string
  data: ChartData[]
  colors: string[] // Array warna custom
  innerRadius?: number // 60 atau 0
  height?: number
}

export default function PieChartCustom({
  title,
  data,
  colors,
  innerRadius = 60,
  height = 300,
}: PieChartProps) {
  return (
    <div className="flex w-full flex-col rounded-xl border-2 border-gray-300 bg-white p-5 shadow-sm dark:bg-gray-800">
      {title && (
        <h3 className="mb-2 text-sm font-bold tracking-widest text-gray-400 uppercase">
          {title}
        </h3>
      )}

      <div style={{ width: "100%", height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius} // Custom di sini
              outerRadius={innerRadius === 0 ? 100 : 80} // Otomatis besarkan jika Pie penuh
              paddingAngle={innerRadius === 0 ? 0 : 5} // Kasih jarak hanya jika Donut
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              iconType="rect"
              formatter={(value) => (
                <span className="text-[11px] font-bold text-gray-500 uppercase">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
