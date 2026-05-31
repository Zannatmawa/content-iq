"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    type TooltipProps,
} from "recharts";

type ChartDay = { date: string; count: number };

// ── Custom tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;

    const value = payload[0]?.value ?? 0;

    return (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {label}
            </p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                {value} piece{value !== 1 ? "s" : ""}
            </p>
        </div>
    );
}

// ── Component ─────────────────────────────────────────────────────────────────
export function ContentOverTimeChart({ data }: { data: ChartDay[] }) {
    // Show every 5th label so the axis doesn't crowd
    const tickInterval = Math.ceil(data.length / 6);

    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart
                data={data}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                barSize={14}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-slate-400 dark:text-slate-600"
                    tickLine={false}
                    axisLine={false}
                    interval={tickInterval - 1}
                />
                <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-slate-400 dark:text-slate-600"
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "currentColor", className: "text-slate-50 dark:text-slate-800/60" }}
                />
                <Bar
                    dataKey="count"
                    fill="#0f172a"
                    radius={[4, 4, 0, 0]}
                    className="dark:fill-white"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
