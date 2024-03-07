import { atom } from "nanostores";

export const $donation = atom<{ date: string; amount: number } | undefined>();
