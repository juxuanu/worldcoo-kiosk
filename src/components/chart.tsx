import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { $donations } from "./store.ts";
import { useStore } from "@nanostores/react";

export default function Chart() {
  const donations = useStore($donations);

  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth() + 1;
  const thisDate = now.getDate();
  const hours = [...Array(24)].map((_, i) => i);
  const every10min = [...Array(6)].map((_, i) => i * 10);

  const data = hours
    .map((hour) => every10min.map((minute) => ({ hour, minute })))
    .flat()
    .map(({ hour, minute }) => ({
      time: `${thisYear}-${thisMonth}-${thisDate} ${hour}:${minute}`,
      amount: donations
        .filter((donation) => {
          const date = new Date(donation.date);
          return (
            date.getFullYear() === thisYear &&
            date.getMonth() + 1 === thisMonth &&
            date.getDate() === thisDate &&
            date.getHours() === hour &&
            date.getMinutes() >= minute &&
            date.getMinutes() < minute + 10
          );
        })
        .reduce((acc, cur) => parseFloat((acc + cur.amount).toFixed(2)), 0),
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart width={500} height={400} data={data}>
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f18f45" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#f18f45" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" display="none" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#f18f45"
          fillOpacity={1}
          fill="url(#color)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
