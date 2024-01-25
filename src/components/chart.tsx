import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  YAxis,
  Legend,
  Bar,
  ReferenceLine,
} from "recharts";
import { $donations } from "./store.ts";
import { useStore } from "@nanostores/react";

const padStart = (number: number) => number.toString().padStart(2, "0");

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
      time:
        `${thisYear}-${padStart(thisMonth)}-${padStart(thisDate)}` +
        ` ${padStart(hour)}:${padStart(minute)}` +
        `-${padStart(minute + 10 === 60 ? hour + 1 : hour)}:${padStart(minute + 10 === 60 ? 0 : minute + 10)}`,
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
      <BarChart width={730} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0 0 0 / 15%)" />
        <XAxis dataKey="time" display="none" />
        <YAxis />
        <Tooltip />
        <ReferenceLine x={`2024-01-24 06:00-06:10`} stroke="#f18f45" />
        <ReferenceLine x={`2024-01-24 12:00-12:10`} stroke="#f18f45" />
        <ReferenceLine x={`2024-01-24 18:00-18:10`} stroke="#f18f45" />
        <Bar dataKey="amount" fill="#f18f45" />
      </BarChart>
    </ResponsiveContainer>
  );
}
