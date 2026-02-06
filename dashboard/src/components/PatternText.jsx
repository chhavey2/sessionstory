export default function PatternText({ text, className = '' }) {
  return (
    <span
      data-shadow={text}
      className={`relative inline-block font-bold text-foreground
        [text-shadow:0.02em_0.02em_0_var(--background)]
        after:absolute after:top-[0.05em] after:left-[0.05em] after:-z-10 after:content-[attr(data-shadow)]
        after:bg-[length:0.05em_0.05em] after:bg-clip-text after:text-transparent after:[text-shadow:none]
        after:bg-[linear-gradient(45deg,transparent_45%,var(--foreground)_45%,var(--foreground)_55%,transparent_0)]
        after:animate-shadanim ${className}`}
    >
      {text}
    </span>
  );
}

