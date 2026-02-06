import PatternText from './PatternText';

export default function PageHeader({ kicker, title, description }) {
  return (
    <header className="relative z-10 pt-2 pb-5">
      <div className="flex flex-col items-center text-center gap-2">
        {kicker ? (
          <span className="inline-flex items-center rounded-full border border-border/60 bg-card/25 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground/90 backdrop-blur-sm">
            {kicker}
          </span>
        ) : null}
        <PatternText
          text={title}
          className="text-2xl sm:text-3xl md:text-4xl tracking-tight"
        />
        {description ? (
          <p className="max-w-[58ch] text-sm sm:text-[15px] leading-relaxed text-foreground/80">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}

