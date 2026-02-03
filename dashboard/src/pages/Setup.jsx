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
    <div className="setup-page">
      <header className="page-header">
        <div>
          <h1>Setup</h1>
          <p>Add the session recorder to your website</p>
        </div>
      </header>

      <div className="setup-content">
        <section className="setup-section">
          <div className="section-number">1</div>
          <div className="section-content">
            <h2>Copy the script tag</h2>
            <p>
              Add this script tag to your website&apos;s HTML, just before the closing{' '}
              <code>&lt;/body&gt;</code> tag:
            </p>

            <div className="code-block">
              <pre>
                <code>{scriptTag}</code>
              </pre>
              <button
                onClick={copyToClipboard}
                className={`copy-button ${copied ? 'copied' : ''}`}
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

        <section className="setup-section">
          <div className="section-number">2</div>
          <div className="section-content">
            <h2>Verify installation</h2>
            <p>
              After adding the script, visit your website and perform some actions. Your sessions
              will appear in the dashboard within a few minutes.
            </p>

            <div className="verification-tips">
              <h4>How to verify:</h4>
              <ul>
                <li>Open your website in a new browser tab</li>
                <li>Open the browser&apos;s developer console (F12)</li>
                <li>
                  Look for the message: <code>[SessionRecorder] Recording started</code>
                </li>
                <li>Navigate around your site, click buttons, fill forms</li>
                <li>Close the tab or navigate away</li>
                <li>Check back here - your session should appear!</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="setup-section">
          <div className="section-number">3</div>
          <div className="section-content">
            <h2>Advanced configuration (optional)</h2>
            <p>Customize the recorder behavior by adding a configuration object before the script tag:</p>

            <div className="code-block">
              <pre>
                <code>{`<script>
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
${scriptTag}`}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className="setup-section">
          <div className="section-number">4</div>
          <div className="section-content">
            <h2>Framework integrations</h2>
            <p>The script works with any framework. Here are some specific examples:</p>

            <div className="framework-tabs">
              <details className="framework-tab">
                <summary>React / Next.js</summary>
                <div className="framework-content">
                  <p>
                    Add the script to your <code>index.html</code> or use a <code>Script</code>{' '}
                    component:
                  </p>
                  <div className="code-block small">
                    <pre>
                      <code>{`// In your layout or _app.js
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

              <details className="framework-tab">
                <summary>Vue.js</summary>
                <div className="framework-content">
                  <p>
                    Add to your <code>index.html</code> or load dynamically in a component:
                  </p>
                  <div className="code-block small">
                    <pre>
                      <code>{`<!-- In public/index.html -->
<body>
  <div id="app"></div>
  <script src="https://static.sessionstory.co/index.js?id=${user?._id}"></script>
</body>`}</code>
                    </pre>
                  </div>
                </div>
              </details>

              <details className="framework-tab">
                <summary>Plain HTML</summary>
                <div className="framework-content">
                  <p>
                    Simply add the script tag before the closing <code>&lt;/body&gt;</code> tag:
                  </p>
                  <div className="code-block small">
                    <pre>
                      <code>{`<!DOCTYPE html>
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

        <div className="setup-help">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <h4>Need help?</h4>
            <p>If you&apos;re having trouble with the installation, check that:</p>
            <ul>
              <li>The script is loading (check Network tab in dev tools)</li>
              <li>There are no Content Security Policy (CSP) errors</li>
              <li>Your site is served over HTTPS (required for some features)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

