# Prototype Documentation

## How to Run
1.  **Install Dependencies**:
    ```bash
    pnpm install
    ```
2.  **Start Development Server**:
    ```bash
    pnpm dev
    ```
3.  **Access the Application**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Interaction Guide

### 1. User Login & Persistence
- Navigate to `/login` to create an account or log in.
- **Feature**: User data (profile and health events) is persisted locally in the browser's `localStorage`, keyed by your email. This allows you to simulate different users with distinct data on the same machine.

### 2. Dashboard & AI Orchestration
- Navigate to `/dashboard`.
- **Profile**: Fill in the patient data form.
- **Generate Plan**: Click "Genera piano con AI" to trigger the Multi-Agent system.
- **Results**: View the AI-generated profile summary, risk highlights, and recommended visits.

### 3. Simulating Health Events (Console Interface)
- Open the browser's Developer Tools (F12 or Right-click > Inspect > Console).
- Use the global `window.enteSalute` object to simulate external health events (e.g., data coming from a hospital or wearable).
- **Command**:
    ```javascript
    window.enteSalute.segnala("attacco di cuore")
    ```
- **Effect**: This triggers a real-time update. The "Health Entity" agent processes the event, and the "Planner" agent adjusts the visit recommendations (e.g., adding an urgent cardiology visit).

## Technologies & Libraries

### Open Source Libraries
- **Next.js 14**: React framework for the application structure and routing.
- **React**: UI library.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Framer Motion**: For smooth, scroll-driven animations on the landing page.
- **clsx / tailwind-merge**: Utilities for conditional and conflict-free class name composition.
- **OpenAI Node.js SDK**: For interacting with the LLM models.

### Models
- **GPT-4o-mini**: Used for all AI agents (Profiler, HealthEntity, Planner) to ensure fast and cost-effective responses while maintaining high quality.

## Custom Code Logic

### Multi-Agent Architecture ([app/api/multilayer/route.ts](file:///Users/lorenzo/Projects/reply-challenge/healt-site/app/api/multilayer/route.ts))
Instead of a single prompt, the backend implements a **Multi-Agent System**:
1.  **Master Agent**: Orchestrates the flow.
2.  **Profiler Agent**: Analyzes raw form data to create a clinical snapshot.
3.  **Health Entity Agent**: Simulates an external system. It receives "events" (from the console) and generates context/data pulls.
4.  **Planner Agent**: Synthesizes the Profile and Health Entity data to generate the final list of recommended visits and a proactive message.

### Local Data Persistence ([app/dashboard/page.tsx](file:///Users/lorenzo/Projects/reply-challenge/healt-site/app/dashboard/page.tsx))
- A custom `useEffect` hook manages data persistence.
- It watches for changes in the form, AI results, and health events.
- Data is serialized and saved to `localStorage` using a key derived from the logged-in user's email (`userData_{email}`).
- On load, it hydrates the state from this local storage, enabling a persistent session experience without a real database.
