export type Denomination = {
  value: number;
  type: "coin" | "note";
  label: string;
};

export const denominations: Denomination[] = [
  // Mynt (Coins)
  { value: 10, type: "coin", label: "10-krona" },
  { value: 5, type: "coin", label: "5-krona" },
  { value: 2, type: "coin", label: "2-krona" },
  { value: 1, type: "coin", label: "1-krona" },
  // Sedlar (Banknotes)
  { value: 500, type: "note", label: "500-lapp" },
  { value: 200, type: "note", label: "200-lapp" },
  { value: 100, type: "note", label: "100-lapp" },
  { value: 50, type: "note", label: "50-lapp" },
  { value: 20, type: "note", label: "20-lapp" },
];

export const coins = denominations
  .filter((d) => d.type === "coin")
  .sort((a, b) => b.value - a.value);
  
export const notes = denominations
  .filter((d) => d.type === "note")
  .sort((a, b) => b.value - a.value);
