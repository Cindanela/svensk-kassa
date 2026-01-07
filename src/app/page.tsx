"use client";

import { useState, useMemo, useRef } from "react";
import { coins, notes, type Denomination } from "@/lib/denominations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { DenominationIcon } from "@/components/denomination-icon";
import {
  Download,
  MoreVertical,
  RotateCcw,
  Upload,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

type Counts = { [key: number]: number };

const formatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const DenominationRow = ({
  denomination,
  count,
  onCountChange,
}: {
  denomination: Denomination;
  count: number;
  onCountChange: (value: number, count: number) => void;
}) => {
  const subtotal = useMemo(() => denomination.value * count, [denomination.value, count]);

  return (
    <div className="flex items-center gap-2 sm:gap-4 py-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <DenominationIcon denomination={denomination} />
      <div className="flex-grow">
        <p className="font-semibold sm:text-lg">{denomination.label}</p>
        <p className="text-muted-foreground text-sm">
          {formatter.format(denomination.value)} / st
        </p>
      </div>
      <Input
        type="number"
        className="w-20 sm:w-24 text-center text-base sm:text-lg tabular-nums"
        value={count === 0 ? "" : count}
        onChange={(e) =>
          onCountChange(denomination.value, parseInt(e.target.value, 10) || 0)
        }
        placeholder="0"
        min="0"
        aria-label={`Antal för ${denomination.label}`}
      />
      <p className="w-24 sm:w-28 text-right font-semibold text-base sm:text-lg tabular-nums text-muted-foreground">
        {formatter.format(subtotal)}
      </p>
    </div>
  );
};

export default function Home() {
  const { toast } = useToast();
  const [counts, setCounts] = useState<Counts>({});
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleCountChange = (value: number, count: number) => {
    setCounts((prev) => ({ ...prev, [value]: Math.max(0, count) }));
  };

  const handleReset = () => {
    setCounts({});
    setComment("");
    setTitle("");
    setDate(new Date().toISOString().slice(0, 10));
    toast({
      title: "Återställd",
      description: "Alla fält har rensats.",
    });
  };

  const { coinTotal, noteTotal, grandTotal } = useMemo(() => {
    let coinTotal = 0;
    let noteTotal = 0;
    for (const d of coins) {
      coinTotal += (counts[d.value] || 0) * d.value;
    }
    for (const d of notes) {
      noteTotal += (counts[d.value] || 0) * d.value;
    }
    return { coinTotal, noteTotal, grandTotal: coinTotal + noteTotal };
  }, [counts]);

  const handleExport = () => {
    const exportData = {
      version: 1,
      createdAt: new Date().toISOString(),
      title,
      date,
      counts,
      comment,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    a.download = `svensk-kassa-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Exporterad!",
      description: "Din kassaberäkning har sparats.",
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result !== "string") {
          throw new Error("Kunde inte läsa filen.");
        }
        const data = JSON.parse(result);
        if (data && typeof data.counts === "object") {
          setCounts(data.counts || {});
          setComment(data.comment || "");
          setTitle(data.title || "");
          setDate(data.date || new Date().toISOString().slice(0, 10));
          toast({
            title: "Importerad!",
            description: "Kassaberäkning har laddats.",
          });
        } else {
          throw new Error("Ogiltigt filformat.");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Importfel",
          description:
            error instanceof Error ? error.message : "Ett okänt fel uppstod.",
        });
      } finally {
        // Reset file input
        if(importFileRef.current) {
          importFileRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <header className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-20">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl sm:text-2xl font-headline font-bold text-primary-foreground tracking-tight">
            Svensk Kassa
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">Meny</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" /> Nollställ
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => importFileRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Importera
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Exportera
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            type="file"
            ref={importFileRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".json"
          />
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 space-y-6 pb-40">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="T.ex. Dagskassa"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Datum</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Mynt</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {coins.map((d) => (
              <DenominationRow
                key={d.value}
                denomination={d}
                count={counts[d.value] || 0}
                onCountChange={handleCountChange}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Sedlar</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            {notes.map((d) => (
              <DenominationRow
                key={d.value}
                denomination={d}
                count={counts[d.value] || 0}
                onCountChange={handleCountChange}
              />
            ))}
          </CardContent>
        </Card>

        <Textarea
          placeholder="Lägg till en kommentar..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="text-base"
        />
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t z-10">
        <div className="container mx-auto p-4 space-y-3">
          <div className="flex justify-between items-center text-lg">
            <span>Summa Mynt:</span>
            <span className="font-semibold tabular-nums">
              {formatter.format(coinTotal)}
            </span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span>Summa Sedlar:</span>
            <span className="font-semibold tabular-nums">
              {formatter.format(noteTotal)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-2xl font-bold text-primary-foreground">
            <span className="font-headline">Totalsumma:</span>
            <span className="tabular-nums">{formatter.format(grandTotal)}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
