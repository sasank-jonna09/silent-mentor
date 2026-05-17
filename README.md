# 👁️‍🗨️ Silent Mentor: Developer Telemetry

**A privacy-first, local-architecture VS Code extension that tracks your flow state, context switches, and friction points, then generates a cinematic analytics dashboard using AI.**

Unlike cloud-based trackers that constantly monitor your keystrokes over the network, Silent Mentor operates entirely locally. It acts as a silent observer while you code and only reaches out to the AI when you explicitly request a session review.

---

## 🧠 How It Works (The Architecture)

Silent Mentor is built on a highly secure, event-driven local architecture:

1. **The Sensors (Listeners):** Background workers silently monitor three core metrics locally:
   * **Typing Activity:** Tracks your Active Coding Minutes and calculates your longest deep-work "Flow Streak."
   * **File Navigation:** Tracks "Context Switches" to measure how often you break focus.
   * **Diagnostics:** Hooks into the VS Code compiler to track syntax and runtime errors, identifying your highest "Friction" files.
2. **The Master Clipboard:** All data is held entirely in your computer's local, temporary memory (RAM). Nothing is saved to a database.
3. **The AI Engine:** When you end a session, the clipboard data is formatted and sent securely to Google's Gemini API (v2.5) to act as a Senior Software Engineer, generating a customized, 3-sentence behavioral review.
4. **The Shredder:** Once the dashboard is closed, all local telemetry is permanently shredded and wiped from memory.

---

## 🚀 How to Use It (Getting Your Summary)

### Step 1: Add Your AI Engine
To keep this tool 100% free and private, you bring your own API key.
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/).
2. In VS Code, go to **Settings** (`Ctrl + ,` or `Cmd + ,`).
3. Search for `Silent Mentor`.
4. Paste your API key into the `ApiKey` field.

### Step 2: Enter Flow State
Simply start coding. Silent Mentor will automatically detect what language you are typing, how long you stay focused, and where you encounter bugs. 

### Step 3: Analyze Session
When you are ready for a break or finishing for the day, look at the bottom right corner of your VS Code taskbar. 
* Click the glowing Emerald **`$(pulse) Analyze Session`** button.

### Step 4: Review & Shred
A beautiful, cinematic dashboard will open inside your editor featuring:
* A personalized behavioral critique from your AI Mentor.
* Your overall **Focus Score** (out of 100).
* A Sci-Fi Radar Chart of your language output.
* A Gradient Friction Graph showing which files gave you the most trouble.

When you are done reviewing, click **"End & Shred Session"** to wipe the slate clean for your next sprint.

---

## 📥 Installation

You do not need to clone this repository to use the extension. 

1. Go to the [Releases page](../../releases) on this repository.
2. Download the latest `.vsix` file (e.g., `silent-mentor-0.1.0.vsix`) from the Assets section.
3. Open VS Code.
4. Go to the **Extensions** tab on the left sidebar.
5. Click the **`...`** menu at the top right of the Extensions panel.
6. Select **"Install from VSIX..."** and choose the file you just downloaded.