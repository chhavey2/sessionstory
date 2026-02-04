import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Setup() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="pb-12">
      <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6 md:px-12 md:pt-10 md:pb-8">
        <div>
          <h1 className="mb-1.5 text-2xl font-bold tracking-tight md:text-3xl bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent">
            Setup
          </h1>
          <p className="text-[15px] text-white/40">Add the session recorder to your website</p>
        </div>
      </header>

      <div className="relative z-10 max-w-[900px] px-6 py-6 md:px-12 md:py-8">
        <section className="mb-12 flex gap-7">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-lg font-bold text-white shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            1
          </div>
          <div className="flex-1">
            <h2 className="mb-3 text-xl font-semibold tracking-tight">Copy the script tag</h2>
            <p className="mb-6 text-[15px] leading-relaxed text-white/40">
              Add this script tag to your website&apos;s HTML, just before the closing{' '}
              <code>&lt;/body&gt;</code> tag:
            </p>

            <div className="relative overflow-hidden rounded-xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-emerald-500/30 before:to-transparent"
              style={{ WebkitBackdropFilter: 'blur(20px)' }}
            >
              <pre className="overflow-x-auto p-6 m-0">
                <code className="border-0 bg-transparent p-0 text-[13px] leading-relaxed text-white/70">
                  {scriptTag}
                </code>
              </pre>
              <button
                onClick={copyToClipboard}
                title="Copy to clipboard"
                className={`absolute right-3.5 top-3.5 flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold transition-all duration-150 ${
                  copied
                    ? 'border-emerald-500 border-solid bg-[rgba(16,185,129,0.1)] text-emerald-400'
                    : 'border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] text-white/40 hover:border-emerald-500 hover:border-solid hover:bg-[rgba(16,185,129,0.1)] hover:text-emerald-400'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="mb-12 flex gap-7">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-lg font-bold text-white shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            2
          </div>
          <div className="flex-1">
            <h2 className="mb-3 text-xl font-semibold tracking-tight">Verify installation</h2>
            <p className="mb-6 text-[15px] leading-relaxed text-white/40">
              After adding the script, visit your website and perform some actions. Your sessions
              will appear in the dashboard within a few minutes.
            </p>

            <div className="rounded-xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] p-6 backdrop-blur-[20px]"
              style={{ WebkitBackdropFilter: 'blur(20px)' }}
            >
              <h4 className="mb-4 text-sm font-semibold text-emerald-400">How to verify:</h4>
              <ul className="flex flex-col gap-3 list-none">
                <li className="flex items-start gap-3 text-sm leading-relaxed text-white/70 before:shrink-0 before:font-semibold before:text-emerald-400 before:content-['→']">
                  Open your website in a new browser tab
                </li>
                <li className="flex items-start gap-3 text-sm leading-relaxed text-white/70 before:shrink-0 before:font-semibold before:text-emerald-400 before:content-['→']">
                  Open the browser&apos;s developer console (F12)
                </li>
                <li className="flex items-start gap-3 text-sm leading-relaxed text-white/70 before:shrink-0 before:font-semibold before:text-emerald-400 before:content-['→']">
                  Look for the message: <code>[SessionRecorder] Recording started</code>
                </li>
                <li className="flex items-start gap-3 text-sm leading-relaxed text-white/70 before:shrink-0 before:font-semibold before:text-emerald-400 before:content-['→']">
                  Navigate around your site, click buttons, fill forms
                </li>
                <li className="flex items-start gap-3 text-sm leading-relaxed text-white/70 before:shrink-0 before:font-semibold before:text-emerald-400 before:content-['→']">
                  Close the tab or navigate away
                </li>
                <li className="flex items-start gap-3 text-sm leading-relaxed text-white/70 before:shrink-0 before:font-semibold before:text-emerald-400 before:content-['→']">
                  Check back here - your session should appear!
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12 flex gap-7">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-lg font-bold text-white shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            3
          </div>
          <div className="flex-1">
            <h2 className="mb-3 text-xl font-semibold tracking-tight">Advanced configuration (optional)</h2>
            <p className="mb-6 text-[15px] leading-relaxed text-white/40">
              Customize the recorder behavior by adding a configuration object before the script tag:
            </p>

            <div className="relative overflow-hidden rounded-xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-emerald-500/30 before:to-transparent"
              style={{ WebkitBackdropFilter: 'blur(20px)' }}
            >
              <pre className="overflow-x-auto p-6 m-0">
                <code className="border-0 bg-transparent p-0 text-[13px] leading-relaxed text-white/70">
                  {`<script>
  window.SESSION_RECORDER_CONFIG = {
    // Enable debug mode to see logs in console
    debug: true,
    
    // Mask all input values for privacy
    maskAllInputs: false,
    
    // CSS class to block recording specific elements
    blockClass: 'rr-block',
    
    // CSS class to ignore specific elements
    ignoreClass: 'rr-ignore',
  };
</script>
${scriptTag}`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        <section className="mb-12 flex gap-7">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-lg font-bold text-white shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            4
          </div>
          <div className="flex-1">
            <h2 className="mb-3 text-xl font-semibold tracking-tight">Framework integrations</h2>
            <p className="mb-6 text-[15px] leading-relaxed text-white/40">
              The script works with any framework. Here are some specific examples:
            </p>

            <div className="flex flex-col gap-3">
              <details className="group rounded-xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] transition-[border-color] duration-150 hover:border-white/15 open:border-emerald-500 open:border-solid"
                style={{ WebkitBackdropFilter: 'blur(20px)' }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-sm font-semibold">
                  React / Next.js
                  <span className="text-xl text-white/40 after:content-['+'] group-open:after:content-['−'] group-open:after:text-emerald-400"> </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="mb-4 text-sm text-white/40">
                    Add the script to your <code>index.html</code> or use a <code>Script</code>{' '}
                    component:
                  </p>
                  <div className="overflow-hidden rounded-xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px]"
                    style={{ WebkitBackdropFilter: 'blur(20px)' }}
                  >
                    <pre className="overflow-x-auto p-4 m-0">
                      <code className="text-xs text-white/70">{`// In your layout or _app.js
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
}`}</code>
                    </pre>
                  </div>
                </div>
              </details>

              <details className="group rounded-xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] transition-[border-color] duration-150 hover:border-white/15 open:border-emerald-500 open:border-solid"
                style={{ WebkitBackdropFilter: 'blur(20px)' }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-sm font-semibold">
                  Vue.js
                  <span className="text-xl text-white/40 after:content-['+'] group-open:after:content-['−'] group-open:after:text-emerald-400"> </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="mb-4 text-sm text-white/40">
                    Add to your <code>index.html</code> or load dynamically in a component:
                  </p>
                  <div className="overflow-hidden rounded-xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px]"
                    style={{ WebkitBackdropFilter: 'blur(20px)' }}
                  >
                    <pre className="overflow-x-auto p-4 m-0">
                      <code className="text-xs text-white/70">{`<!-- In public/index.html -->
<body>
  <div id="app"></div>
  <script src="https://static.sessionstory.co/index.js?id=${user?._id}"></script>
</body>`}</code>
                    </pre>
                  </div>
                </div>
              </details>

              <details className="group rounded-xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] transition-[border-color] duration-150 hover:border-white/15 open:border-emerald-500 open:border-solid"
                style={{ WebkitBackdropFilter: 'blur(20px)' }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 text-sm font-semibold">
                  Plain HTML
                  <span className="text-xl text-white/40 after:content-['+'] group-open:after:content-['−'] group-open:after:text-emerald-400"> </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="mb-4 text-sm text-white/40">
                    Simply add the script tag before the closing <code>&lt;/body&gt;</code> tag:
                  </p>
                  <div className="overflow-hidden rounded-xl border border-dashed border-white/10 bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px]"
                    style={{ WebkitBackdropFilter: 'blur(20px)' }}
                  >
                    <pre className="overflow-x-auto p-4 m-0">
                      <code className="text-xs text-white/70">{`<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <!-- Your content -->
  
  ${scriptTag}
</body>
</html>`}</code>
                    </pre>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </section>

        <div className="relative flex gap-5 overflow-hidden rounded-2xl border border-dashed border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-emerald-500/5 p-7 before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-blue-500/40 before:to-transparent">
          <svg className="mt-0.5 h-6 w-6 shrink-0 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <h4 className="mb-2.5 text-[15px] font-semibold text-blue-400">Need help?</h4>
            <p className="mb-3.5 text-sm text-white/70">
              If you&apos;re having trouble with the installation, check that:
            </p>
            <ul className="list-none flex flex-col gap-2">
              <li className="relative pl-4 text-sm text-white/40 before:absolute before:left-0 before:text-blue-400 before:content-['•']">
                The script is loading (check Network tab in dev tools)
              </li>
              <li className="relative pl-4 text-sm text-white/40 before:absolute before:left-0 before:text-blue-400 before:content-['•']">
                There are no Content Security Policy (CSP) errors
              </li>
              <li className="relative pl-4 text-sm text-white/40 before:absolute before:left-0 before:text-blue-400 before:content-['•']">
                Your site is served over HTTPS (required for some features)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
