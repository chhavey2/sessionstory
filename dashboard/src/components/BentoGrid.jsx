import { cn } from '../lib/utils';

export function BentoGrid({ items = [], className = '' }) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-3', className)}>
      {items.map((item, index) => {
        const {
          title,
          description,
          icon,
          status,
          tags,
          meta,
          cta,
          value,
          colSpan,
          hasPersistentHover,
          href,
          onClick,
          target,
        } = item;

        const Wrapper = href ? 'a' : onClick ? 'button' : 'div';
        const wrapperProps = href
          ? { href, target: target ?? '_blank', rel: 'noopener noreferrer' }
          : onClick
            ? { type: 'button', onClick }
            : {};

        return (
          <Wrapper
            key={item.id ?? index}
            {...wrapperProps}
            className={cn(
              'group relative p-4 rounded-xl overflow-hidden transition-all duration-300 text-left',
              'border border-border bg-card',
              'hover:shadow-lg hover:shadow-zinc-950/10',
              'hover:-translate-y-0.5 will-change-transform',
              colSpan ? 'col-span-1' : 'col-span-1',
              colSpan === 2 ? 'md:col-span-2' : '',
              {
                'shadow-lg shadow-zinc-950/10 -translate-y-0.5': hasPersistentHover,
              },
            )}
          >
            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-300',
                hasPersistentHover ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
              )}
              aria-hidden
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:4px_4px]" />
            </div>

            <div className="relative flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary/50 group-hover:bg-secondary transition-all duration-300">
                  {icon}
                </div>
                {status ? (
                  <span
                    className={cn(
                      'text-[11px] font-medium px-2 py-1 rounded-lg backdrop-blur-sm',
                      'bg-secondary/50 text-muted-foreground',
                      'transition-colors duration-300 group-hover:bg-secondary',
                    )}
                  >
                    {status}
                  </span>
                ) : null}
              </div>

              {value !== undefined && value !== null ? (
                <div className="text-3xl sm:text-4xl font-bold tracking-tight leading-none text-foreground">
                  {value}
                </div>
              ) : null}

              <div className="space-y-1.5">
                <h3 className="font-semibold text-foreground tracking-tight text-[15px]">
                  {title}
                  {meta ? (
                    <span className="ml-2 text-[11px] text-muted-foreground font-normal">
                      {meta}
                    </span>
                  ) : null}
                </h3>
                {item.content ? item.content : description ? (
                  <p className="text-sm text-foreground/70 leading-snug font-[425] whitespace-pre-line">
                    {description}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center flex-wrap gap-2 text-[11px] text-muted-foreground">
                  {tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-md bg-secondary/50 backdrop-blur-sm transition-all duration-200 hover:bg-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                {cta ? (
                  <span className="text-[11px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {cta}
                  </span>
                ) : null}
              </div>
            </div>

            <div
              className={cn(
                'absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-border/40 to-transparent',
                hasPersistentHover ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                'transition-opacity duration-300',
              )}
              aria-hidden
            />
          </Wrapper>
        );
      })}
    </div>
  );
}

export default BentoGrid;

