import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowRight } from "lucide-react";

type ShortcutCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  variant?: "blue" | "green" | "purple";
  className?: string;
};

const variantStyles = {
  blue: {
    card: "border-red-200/60 bg-gradient-to-br from-red-50/80 to-white hover:from-red-100/80 hover:border-red-300/60",
    icon: "bg-red-500/10 text-red-600 ring-red-500/20",
    button: "bg-red-600 hover:bg-red-700 text-white",
  },
  green: {
    card: "border-green-200/60 bg-gradient-to-br from-green-50/80 to-white hover:from-green-100/80 hover:border-green-300/60",
    icon: "bg-green-500/10 text-green-600 ring-green-500/20",
    button: "bg-green-600 hover:bg-green-700 text-white",
  },
  purple: {
    card: "border-purple-200/60 bg-gradient-to-br from-purple-50/80 to-white hover:from-purple-100/80 hover:border-purple-300/60",
    icon: "bg-purple-500/10 text-purple-600 ring-purple-500/20",
    button: "bg-purple-600 hover:bg-purple-700 text-white",
  },
};

export function ShortcutCard({
  title,
  description,
  href,
  icon: Icon,
  variant = "blue",
  className,
}: ShortcutCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card
      className={cn(
        "rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden",
        styles.card,
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div
            aria-hidden="true"
            className={cn(
              "size-12 shrink-0 rounded-xl grid place-items-center ring-1 transition-transform group-hover:scale-110",
              styles.icon
            )}
          >
            <Icon className="size-6" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold text-slate-900 mb-1">
              {title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
        <Link
          href={href}
          aria-label={`Buka halaman ${title}`}
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 group-hover:gap-3 shadow-sm",
            styles.button
          )}
        >
          Kelola
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
}
