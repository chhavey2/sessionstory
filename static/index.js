/**
 * Session Recorder - Universal
 * 
 * A production-ready session recorder that works with any framework.
 * Compatible with: Plain HTML, React, Next.js, Vue, Angular, etc.
 * 
 * Usage in plain HTML:
 * <script src="session-recorder.js"></script>
 * 
 * Usage with custom config:
 * <script>
 *   window.SESSION_RECORDER_CONFIG = {
 *     serverEndpoint: 'https://your-api.com/sessions',
 *     debug: false,
 *     autoStart: true
 *   };
 * </script>
 * <script src="session-recorder.js"></script>
 * 
 * Usage in React/Next.js/Vue (import as module):
 * import SessionRecorder from './session-recorder';
 * SessionRecorder.start();
 */

(function(root, factory) {
  // UMD (Universal Module Definition) pattern for framework compatibility
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS / Node.js
    module.exports = factory();
  } else {
    // Browser globals
    root.SessionRecorder = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // ============================================
  // Configuration (can be overridden via window.SESSION_RECORDER_CONFIG)
  // ============================================
  var DEFAULT_CONFIG = {
    // Server endpoint to send recordings (set to null to disable)
    serverEndpoint: null,
    
    // Save to localStorage as backup
    useLocalStorage: true,
    localStorageKey: 'rrweb-auto-session',
    
    // Minimum events required to save a session
    minEventsToSave: 5,
    
    // Debug mode - logs to console
    debug: true,
    
    // Auto-start recording on load (set to false for framework usage)
    autoStart: true,
    
    // Recording options
    maskAllInputs: false,      // Set to true to mask input values for privacy
    blockClass: 'rr-block',    // Elements with this class won't be recorded
    ignoreClass: 'rr-ignore',  // Elements with this class will be ignored
    
    // Sampling options to reduce data
    mousemoveSampling: true,
    scrollThrottle: 150,
    inputSampling: 'last',
    
    // Snapshot optimization - prevents duplicate element issues
    checkoutEveryNth: 200,     // Create full snapshot every N events
    checkoutEveryNms: 60000,   // Or every N milliseconds (1 minute default)
  };

  // Helper to get script query params (e.g., ?id=123)
  function getScriptParams() {
    var params = {};
    if (typeof document !== 'undefined' && document.currentScript) {
      var scriptSrc = document.currentScript.src;
      var qIdx = scriptSrc.indexOf('?');
      if (qIdx !== -1) {
        var pairs = scriptSrc.substring(qIdx + 1).split('&');
        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split('=');
          if (pair.length === 2) {
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
          }
        }
      }
    }
    return params;
  }

  // Merge with user config and script params
  var userConfig = (typeof window !== 'undefined' && window.SESSION_RECORDER_CONFIG) || {};
  var scriptParams = getScriptParams();
  var CONFIG = Object.assign({}, DEFAULT_CONFIG, userConfig, scriptParams);

  // ============================================
  // State
  // ============================================
  var events = [];
  var eventsToSend = [];
  var stopRecording = null;
  var sendInterval = null;
  var sessionId = generateSessionId();
  var startTime = Date.now();
  var rrwebLoaded = false;
  var fingerprintLoaded = false;
  var isInitialized = false;
  var nodeIdMap = new Map(); // Track node IDs to prevent duplicates
  var lastFullSnapshotTime = 0;

  // ============================================
  // Utility Functions
  // ============================================
  
  function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
  }

  function log() {
    if (CONFIG.debug && typeof console !== 'undefined') {
      var args = Array.prototype.slice.call(arguments);
      args.unshift('[SessionRecorder]');
      console.log.apply(console, args);
    }
  }

  function getSessionMetadata() {
    return {
      sessionId: sessionId,
      url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      startTime: startTime,
      endTime: Date.now(),
      duration: Date.now() - startTime,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      viewport: {
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
      },
      screenResolution: {
        width: typeof window !== 'undefined' && window.screen ? window.screen.width : 0,
        height: typeof window !== 'undefined' && window.screen ? window.screen.height : 0,
      },
      language: typeof navigator !== 'undefined' ? navigator.language : '',
      timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : '',
    };
  }

  // ============================================
  // Event Deduplication - Fixes duplicate component issue
  // ============================================
  
  /**
   * Deduplicates events to prevent duplicate DOM elements in replay.
   * This is crucial for frameworks like React/Next.js that may
   * trigger multiple renders during hydration.
   */
  function deduplicateFullSnapshot(event) {
    // Only process FullSnapshot events (type 2)
    if (event.type !== 2) {
      return event;
    }

    var node = event.data && event.data.node;
    if (!node) {
      return event;
    }

    // Track seen node IDs to detect duplicates
    var seenIds = new Set();
    
    function deduplicateNode(n) {
      if (!n) return n;
      
      // If we've seen this ID before, skip it
      if (n.id !== undefined) {
        if (seenIds.has(n.id)) {
          return null; // Duplicate found
        }
        seenIds.add(n.id);
      }
      
      // Recursively process child nodes
      if (n.childNodes && Array.isArray(n.childNodes)) {
        n.childNodes = n.childNodes
          .map(function(child) { return deduplicateNode(child); })
          .filter(function(child) { return child !== null; });
      }
      
      return n;
    }

    event.data.node = deduplicateNode(node);
    return event;
  }

  /**
   * Processes incremental mutations to prevent duplicate additions.
   * Fixes issues where framework re-renders add the same element multiple times.
   */
  function deduplicateMutations(event) {
    // Only process IncrementalSnapshot with mutations (type 3, source 0)
    if (event.type !== 3 || !event.data || event.data.source !== 0) {
      return event;
    }

    var adds = event.data.adds;
    if (!adds || !Array.isArray(adds)) {
      return event;
    }

    // Track which parent-node combinations we've seen
    var seenAdds = new Set();
    event.data.adds = adds.filter(function(add) {
      if (!add.node) return false;
      
      // Create a unique key for this addition
      var key = add.parentId + '_' + add.node.id;
      
      // Also check by content hash for elements without stable IDs
      if (add.node.attributes) {
        var attrHash = JSON.stringify(add.node.attributes);
        key += '_' + attrHash.substring(0, 50);
      }
      
      if (seenAdds.has(key)) {
        log('Filtered duplicate add:', key);
        return false;
      }
      
      seenAdds.add(key);
      return true;
    });

    return event;
  }

  // ============================================
  // Load rrweb from CDN
  // ============================================
  
  function loadRrweb(callback) {
    if (typeof window === 'undefined') {
      log('Not in browser environment, skipping rrweb load');
      return;
    }

    // Check if rrweb is already loaded
    if (window.rrweb) {
      rrwebLoaded = true;
      callback();
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/rrweb@2.0.0-alpha.4/dist/rrweb.min.js';
    script.onload = function() {
      rrwebLoaded = true;
      log('✅ rrweb loaded from CDN');
      callback();
    };
    script.onerror = function() {
      console.error('[SessionRecorder] Failed to load rrweb from CDN');
    };
    document.head.appendChild(script);
  }

  function loadFingerprint(callback) {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.FingerprintJS) {
      initFingerprint(callback);
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@fingerprintjs/fingerprintjs@3/dist/fp.min.js';
    script.onload = function() {
      initFingerprint(callback);
    };
    script.onerror = function() {
      console.error('[SessionRecorder] Failed to load FingerprintJS');
      // If fingerprint fails, we might still want to record but maybe to a default endpoint or fail gracefully?
      // For now, proceed with callback to allow recording, but endpoint won't be set if it relies on fingerprint.
      callback(); 
    };
    document.head.appendChild(script);
  }

  function initFingerprint(callback) {
    if (!window.FingerprintJS) {
      fingerprintLoaded = true; // Mark as loaded even if failed so we don't loop
      callback();
      return;
    }
    
    window.FingerprintJS.load().then(function(fp) {
      fp.get().then(function(result) {
        var visitorId = result.visitorId;
        log('🆔 Visitor ID:', visitorId);
        
        // Update endpoint with project ID and fingerprint
        CONFIG.serverEndpoint = 'https://api.sessionstory.co/session/record/' + CONFIG.id + '?fp=' + visitorId;
        
        fingerprintLoaded = true;
        callback();
      });
    }).catch(function(error) {
      console.error('[SessionRecorder] Failed to get fingerprint:', error);
      fingerprintLoaded = true; // Mark as loaded even if failed
      callback();
    });
  }

  // ============================================
  // Recording Functions
  // ============================================
  
  function startRecording(options) {
    options = options || {};
    
    if (typeof window === 'undefined') {
      log('Not in browser environment, cannot start recording');
      return;
    }

    // Check for required ID
    if (!CONFIG.id) {
      console.error('[SessionRecorder] ❌ Error: Project ID is required. Please add ?id=YOUR_ID to the script tag.');
      return;
    }

    if (!rrwebLoaded || !window.rrweb) {
      log('⏳ Waiting for rrweb to load...');
      loadRrweb(function() {
        startRecording(options);
      });
      return;
    }

    if (!fingerprintLoaded) {
      log('⏳ Waiting for fingerprint...');
      loadFingerprint(function() {
        startRecording(options);
      });
      return;
    }

    if (stopRecording) {
      log('Recording already in progress');
      return;
    }

    // Reset state
    events = [];
    eventsToSend = [];
    nodeIdMap.clear();
    startTime = Date.now();
    lastFullSnapshotTime = Date.now();
    sessionId = options.sessionId || generateSessionId();

    // Merge options with config
    var recordConfig = Object.assign({}, CONFIG, options);

    stopRecording = window.rrweb.record({
      emit: function(event, isCheckout) {
        // Handle checkout (full snapshot) events
        if (isCheckout) {
          lastFullSnapshotTime = Date.now();
          nodeIdMap.clear();
          log('📸 Full snapshot created');
        }

        // Deduplicate events to fix duplicate component issue
        event = deduplicateFullSnapshot(event);
        event = deduplicateMutations(event);

        if (event) {
          events.push(event);
          eventsToSend.push(event);
        }
      },
      
      // Recording options
      maskAllInputs: recordConfig.maskAllInputs,
      blockClass: recordConfig.blockClass,
      ignoreClass: recordConfig.ignoreClass,
      
      // Checkpoint configuration - prevents accumulating duplicate mutations
      checkoutEveryNth: recordConfig.checkoutEveryNth,
      checkoutEveryNms: recordConfig.checkoutEveryNms,
      
      // Sampling options
      sampling: {
        mousemove: recordConfig.mousemoveSampling,
        mouseInteraction: true,
        scroll: recordConfig.scrollThrottle,
        input: recordConfig.inputSampling,
      },
      
      // Slim DOM options - reduces redundant data in recordings
      slimDOMOptions: {
        script: true,           // Don't record script content
        comment: true,          // Don't record comments
        headFavicon: true,      // Don't record favicons
        headWhitespace: true,   // Trim head whitespace
        headMetaSocial: true,   // Skip social meta tags
        headMetaRobots: true,   // Skip robot meta tags
        headMetaHttpEquiv: true, // Skip http-equiv meta
        headMetaVerification: true, // Skip verification meta
        headMetaAuthorship: true,   // Skip authorship meta
      },
      
      // Inline images as data URLs to avoid loading issues
      inlineImages: false,
      
      // Don't record cross-origin iframes by default
      recordCrossOriginIframes: false,
    });

    // Start sending events periodically
    sendInterval = setInterval(flushEvents, 1000);

    log('🎥 Recording started (Session: ' + sessionId + ')');
  }

  var isSending = false;

  function flushEvents(isFinal) {
    if (eventsToSend.length === 0) {
      return;
    }

    if (!CONFIG.serverEndpoint) {
      return;
    }
    
    // Lock sending, unless we are forcing a final send (page unload)
    if (isSending && !isFinal) {
      return;
    }
    
    isSending = true;

    // Create payload with just the new events
    // We capture the batch locally so we can restore it if it fails
    // (Unless it's final, in which case we just try our best)
    var batch = eventsToSend.slice();
    eventsToSend = []; // Clear buffer temporarily

    var payload = {
      events: batch,
      metadata: Object.assign({}, getSessionMetadata(), {
        isChunk: true,
        chunkTimestamp: Date.now()
      })
    };

    // For final flush, prefer Beacon (reliable on unload). 
    // For regular flushes, use Fetch (allows handling retries).
    var useBeacon = !!isFinal;

    // Send to server using fetch (keepalive) instead of beacon for reliability
    // We pass useBeacon: false to ensure we get a promise that resolves/rejects based on HTTP status
    // We also disable keepalive for regular events to avoid the 64KB size limit, allowing large snapshots to send
    sendToServer(payload, { useBeacon: useBeacon, keepalive: useBeacon })
      .then(function() {
        if (!isFinal) {
          log('📤 Sent batch of ' + batch.length + ' events');
          isSending = false;
        }
      })
      .catch(function(error) {
        if (!isFinal) {
          console.error('[SessionRecorder] Failed to send batch, retrying...', error);
          // Restore events to the FRONT of the queue to maintain order
          eventsToSend = batch.concat(eventsToSend);
          isSending = false;
        } else {
           // On final send, we can't really do anything if it fails
           console.error('[SessionRecorder] Failed to send final batch', error);
        }
      });
  }

  function stopCurrentRecording(reason) {
    reason = reason || 'unknown';
    
    if (sendInterval) {
      clearInterval(sendInterval);
      sendInterval = null;
    }
    
    if (!stopRecording) {
      return null;
    }

    stopRecording();
    stopRecording = null;

    // Send any remaining events (force final flush)
    flushEvents(true);

    log('🛑 Recording stopped (Reason: ' + reason + ')');
    log('📊 Captured ' + events.length + ' events');

    // Only save if we have enough events
    if (events.length >= CONFIG.minEventsToSave) {
      // Save full session to localStorage
      if (CONFIG.useLocalStorage) {
          var sessionData = {
              events: events,
              metadata: Object.assign({}, getSessionMetadata(), {
                  triggerReason: reason,
                  eventCount: events.length,
              }),
          };
          saveToLocalStorage(sessionData);
      }
      return events.slice(); // Return copy of events
    } else {
      log('⚠️ Not enough events to save (minimum: ' + CONFIG.minEventsToSave + ')');
      return null;
    }
  }

  // ============================================
  // Save Session
  // ============================================
  
  function saveSession(triggerReason) {
    var sessionData = {
      events: events,
      metadata: Object.assign({}, getSessionMetadata(), {
        triggerReason: triggerReason,
        eventCount: events.length,
      }),
    };

    // Save to localStorage
    if (CONFIG.useLocalStorage) {
      saveToLocalStorage(sessionData);
    }

    // Send to server
    if (CONFIG.serverEndpoint) {
      sendToServer(sessionData);
    }
  }

  function saveToLocalStorage(sessionData) {
    if (typeof localStorage === 'undefined') {
      return;
    }
    
    try {
      var existingSessions = [];
      try {
        existingSessions = JSON.parse(localStorage.getItem(CONFIG.localStorageKey) || '[]');
      } catch (e) {
        existingSessions = [];
      }
      
      // Add new session (keep last 10 sessions to avoid storage limits)
      existingSessions.push(sessionData);
      if (existingSessions.length > 10) {
        existingSessions.shift();
      }
      
      localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(existingSessions));
      log('💾 Session saved to localStorage');
    } catch (error) {
      console.error('[SessionRecorder] Failed to save to localStorage:', error);
    }
  }

  function sendToServer(sessionData, options) {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }
    
    options = options || {};
    var useBeacon = options.useBeacon !== false; // Default true unless explicitly false
    var keepalive = options.keepalive === true;  // Default false (avoid size limits) in normal fetch

    var payload = JSON.stringify(sessionData);

    // Try sendBeacon first (more reliable during page unload)
    if (useBeacon && navigator.sendBeacon) {
      var blob = new Blob([payload], { type: 'application/json' });
      var success = navigator.sendBeacon(CONFIG.serverEndpoint, blob);
      
      if (success) {
        log('📤 Session sent via sendBeacon');
        return Promise.resolve();
      }
    }

    // Fallback to fetch with keepalive
    if (window.fetch) {
      return fetch(CONFIG.serverEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
        keepalive: keepalive,
      })
        .then(function(response) { 
            if (!response.ok) {
                throw new Error('Server returned ' + response.status + ' ' + response.statusText);
            }
            log('📤 Session sent via fetch'); 
        })
        .catch(function(error) { 
            console.error('[SessionRecorder] Failed to send:', error);
            throw error; 
        });
    } else {
      // Fallback for older browsers
      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', CONFIG.serverEndpoint, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject(new Error('XHR failed: ' + xhr.status));
                }
            }
        };
        xhr.send(payload);
      });
    }
  }

  // ============================================
  // Event Listeners for Page Exit Detection
  // ============================================
  
  function setupPageExitListeners() {
    if (typeof window === 'undefined') {
      return;
    }

    // Handle page unload (tab close, navigation away)
    window.addEventListener('beforeunload', function() {
      stopCurrentRecording('beforeunload');
    });

    // Handle page hide (more reliable on mobile)
    window.addEventListener('pagehide', function(event) {
      stopCurrentRecording(event.persisted ? 'pagehide_bfcache' : 'pagehide');
    });

    // Handle page freeze (browser tabs being frozen)
    if ('onfreeze' in document) {
      document.addEventListener('freeze', function() {
        stopCurrentRecording('freeze');
      });
    }
  }

  // ============================================
  // Public API
  // ============================================
  
  var SessionRecorder = {
    // Start recording
    start: function(options) {
      startRecording(options);
    },
    
    // Stop recording and return events
    stop: function() {
      return stopCurrentRecording('manual');
    },
    
    // Get current events without stopping
    getEvents: function() {
      return events.slice();
    },
    
    // Get current session ID
    getSessionId: function() {
      return sessionId;
    },
    
    // Get session metadata
    getMetadata: getSessionMetadata,
    
    // Get current config
    getConfig: function() {
      return Object.assign({}, CONFIG);
    },
    
    // Update config
    configure: function(newConfig) {
      Object.assign(CONFIG, newConfig);
      return CONFIG;
    },
    
    // Check if recording is active
    isRecording: function() {
      return stopRecording !== null;
    },
    
    // Get saved sessions from localStorage
    getSavedSessions: function() {
      if (typeof localStorage === 'undefined') {
        return [];
      }
      try {
        return JSON.parse(localStorage.getItem(CONFIG.localStorageKey) || '[]');
      } catch (e) {
        return [];
      }
    },
    
    // Clear saved sessions
    clearSavedSessions: function() {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(CONFIG.localStorageKey);
        log('🗑️ Cleared saved sessions');
      }
    },
    
    // Force a new full snapshot (useful after major DOM changes)
    takeSnapshot: function() {
      if (stopRecording && typeof window !== 'undefined' && window.rrweb && window.rrweb.record) {
        window.rrweb.record.takeFullSnapshot();
        log('📸 Manual snapshot taken');
      }
    },
    
    // Initialize (load rrweb) without starting recording
    init: function(callback) {
      if (isInitialized) {
        if (callback) callback();
        return;
      }
      
      loadRrweb(function() {
        isInitialized = true;
        setupPageExitListeners();
        if (callback) callback();
      });
    },
  };

  // ============================================
  // Auto-Initialize in Browser
  // ============================================
  
  if (typeof window !== 'undefined') {
    // Expose to window for backwards compatibility
    window.__sessionRecorder = SessionRecorder;
    
    // Setup page exit listeners
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupPageExitListeners);
      } else {
        setupPageExitListeners();
      }
    }
    
    // Auto-start if configured
    if (CONFIG.autoStart) {
      if (!CONFIG.id) {
        console.error('[SessionRecorder] ❌ Aborted: No project ID found. Usage: <script src=".../session-recorder.js?id=YOUR_ID"></script>');
      } else {
        log('⏳ Loading rrweb and fingerprint...');
        
        loadRrweb(function() {
          loadFingerprint(function() {
            startRecording();
            isInitialized = true;
            log('\n🎬 Session Recorder Ready!\n\nDebug: window.__sessionRecorder\n');
          });
        });
      }
    }
  }

  return SessionRecorder;
}));
