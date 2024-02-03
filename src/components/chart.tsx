import {
  XAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  YAxis,
  Bar,
  ReferenceLine,
} from "recharts";
import { $donation } from "./store.ts";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";

const padStart = (number: number) => number.toString().padStart(2, "0");

export default function Chart() {
  const [period, setPeriod] = useState<Record<string, number>>(
    JSON.parse(localStorage.getItem("period") ?? "{}"),
  );
  const donation = useStore($donation);

  useEffect(() => {
    if (!donation) return;

    const date = new Date(donation.date);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minutesOnBlockOf10 = Math.floor(date.getMinutes() / 10) * 10;

    const periodKey =
      `${year}-${padStart(month)}-${padStart(day)}` +
      ` ${padStart(hour)}:${padStart(minutesOnBlockOf10)}` +
      `-${padStart(minutesOnBlockOf10 + 10 === 60 ? hour + 1 : hour)}:${padStart(minutesOnBlockOf10 + 10 === 60 ? 0 : minutesOnBlockOf10 + 10)}`;

    const updatedPeriod = {
      ...period,
      [periodKey]: period[periodKey]
        ? (Math.round(period[periodKey] * 100) +
            Math.round(donation.amount * 100)) /
          100
        : donation.amount,
    };

    setPeriod(updatedPeriod);
    localStorage.setItem("period", JSON.stringify(updatedPeriod));
  }, [donation]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={730}
        height={250}
        data={Object.entries(period).map(([time, amount]) => ({
          time: time.split(" ")[1],
          amount,
        }))}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0 0 0 / 15%)" />
        <XAxis dataKey="time" />
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
