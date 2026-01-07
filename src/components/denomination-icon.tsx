import type { Denomination } from "@/lib/denominations";
import { cn } from "@/lib/utils";

type DenominationIconProps = {
  denomination: Denomination;
};

export function DenominationIcon({ denomination }: DenominationIconProps) {
  const isCoin = denomination.type === "coin";

  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0 transition-colors",
        isCoin
          ? "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent text-accent-foreground"
          : "w-16 h-10 sm:w-20 sm:h-12 rounded-md bg-primary/20 text-primary-foreground"
      )}
    >
      <span
        className={cn(
          "font-bold",
          isCoin ? "text-base sm:text-lg" : "text-sm sm:text-base",
          !isCoin && 'text-slate-700 dark:text-slate-300'
        )}
      >
        {denomination.value}
      </span>
    </div>
  );
}
