import { atom } from "nanostores";

export const $donations = atom<{ date: string; amount: number }[]>(
  JSON.parse(localStorage.getItem("donations") ?? "[]"),
);
