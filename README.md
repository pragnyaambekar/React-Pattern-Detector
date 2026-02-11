React Pattern Detector
Overview

React Pattern Detector is a tool designed to automatically identify common architectural anti-patterns in React applications. This project aims to assist developers and researchers in maintaining high-quality, scalable React codebases by detecting code smells and patterns that could affect maintainability, readability, and performance.

Motivation

Modern React applications often scale rapidly, accumulating technical debt in the form of anti-patterns such as:

God Components – overly complex components handling too much responsibility.

Prop Drilling – excessive passing of props through multiple layers.

Inline Functions – functions defined inside JSX leading to re-renders.

Duplicate State – multiple sources of truth in state management.

Deep JSX Nesting – excessive nested JSX structures.

useEffect Dependency Issues – improper dependency management in useEffect.

Detecting these patterns manually is time-consuming and error-prone. This tool automates detection using static analysis, providing actionable insights.

Project Structure
react-pattern-detector/
│
├── backend/
│   ├── detectors/
│   │   ├── god.js
│   │   ├── propdrilling.js
│   │   ├── inlinefunction.js
│   │   ├── duplicatestate.js
│   │   ├── deepnesting.js
│   │   └── useeffect.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   └── package.json
│
└── README.md


backend/ – Node.js/Express server running detectors on cloned repositories.

frontend/ – React app providing a web UI to select repositories, patterns, and display results.

Repositories Analyzed

We tested the tool on the following repositories:

Grafana – popular open-source observability platform.

Mattermost Webapp – messaging platform frontend.

TodoMVC – reference implementation for React.

Refine – admin panel framework.

Each repository was scanned for all six patterns before and after fine-tuning detection rules.

Development Phases
Phase 1: Initial Detection Scripts

Built standalone Node.js scripts (detectors/*.js) to detect patterns.

Used static analysis with TypeScript compiler API.

Tested on selected repositories.

Output: JSON arrays of detected patterns with file names, LOC, JSX count, hooks, etc.

Phase 2: Basic Frontend

Created React frontend to:

Select repository and pattern.

Display JSON results in a table.

Enabled “Run” button to invoke backend API.

Phase 3: Fine-Tuning Detectors

Added severity computation (Extreme, Severe, Moderate, None) for detected patterns.

Optimized detection criteria:

God Component: LOC, JSX, Hooks thresholds.

Prop Drilling: nested props beyond threshold.

Inline Functions: functions declared in JSX.

Added default “N/A” message when no patterns found.

Phase 4: Full Frontend Integration

Updated UI to display severity column with color codes:

Extreme → Red

Severe → Orange

Moderate → Yellow

None → Green

Results table shows:

File

Pattern

Details

Severity

Fetches results from backend API dynamically.

Phase 5: Optional Enhancements (Future Work)

Summary cards: total results, counts per severity, average LOC.

Charts with Recharts/Chart.js for visualization.

CSV/JSON export.

Accept GitHub URL directly for analysis.

Add filters by pattern or file name.

Usage
Backend
cd backend
npm install
node server.js


The backend listens on http://localhost:5050/analyze.

Frontend
cd frontend
npm install
npm run dev


Open in browser: http://localhost:5173

Select a repository.

Select a pattern.

Click Run to analyze and view results.

Example Output
File	Pattern	Details	Severity
App.tsx	God Component	LOC=230, JSX=15, Hooks=7	Severe
Dashboard.tsx	God Component	LOC=310, JSX=22, Hooks=12	Extreme
MultiCombobox.tsx	God Component	LOC=120, JSX=9, Hooks=3	Moderate

If no issues are found:
No pattern were found in the analyzed repository.

Technology Stack

Backend: Node.js, Express, TypeScript, fs, path.

Frontend: React, TypeScript, Tailwind CSS.

Analysis: TypeScript compiler API for AST parsing.

Deployment: Local development with Vite (frontend) + Express (backend).

References

React Documentation – https://reactjs.org/docs/getting-started.html

TypeScript Compiler API – https://typescriptlang.org/docs/handbook/compiler-api.html

Grafana GitHub Repo – https://github.com/grafana/grafana