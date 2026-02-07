
# SessionStory <img src="https://static.sessionstory.co/logo.svg" width="30" style="border-radius: 10px; vertical-align: middle;" alt="SessionStory Logo" /> 

**Understand what users experienced — not just what the numbers say.**

SessionStory records real user sessions so product and engineering teams can see how interactions actually happen. Instead of guessing why something failed, sessions provide the missing context behind user behavior.


## Quick Links

- **Landing Page**: https://sessionstory.co  
- **Dashboard**: https://dashboard.sessionstory.co  

### Demo Account
- Email: `demo@gmail.com`
- Password: `Demo#2026`

### Watch Demo Video

[![SessionStory Demo](https://static.sessionstory.co/thumbnail.png)](https://www.loom.com/share/bb6cf06ce9864102ad5d3edbf7c0bb8b)


## Problem

Modern products generate a lot of data.  
Understanding users is still surprisingly hard.

Analytics dashboards explain *what* happened — page views, clicks, and drop-offs — but rarely explain *why* it happened. When users struggle, abandon flows, or encounter issues, teams are left interpreting numbers without context.

### Where things break down

**Numbers without experience**  
Metrics show outcomes, not behavior. Friction, hesitation, and confusion are invisible in charts.

**Hard-to-reproduce bugs**  
User reports often lack the steps that led to an issue. Developers spend time guessing instead of seeing what actually happened.

**Too much data, not enough clarity**  
Raw recordings or event logs don’t scale. Important signals get buried in noise.

**Visibility vs privacy**  
Teams need insight into behavior while still protecting sensitive information and respecting user privacy.


## Approach

SessionStory focuses on a simple idea:

> Seeing the experience makes problems easier to understand.

Instead of adding more analytics layers, sessions provide direct context — how users moved, where they hesitated, and what happened before something went wrong.

AI summaries reduce the effort required to review sessions manually, turning recordings into quick, understandable explanations.


## System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Landing    │  │  Dashboard   │  │    Player    │           │
│  │    Page      │  │ Application  │  │   Engine     │           │
│  │              │  │              │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│         │                  │                  │                 │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │                 │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
┌─────────▼────────┐ ┌──────▼──────┐ ┌────────▼────────┐
│  Authentication  │ │   Session   │ │   AI Service    │
│    Service       │ │   Service   │ │                 │
│                  │ │             │ │                 │
└─────────┬────────┘ └──────┬──────┘ └────────┬────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │    Database     │
                    │                 │
                    │                 │
                    │  ┌───────────┐  │
                    │  │   Users   │  │
                    │  ├───────────┤  │
                    │  │ Sessions  │  │
                    │  ├───────────┤  │
                    │  │ Visitors  │  │
                    │  └───────────┘  │
                    └─────────────────┘
```

## Key Capabilities

### Session Replay
- Records real user interactions including clicks, scrolls, and navigation
- Replays sessions visually with accurate timing
- Helps reproduce issues without guesswork

### AI Summaries
- Generates concise explanations of what happened in a session
- Highlights friction points and unusual behavior
- Reduces manual session review time

### Dashboard
- Browse and filter sessions
- Identify problematic flows quickly
- Move from metrics to real interaction context

### Privacy First
- Sensitive data masking
- Configurable recording rules
- Designed with privacy and compliance in mind

## Project Structure

```
sessionstory/
├── backend/
├── dashboard/
├── landing/
├── player/
├── static/
└── README.md
```

## Getting Started

### Installation

```bash
git clone <repository-url>
cd sessionstory
```

Install dependencies and run services:

```bash
cd backend && npm install && npm run dev
cd dashboard && npm install && npm run dev
cd landing && npm install && npm run dev
cd player && npm install && npm run dev
```

## How It Works

### - Integration

Add a small script to your website:

```bash
<script src="https://static.sessionstory.co/?id=<API_KEY>"></script>
```
---

### - Recording

Interactions are captured through a lightweight script and sent securely to the backend, where sessions are stored efficiently for replay and analysis.

---

### - Understanding Sessions

Sessions can be replayed visually to show how interactions actually happened.  
AI summaries provide quick context, helping explain what occurred without needing to watch every recording in full.

---

### - Debugging with Context

Instead of trying to reproduce issues manually, teams can see exactly what the user experienced — making it easier to understand problems and fix them faster.

## License

Proprietary software. All rights reserved.

---



**SessionStory**  
Understanding behavior, not just metrics.