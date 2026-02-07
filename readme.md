# SessionStory 🎬

**Understand user behavior through intelligent session replay and AI-powered insights**

[![Landing Page](https://img.shields.io/badge/Landing-sessionstory.co-blue)](https://sessionstory.co/)
[![Dashboard](https://img.shields.io/badge/Dashboard-dashboard.sessionstory.co-green)](https://dashboard.sessionstory.co/)

---

## 🔗 Quick Links

- **Landing Page**: [https://sessionstory.co/](https://sessionstory.co/)
- **Dashboard**: [https://dashboard.sessionstory.co/](https://dashboard.sessionstory.co/)
  - **Demo Account**:
    - Email: `demo@gmail.com`
    - Password: `Demo#2026`
- **Demo Video**: [Watch Demo](https://www.loom.com/share/bb6cf06ce9864102ad5d3edbf7c0bb8b) 🎥

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)
- [Contributing](#-contributing)

---

## 🎯 Problem Statement

Modern web applications face critical challenges in understanding user behavior and debugging issues:

### Core Problems

1. **Blind Spots in User Experience**
   - Traditional analytics only show _what_ users did, not _how_ they did it
   - Difficult to understand user frustration points and friction in the user journey
   - No visibility into actual user interactions, clicks, scrolls, and navigation patterns

2. **Inefficient Bug Reproduction**
   - Users report bugs that developers cannot reproduce
   - "It works on my machine" syndrome wastes countless hours
   - Missing context around user environment, actions leading to errors

3. **Data Overload Without Insights**
   - Raw session data is overwhelming and time-consuming to analyze
   - Teams lack actionable insights from user behavior data
   - Manual analysis doesn't scale with growing user base

4. **Privacy & Compliance Concerns**
   - Need to balance detailed tracking with user privacy
   - GDPR and privacy regulations require careful data handling
   - Sensitive information must be protected in recordings

---

## 💡 Our Solution

**SessionStory** is an intelligent session replay platform that combines powerful recording capabilities with AI-driven insights to help teams understand and improve user experience.

### How We Solve It

#### 1. **Visual Session Replay**

- **What**: Record and replay complete user sessions with pixel-perfect accuracy
- **How**: Using advanced DOM serialization technology to capture interactions and viewport changes
- **Benefit**: See exactly what users see and do, making bug reproduction trivial

#### 2. **AI-Powered Insights**

- **What**: Automatically analyze sessions to extract meaningful patterns and insights
- **How**: Integration with generative AI to process session data and generate actionable recommendations
- **Benefit**: Transform raw data into strategic insights without manual analysis

#### 3. **Smart Data Compression**

- **What**: Efficiently store and retrieve session data at scale
- **How**: Custom compression service that reduces storage requirements by up to 90%
- **Benefit**: Cost-effective solution that scales with your user base

#### 4. **Privacy-First Architecture**

- **What**: Protect sensitive user information while maintaining useful recordings
- **How**: Built-in data masking, configurable privacy rules, and secure storage
- **Benefit**: Compliance-ready solution that respects user privacy

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Landing    │  │  Dashboard   │  │    Player    │          │
│  │    Page      │  │ Application  │  │   Engine     │          │
│  │              │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                  │
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

### Data Flow

#### Session Recording Flow

```
User Interaction → Recorder Engine → Compression Service → API → Database
                                                                    │
                                                                    ▼
                                                          Stored Session Data
```

#### Session Replay Flow

```
Dashboard Request → API → Database → Decompression → Player → Visual Replay
```

#### AI Analysis Flow

```
Session Data → AI Service → LLM Provider → Insights Generation → Dashboard
```

---

## ✨ Key Features

### 🎥 Session Recording

- **Automatic Capture**: Records user interactions, clicks, scrolls, and form inputs
- **DOM Snapshots**: Captures complete page state and mutations
- **Network Activity**: Tracks API calls and resource loading
- **Console Logs**: Records browser console output for debugging

### 📊 Analytics Dashboard

- **Session List**: Browse and filter recorded sessions
- **User Insights**: Understand user behavior patterns
- **Performance Metrics**: Track page load times and interaction delays
- **Error Tracking**: Identify and debug issues quickly

### 🤖 AI-Powered Analysis

- **Automated Insights**: AI analyzes sessions to identify patterns
- **Anomaly Detection**: Flags unusual user behavior or errors
- **Recommendations**: Suggests UX improvements based on data
- **Natural Language Queries**: Ask questions about user behavior

### 🔒 Security & Privacy

- **Secure Auth**: Robust user authentication system
- **Data Encryption**: Encrypted data storage and transmission
- **Privacy Controls**: Configurable data masking and retention
- **IP Tracking**: Visitor identification with privacy compliance

---

## Project Structure

```
sessionstory/
├── backend/                 # API server implementation
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── index.js            # Server entry point
│   └── package.json
│
├── dashboard/              # Dashboard application
│   ├── src/
│   │   ├── components/    # Components
│   │   ├── pages/         # Pages
│   │   └── utils/         # Utilities
│   ├── index.html
│   └── package.json
│
├── landing/                # Public landing page
│   ├── app/               # App directory
│   ├── components/        # Components
│   ├── public/            # Static assets
│   └── package.json
│
├── player/                 # Session replay player
│   ├── src/               # Player logic
│   ├── index.html         # Player interface
│   └── package.json
│
├── static/                 # Shared static assets
└── readme.md              # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js environment
- Database instance
- Cloud AI credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sessionstory
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

3. **Setup Dashboard**

   ```bash
   cd dashboard
   npm install
   cp .env.example .env
   npm run dev
   ```

4. **Setup Landing Page**

   ```bash
   cd landing
   npm install
   npm run dev
   ```

5. **Setup Player**
   ```bash
   cd player
   npm install
   npm run dev
   ```

---

## 🔄 How It Works

### 1. Integration

Add the SessionStory SDK to your website:

```javascript
<script src="https://static.sessionstory.co/?id=<API_KEY>"></script>
```

### 2. Recording

- SDK automatically records user interactions
- Data is compressed and sent to backend
- Sessions are stored with metadata (user agent, IP, timestamp)

### 3. Analysis

- View sessions in the dashboard
- Use AI to analyze patterns and generate insights
- Filter and search sessions by various criteria

### 4. Replay

- Click on any session to watch the replay
- See exact user interactions in real-time
- Debug issues with full context

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Contact & Support

- **Website**: [https://sessionstory.co/](https://sessionstory.co/)
- **Dashboard**: [https://dashboard.sessionstory.co/](https://dashboard.sessionstory.co/)
- **Demo**: _Coming Soon_

---

**Built with ❤️ by the SessionStory Team**
