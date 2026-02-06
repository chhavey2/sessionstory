import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import MacCodeCard from '../components/MacCodeCard';

export default function Setup() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeFramework, setActiveFramework] = useState('react');

  const scriptTag = `<script src="https://static.sessionstory.co/index.js?id=${user?._id}"></script>`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(scriptTag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const frameworks = [
    {
      key: 'react',
      label: 'React / Next.js',
      icon: (
        <svg className="h-4 w-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="2.5" />
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        </svg>
      ),
      tags: ['JSX', 'Next.js'],
      code: `// In your layout or _app.js
import Script from 'next/script'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Script 
        src="https://static.sessionstory.co/index.js?id=${user?._id}"
        strategy="afterInteractive"
      />
    </>
  )
}`,
    },
    {
      key: 'vue',
      label: 'Vue.js',
      icon: (
        <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 3h4l6 10L18 3h4L12 21z" />
        </svg>
      ),
      tags: ['HTML', 'Vue'],
      code: `<!-- In public/index.html -->
<body>
  <div id="app"></div>
  <script src="https://static.sessionstory.co/index.js?id=${user?._id}"></script>
</body>`,
    },
    {
      key: 'html',
      label: 'Plain HTML',
      icon: (
        <svg className="h-4 w-4 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      tags: ['HTML'],
      code: `<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <!-- Your content -->
  
  ${scriptTag}
</body>
</html>`,
    },
  ];

  const verifySteps = [
    { icon: <svg className="h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>, text: 'Open your website in a new browser tab' },
    { icon: <svg className="h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>, text: 'Open the developer console (F12)' },
    { icon: <svg className="h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>, text: <>Look for: <code className="text-[11px]">[SessionRecorder] Recording started</code></> },
    { icon: <svg className="h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>, text: 'Navigate, click buttons, fill forms' },
    { icon: <svg className="h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>, text: 'Close the tab or navigate away' },
    { icon: <svg className="h-3.5 w-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, text: 'Check back here — your session should appear!' },
  ];

  return (
    <div className="pb-24">
      <div className="relative z-10 w-full lg:w-[70%] mx-auto px-6">
        <PageHeader
          kicker="Install"
          title="Setup"
          description="Add one script tag to start recording. Verify installation, then optionally customize masking and behavior."
        />

        <div className="mx-auto flex flex-col gap-6 py-2">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">1</span>
              <h2 className="text-base font-semibold tracking-tight text-foreground">Copy the script tag</h2>
            </div>
            <MacCodeCard
              title="Install the recorder"
              description="Paste this single line right before your closing </body> tag."
              tags={['HTML', 'Recorder']}
              code={scriptTag}
              rightSlot={
                <button
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-all duration-150 ${
                    copied
                      ? 'border-foreground/30 bg-secondary text-foreground'
                      : 'border-border bg-secondary text-muted-foreground hover:border-foreground/20 hover:text-foreground'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                      Copy
                    </>
                  )}
                </button>
              }
            />
          </div>
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">2</span>
              <h2 className="text-base font-semibold tracking-tight text-foreground">Verify installation</h2>
            </div>
            <div className="rounded-2xl border border-border bg-card/55 p-5 shadow-lg shadow-zinc-950/10 backdrop-blur-xl">
              <h3 className="mb-1 text-[15px] font-semibold tracking-tight text-foreground">How to verify</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">After adding the script, visit your website and follow these steps.</p>
              <ul className="flex flex-col gap-3">
                {verifySteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80">
                    <span className="mt-0.5 shrink-0">{step.icon}</span>
                    <span>{step.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">3</span>
              <h2 className="text-base font-semibold tracking-tight text-foreground">Advanced configuration</h2>
            </div>
            <MacCodeCard
              title="Optional settings"
              description="Masking, debug logs, and blocking specific elements."
              tags={['JS', 'Config']}
              code={`<script>
  window.SESSION_RECORDER_CONFIG = {
    debug: true,
    maskAllInputs: false,
    blockClass: 'rr-block',
    ignoreClass: 'rr-ignore',
  };
</script>
${scriptTag}`}
            />
          </div>
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">4</span>
              <h2 className="text-base font-semibold tracking-tight text-foreground">Framework integrations</h2>
            </div>
            <div className="rounded-2xl border border-border bg-card/55 shadow-lg shadow-zinc-950/10 backdrop-blur-xl overflow-hidden">
              <div className="flex border-b border-border">
                {frameworks.map((fw) => (
                  <button
                    key={fw.key}
                    type="button"
                    onClick={() => setActiveFramework(fw.key)}
                    className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors ${
                      activeFramework === fw.key
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                    }`}
                  >
                    {fw.icon}
                    {fw.label}
                  </button>
                ))}
              </div>
              <div className="p-4">
                <MacCodeCard
                  tags={frameworks.find((f) => f.key === activeFramework)?.tags}
                  code={frameworks.find((f) => f.key === activeFramework)?.code}
                />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card/55 p-5 shadow-lg shadow-zinc-950/10 backdrop-blur-xl">
            <h3 className="mb-1 text-[15px] font-semibold tracking-tight text-foreground">Need help?</h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">If the recorder isn&apos;t working, check that:</p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3 text-sm text-foreground/80">
                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                The script is loading (check the Network tab in dev tools)
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/80">
                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                There are no Content Security Policy (CSP) errors
              </li>
              <li className="flex items-start gap-3 text-sm text-foreground/80">
                <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                Your site is served over HTTPS
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
