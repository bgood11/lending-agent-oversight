export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-foreground/80">
        {eyebrow}
      </div>
      <h2 className="font-display text-3xl sm:text-4xl font-medium leading-tight tracking-tight mt-2">
        {title}
      </h2>
      <p className="text-base text-muted-foreground mt-3 leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
