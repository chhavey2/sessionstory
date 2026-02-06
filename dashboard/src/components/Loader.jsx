export default function Loader({ message, className = '' }) {
  return (
    <div
      className={`flex min-h-[400px] flex-col items-center justify-center gap-5 text-muted-foreground ${className}`}
      role="status"
      aria-label={message || 'Loading'}
    >
      <div className="newtons-cradle" style={{ ['--uib-loader-color']: 'oklch(0.708 0 0)' }}>
        <div className="newtons-cradle__dot" />
        <div className="newtons-cradle__dot" />
        <div className="newtons-cradle__dot" />
        <div className="newtons-cradle__dot" />
      </div>
      {message ? <p className="text-sm">{message}</p> : null}
    </div>
  );
}
