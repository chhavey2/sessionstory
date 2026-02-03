import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.sessionreplay.space';
// Translation API can be different (for local testing with lingo.dev)
const TRANSLATE_API_URL = import.meta.env.VITE_TRANSLATE_API_URL || API_BASE_URL;

// DOM Elements
const replayContainer = document.getElementById('replayContainer');
const sessionStatus = document.getElementById('sessionStatus');
const summaryLoading = document.getElementById('summaryLoading');
const summaryText = document.getElementById('summaryText');
const summaryError = document.getElementById('summaryError');
const languageSelect = document.getElementById('languageSelect');
const retrySummary = document.getElementById('retrySummary');

// State
let currentPlayer = null;
let currentEvents = null;
let originalWidth = 1024;
let originalHeight = 576;
let currentSessionId = null;
let originalSummary = null; // Store original English summary
let currentLanguage = 'en';

// Responsive dimensions calculation
function getResponsiveDimensions(origW, origH) {
  const summaryPanelWidth = 380;
  const horizontalPadding = summaryPanelWidth + 80;
  const verticalOverhead = 160;

  const maxWidth = Math.max(300, window.innerWidth - horizontalPadding);
  const maxHeight = Math.max(300, window.innerHeight - verticalOverhead);

  const ratio = origW / origH;

  let height = maxHeight;
  let width = height * ratio;

  if (width > maxWidth) {
    width = maxWidth;
    height = width / ratio;
  }

  return { 
    width: Math.floor(width), 
    height: Math.floor(height) 
  };
}

// Create the rrweb player
function createPlayer(events) {
  replayContainer.innerHTML = '';
  
  const metaEvent = events.find(e => e.type === 4);
  if (metaEvent && metaEvent.data) {
    originalWidth = metaEvent.data.width || 1024;
    originalHeight = metaEvent.data.height || 576;
  }

  const { width, height } = getResponsiveDimensions(originalWidth, originalHeight);

  currentPlayer = new rrwebPlayer({
    target: replayContainer,
    props: {
      events: events,
      width: width,
      height: height,
      autoPlay: true,
      showController: true,
      speedOption: [1, 2, 4, 8],
    },
  });
}

// Fetch AI summary for the session
async function fetchSummary(sessionId) {
  showSummaryLoading();
  
  try {
    const response = await fetch(`${API_BASE_URL}/ai/summary/${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch summary');
    }
    
    const data = await response.json();
    originalSummary = data.reply;
    
    // Display in current language
    if (currentLanguage === 'en') {
      displaySummary(originalSummary);
    } else {
      await translateSummary(currentLanguage);
    }
    
  } catch (error) {
    console.error('Error fetching summary:', error);
    showSummaryError();
  }
}

// Translate summary using backend API (powered by Lingo.dev)
async function translateSummary(targetLocale) {
  if (!originalSummary) return;
  
  if (targetLocale === 'en') {
    displaySummary(originalSummary);
    return;
  }
  
  showSummaryLoading();
  
  try {
    const response = await fetch(`${TRANSLATE_API_URL}/ai/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: originalSummary,
        sourceLocale: 'en',
        targetLocale: targetLocale,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Translation request failed');
    }
    
    const data = await response.json();
    displaySummary(data.translated);
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to original summary if translation fails
    displaySummary(originalSummary);
    showTranslationError();
  }
}

// Display summary text with formatting
function displaySummary(text) {
  summaryLoading.style.display = 'none';
  summaryError.style.display = 'none';
  summaryText.style.display = 'block';
  
  // Format the text with paragraphs and bullet points
  const formatted = formatSummaryText(text);
  summaryText.innerHTML = formatted;
}

// Format summary text for better readability
function formatSummaryText(text) {
  if (!text) return '';
  
  // Split into paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  
  return paragraphs.map(para => {
    // Check if it's a list item
    if (para.trim().startsWith('- ') || para.trim().startsWith('• ')) {
      const items = para.split('\n').map(item => {
        const cleanItem = item.replace(/^[-•]\s*/, '').trim();
        return cleanItem ? `<li>${cleanItem}</li>` : '';
      }).join('');
      return `<ul>${items}</ul>`;
    }
    
    // Check if it's a numbered list
    if (/^\d+[\.\)]\s/.test(para.trim())) {
      const items = para.split('\n').map(item => {
        const cleanItem = item.replace(/^\d+[\.\)]\s*/, '').trim();
        return cleanItem ? `<li>${cleanItem}</li>` : '';
      }).join('');
      return `<ol>${items}</ol>`;
    }
    
    // Check for headers (lines ending with :)
    if (para.trim().endsWith(':') && para.trim().length < 50) {
      return `<h4>${para.trim()}</h4>`;
    }
    
    // Regular paragraph
    return `<p>${para.trim()}</p>`;
  }).join('');
}

// Show loading state
function showSummaryLoading() {
  summaryLoading.style.display = 'flex';
  summaryText.style.display = 'none';
  summaryError.style.display = 'none';
}

// Show error state
function showSummaryError() {
  summaryLoading.style.display = 'none';
  summaryText.style.display = 'none';
  summaryError.style.display = 'flex';
}

// Show translation error (subtle notification)
function showTranslationError() {
  const notice = document.createElement('div');
  notice.className = 'translation-notice';
  notice.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    <span>Translation unavailable, showing original</span>
  `;
  summaryText.prepend(notice);
  
  setTimeout(() => notice.remove(), 5000);
}

// Initialize player and fetch summary
async function initPlayer() {
  currentSessionId = window.location.pathname.substring(1);

  if (!currentSessionId) {
    loadFromLocalStorage();
    return;
  }

  try {
    sessionStatus.innerText = `Loading session...`;
    const response = await fetch(`${API_BASE_URL}/session/${currentSessionId}`);
    
    if (!response.ok) {
      throw new Error(`Session not found or server error`);
    }

    const data = await response.json();
    
    if (!data.events || data.events.length === 0) {
      throw new Error('No events found in session data');
    }

    currentEvents = data.events;
    sessionStatus.innerText = `${currentEvents.length} events`;
    
    createPlayer(currentEvents);
    
    // Fetch AI summary
    fetchSummary(currentSessionId);

  } catch (error) {
    console.error('Error initializing player:', error);
    sessionStatus.innerText = 'Error loading session';
    replayContainer.innerHTML = `<p class="error-message">Error: ${error.message}</p>`;
  }
}

function loadFromLocalStorage() {
  const savedSession = localStorage.getItem('rrweb-session');

  if (savedSession) {
    try {
      currentEvents = JSON.parse(savedSession);
      if (currentEvents.length > 0) {
        sessionStatus.innerText = 'Loaded from Local Storage';
        createPlayer(currentEvents);
      } else {
        throw new Error('Empty session in local storage');
      }
    } catch (e) {
      sessionStatus.innerText = 'No session found';
      replayContainer.innerHTML = '<p class="error-message">No session ID provided in URL and no local session found.</p>';
    }
  } else {
    sessionStatus.innerText = 'No session found';
    replayContainer.innerHTML = '<p class="error-message">No session ID provided in URL and no local session found.</p>';
  }
}

// Event Listeners

// Language change handler
languageSelect.addEventListener('change', async (e) => {
  currentLanguage = e.target.value;
  if (originalSummary) {
    await translateSummary(currentLanguage);
  }
});

// Retry button handler
retrySummary.addEventListener('click', () => {
  if (currentSessionId) {
    fetchSummary(currentSessionId);
  }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  if (!currentEvents) return;
  
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const currentTime = currentPlayer ? currentPlayer.getViewer().getCurrentTime() : 0;
    const isPaused = currentPlayer ? currentPlayer.getViewer().isPaused : false;
    
    createPlayer(currentEvents);
    
    if (currentTime > 0) {
      currentPlayer.getViewer().play(currentTime);
      if (isPaused) currentPlayer.getViewer().pause();
    }
  }, 200);
});

// Initialize
initPlayer();
