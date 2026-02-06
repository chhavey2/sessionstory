export default function MacCodeCard({
  title,
  description,
  tags = [],
  code,
  className = '',
  rightSlot,
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-lg shadow-zinc-950/20 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="inline-block h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="inline-block h-3 w-3 rounded-full bg-[#28c941]" />
        </div>
        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>

      {title ? (
        <div className="mb-1 text-[15px] font-semibold tracking-tight text-foreground">
          {title}
        </div>
      ) : null}
      {description ? (
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}

      {tags?.length ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-md border border-border bg-card px-2 py-1 text-[10px] font-semibold tracking-wide text-foreground/70"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {code != null && code !== '' ? (
        <div className="rounded-xl border border-border bg-card p-4">
          <pre className="m-0 max-h-56 overflow-auto text-[12.5px] leading-relaxed text-foreground/80">
            <code className="border-0 bg-transparent p-0 text-inherit">{code}</code>
          </pre>
        </div>
      ) : null}
    </div>
  );
}

