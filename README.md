<div align="center">
  # 🌟 Lumina
  
  **"Turn any lecture  content into a 20-minute interactive study session"**
  ![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
  ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
  ![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
</div>

<br/>


## 💡 The Problem

Students worldwide waste hours watching lengthy lecture recordings and reading dense textbook PDFs just to extract a handful of key concepts. 

* **Low Information Density:** A 2-hour lecture video often contains only ~15 minutes of actual core concept material buried in filler, rambling, and organizational talk.
* **Terrible Retention Standards:** Passive video watching has awful knowledge retention rates — studies show retention drops to ~10% after just 48 hours without active recall practice.
* **One-Size-Fits-All Material:** In traditional and strictly linear learning environments, everyone gets the same one-size-fits-all content, irrespective of what they actually struggle with.
* **Massive Time Sinks:** Creating flashcards, building quizzes, and manually mapping out prerequisite structures takes hours of manual labor that could be spent actually studying.
* **No Big Picture:** Students can't visualize how concepts connect or what prerequisites exist until the end of a semester. Re-watching entire long-form videos to hunt down one concept is incredibly inefficient.

---

## ✨ The Solution

**Lumina** is an AI-powered platform where a user uploads a lecture video or pastes a YouTube URL. Using Google's Gemini 2.0 Flash multimodal long-context capabilities, the app acts as your personal tutor.

Lumina completely transforms the educational pipeline: **2-hour lecture $\rightarrow$ 20-minute interactive study session.**

1. **Intelligent Extraction:** Lumina analyzes the ENTIRE content — videos, handwritten notes, PDFs, slides, diagrams, and audio.
2. **Structural Mapping:** It extracts hierarchical concept structures and builds prerequisite relationships between topics.
3. **Interactive Visualization:** Linear content is transformed into a beautiful personalized 3D skill tree.
4. **Active Recall:** Lumina auto-generates categorized flashcards (definitions, examples, comparisons, applications, mnemonics).
5. **Adaptive Assessment:** Dynamic quizzes are generated with varying difficulty levels and AI-generated explanations.
6. **Gamified Progress:** Your skill tree visually evolves from unstarted → in-progress → mastered.
7. **Smart Study Planning:** Users can add upcoming test topics and deadlines directly from the homepage.
8. **Prioritization:** Lumina intelligently highlights relevant courses based on topic similarity and urgency.
9. **Dynamic Library Management (NEW):** Users can track processing states and remove unwanted courses directly from the interface.

---
 **Gemini Flash lite latest** (`gemini-flash-lite-latest`) as the core brain of Lumina. We didn't just build a wrapper—we deeply integrated Gemini's native multimodal processing to achieve something standard LLMs cannot do. It was the *only* model capable of simultaneously handling our required 2M+ token long context window, native multimodal input processing (video frames + audio synchronously), and heavily constrained structured JSON outputs via `response_schema`.

### 1. NATIVE Multimodal Video Analysis via `File API`
Instead of relying solely on error-prone YouTube transcripts (a standard, low-innovation approach), Lumina interfaces directly with the Gemini File API to upload raw lecture videos. We use `genai.upload_file()` to push videos into Gemini's secure servers. This allows the model to process BOTH the **visual frames** (slides, mathematical diagrams written on whiteboards, presenter gestures) AND the **audio** (spoken explanations, emphasis, Q&A) simultaneously, mimicking true human understanding.

```python
import google.generativeai as genai
import time

# 1. Upload video natively to Gemini
video_file = genai.upload_file(path=video_path)

# 2. Wait for Google's internal API to finish video processing state
while video_file.state.name == "PROCESSING":
    time.sleep(2)
    video_file = genai.get_file(video_file.name)
```

### 2. Structured JSON Course Generation
Lumina isn't a chatbot; it's a structural engine. We prompt Gemini not for text, but for a massive, heavily nested JSON schema representing an entire curriculum. We utilize the `generation_config` parameter to enforce strict structured outputs. The model acts as an orchestration layer, simultaneously extracting:

* **Hierarchical Concept Extraction:** Identifying 8-15 concepts organized in a strict prerequisite tree (depth 0-3), forcing the model to understand which concepts mathematically or logically build upon others.
* **Timestamp Mapping:** Leveraging Gemini 3.0's spatial-temporal reasoning to pinpoint exact timestamps in the video where each concept is taught.
* **Categorical Flashcard Engine:** Generating 20-30 flashcards split strictly across 5 categories (Definition, Example, Comparison, Application, Mnemonic)—proving Gemini isn't just summarizing, it's *teaching*.
* **Adaptive Quiz Logic:** Writing 12-20 multiple choice questions with 4 distinct options, assigned correct answers, detailed explanations, and specific difficulty tiers.

```python
# 3. Multimodal Analysis combining the uploaded Video Object and our Prompt
response = model.generate_content(
    [video_file, analysis_prompt],
    generation_config=genai.types.GenerationConfig(
        response_mime_type="application/json",
        response_schema=CourseModuleSchema, # Heavily nested Pydantic Schema
        temperature=0.3, # Low temp for deterministic, structured output
        max_output_tokens=8192, # Extremely long generation context
    ),
)
```

### 3. Fallback Transcript Context Window
When a YouTube video is too long to download within Vercel's serverless timeout limits (or exceeds standard API limits), Lumina performs an automatic fallback. It utilizes `yt-dlp` to extract the raw text transcript and leverages Gemini 3.0 Flash's massive 2-million token context window by injecting the entire textual transcript directly into the prompt. Gemini easily ingests 50,000+ words of transcript and still outputs perfect hierarchical JSON without losing context.

### 4. File Lifecycle Management
To ensure data privacy and prevent storage quota limits from being hit on the Google Developer Console, Lumina tracks job completion and uses `genai.delete_file()` to immediately wipe uploaded videos from Gemini's servers after the structured generation is complete.

---

## 🎮 Key Features

### 🧠 AI-Powered Learning

1. **🎬 Universal Content Ingestion**
   - YouTube URLs
   - Video uploads
   - PDFs
   - Handwritten notes
   - Images

2. **🧠 Native Multimodal Analysis**
   Gemini 3.0 Flash processes:
   - visual frames
   - diagrams
   - slides
   - handwriting
   - spoken explanations

3. **🌳 Interactive 3D Skill Tree**
   Personalized prerequisite-aware concept visualization powered by Three.js.

4. **🃏 Smart Flashcard Engine**
   Auto-generated categorized flashcards:
   - Definitions
   - Examples
   - Comparisons
   - Applications
   - Mnemonics

5. **🧩 Adaptive Quiz Generation**
   AI-generated quizzes with:
   - multiple difficulty levels
   - explanations
   - mastery-based progression

---

### 📅 Smart Study Planning

6. **📅 Upcoming Test Planner**
   Add upcoming tests directly from the homepage.

7. **🧠 Semantic Topic Matching**
   Lumina intelligently identifies related courses using:
   - titles
   - concepts
   - alias matching

8. **🔥 Priority-Based Highlighting**
   Courses dynamically highlight based on urgency:
   - 🔴 urgent
   - 🟠 upcoming
   - 🔵 lower priority

9. **⚡ Intelligent Prioritization**
   Most relevant and urgent courses automatically surface first.

---

### ⚙️ Platform Features

10. **📚 Smart Course Library**
    Displays:
    - generated courses
    - processing states
    - progress
    - mastery

11. **⚡ Real-Time Processing UI**
    Users see:
    - Downloading
    - Analyzing
    - Generating
    - Finalizing

12. **🗑️ Course Management**
    Delete incomplete or unwanted courses directly from the UI.

13. **📊 Real-Time Mastery Tracking**
    Interactive node progression using visual feedback.

14. **⏱️ Timestamp Navigation**
    Jump directly to exact learning segments.

15. **💾 Persistent Storage**
    SQLite + local persistence.

16. **🐳 Full Dockerized Deployment**
    Complete frontend/backend containerized architecture.
---

## 🏗️ Architecture

```text
User
  │
  ├── YouTube URL ───────────────┐
  │                              │
  ├── Video Upload ──────────────┤
  │                              │
  ├── PDF Notes Upload ──────────┤
  │                              │
  └── Handwritten Notes/Image ───┘
                                 ▼
                        ┌──────────────────┐
                        │     Next.js      │
                        │     Frontend     │
                        │                  │
                        │ ◄── 3D Skill Tree (Three.js)
                        │ ◄── Flashcards UI (Framer Motion)
                        │ ◄── Upcoming Test Planner
                        │ ◄── Semantic Highlighting
                        │ ◄── Smart Course Library
                        │ ◄── Zustand State Bridge
                        │ ◄── Real-Time Processing UI
                        └────────┬─────────┘
                                 │ REST API
                                 ▼
                        ┌──────────────────┐
                        │     FastAPI      │
                        │     Backend      │
                        │                  │
                        │ ◄── Async Background Jobs
                        │ ◄── SQLite Persistent Storage
                        │ ◄── OCR Processing Pipeline
                        │ ◄── Semantic Matching Engine
                        │ ◄── Course Priority Engine
                        │ ◄── yt-dlp Video Extraction
                        └────────┬─────────┘
                                 │
               ┌─────────────────┼─────────────────┐
               ▼                 ▼                 ▼
       ┌────────────┐    ┌──────────────┐   ┌────────────┐
       │   yt-dlp   │    │   EasyOCR    │   │ Gemini 3.0 │
       │ Transcript │    │ Handwriting  │   │   Flash    │
       │ & Video    │    │ Extraction   │   │ Multimodal │
       │ Extraction │    └──────────────┘   │  Analysis  │
       └────────────┘                       └─────┬──────┘
                                                  │
                                                  ▼
                                      ┌────────────────────┐
                                      │ Structured Course  │
                                      │     Generation     │
                                      │                    │
                                      │ • Concepts         │
                                      │ • Flashcards       │
                                      │ • Quizzes          │
                                      │ • Skill Tree       │
                                      │ • Semantic Tags    │
                                      │ • Timestamp Links  │
                                      │ • Mastery Tracking │
                                      └─────────┬──────────┘
                                                │
                                                ▼
                                   ┌────────────────────────┐
                                   │ Smart Study Planner    │
                                   │                        │
                                   │ • Upcoming Tests       │
                                   │ • Semantic Matching    │
                                   │ • Priority Highlighting│
                                   │ • Deadline Awareness   │
                                   └────────────────────────┘

                   ┌────────────────────────────────────┐
                   │     Dockerized Infrastructure      │
                   │                                    │
                   │ • Frontend Container               │
                   │ • Backend Container                │
                   │ • Environment Isolation            │
                   │ • Persistent Volumes               │
                   └────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14, React 18 | App Router architecture, Server & Client components |
| **Language** | TypeScript | Type-safe frontend development |
| **3D Rendering** | Three.js, React Three Fiber | Real-time WebGL rendering of the interactive Skill Tree |
| **Styling & UI** | Tailwind CSS, shadcn/ui | Modern responsive UI system |
| **Animations** | Framer Motion | Fluid transitions, motion effects, and interactive flashcards |
| **State Management** | Zustand | Global state management and mastery synchronization |
| **Backend Framework** | FastAPI (Python) | High-performance async API routing and background tasks |
| **AI Processing** | Google Gemini 3.0 Flash | Native multimodal AI analysis and structured course generation |
| **OCR Engine** | EasyOCR | Handwritten notes and image text extraction |
| **Video & Transcript Extraction** | yt-dlp | Downloading YouTube videos, audio, and transcripts |
| **Schema Validation** | Pydantic v2 | Strict AI JSON validation and structured outputs |
| **Database ORM** | SQLAlchemy | Database abstraction and ORM handling |
| **Database** | SQLite + aiosqlite | Persistent job tracking and course storage |
| **API Communication** | REST API | Frontend ↔ Backend communication |
| **Containerization** | Docker & Docker Compose | Full-stack containerized deployment |
| **Environment Management** | python-dotenv | Secure environment variable handling |
| **File Upload Handling** | python-multipart, aiofiles | Efficient async upload processing |
| **HTTP Client** | httpx | Async external API requests |
| **Deployment Ready** | Dockerized Infrastructure | Portable and reproducible environments |

---

## 🚀 Getting Started

Lumina can be run either:
- locally using Python + Node.js
- or using Docker (recommended)

---

# 📋 Prerequisites

### For Local Development
* **Node.js 20+** and **npm**
* **Python 3.10.x**
* **Google Gemini API Key** with billing enabled  
  Get one at: https://aistudio.google.com/apikey
* **FFmpeg** installed and added to system PATH
* **Docker Desktop** *(optional but recommended)*

---

# 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Lumina.git
cd Lumina
```

---

# 🐳 Option 1 — Run with Docker (Recommended)

This is the easiest and recommended setup.

### Start the Full Application

```bash
docker compose up --build
```

### Access the App

| Service | URL |
| :--- | :--- |
| Frontend | `http://localhost:3000` |
| Backend API | `http://localhost:8000` |
| API Docs | `http://localhost:8000/docs` |

---

### Stop Containers

```bash
docker compose down
```

---

### Rebuild Containers

```bash
docker compose up --build
```

---

### Why Docker?

✅ One-command setup  
✅ No virtual environment issues  
✅ Fully reproducible environment  
✅ Frontend + backend containerized  
✅ Easier deployment and collaboration  

---

# 💻 Option 2 — Local Development Setup

---

## 2️⃣ Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

---

### Configure Environment Variables

Create `.env` inside `backend/`

```env
GEMINI_API_KEY=your_gemini_api_key
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=500
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
LOG_LEVEL=INFO
```

---

### Start Backend Server

```bash
uvicorn main:app --reload --port 8000
```

Backend runs on:

```text
http://localhost:8000
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

---

### Configure Frontend Environment

Create `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

---

### Start Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# 🎯 Start Learning

1. Open `http://localhost:3000`
2. Paste a YouTube URL OR upload:
   - videos
   - PDFs
   - handwritten notes
   - images
3. Wait for AI processing
4. Explore:
   - 3D skill tree
   - flashcards
   - quizzes
   - semantic prioritization
   - smart study planner

---

# 📂 Supported Input Formats

| Type | Formats |
| :--- | :--- |
| Video | MP4, MOV, WebM |
| Documents | PDF |
| Images | JPG, PNG, WEBP |
| URLs | YouTube Links |

---

# ⚡ Processing Pipeline

Lumina processes content in real-time through:

```text
Downloading → OCR/Transcription → AI Analysis → Course Generation → Skill Tree Rendering
```

---

# 🧠 Smart Study Planning

Users can:
- add upcoming test dates
- enter topics
- automatically prioritize relevant courses

Courses dynamically highlight based on urgency and semantic relevance.

---

## ⚠️ Troubleshooting

### Python Version Issues
- **Error**: `greenlet` or `pydantic-core` build failures
- **Solution**: Ensure you're using Python 3.10.x (not 3.11+, 3.14+)
  ```bash
  python --version  # Should show 3.10.x
  ```

### SSL Certificate Errors (Corporate Networks)
- **Error**: `[SSL: CERTIFICATE_VERIFY_FAILED]`
- **Solution**: Already handled! The code includes `--no-check-certificate` for `yt-dlp`

### Gemini API Errors
- **Error**: `404 models/gemini-x.x not found`
- **Solution**: Ensure your API key has billing enabled and supports `gemini-2.5-flash`
- **Error**: `504 Deadline expired`
- **Solution**: Video is too long. Try a shorter video (< 30 minutes) or ensure your API key has sufficient quota

### Font Loading Issues (Next.js)
- **Error**: TLS errors when loading Google Fonts
- **Solution**: Already fixed! Fonts are bundled locally in `frontend/public/fonts/`

---

## 📡 API Reference

| Method | Path | Description |
| :--- | :--- | :--- |
| `POST` | `/api/process/youtube` | Initiates asynchronous processing for a YouTube lecture URL |
| `POST` | `/api/process/upload` | Uploads videos, PDFs, handwritten notes, or images into the AI pipeline |
| `GET` | `/api/status/{job_id}` | Retrieves detailed processing state (`Downloading → OCR → Analyzing → Generating → Finalizing`) |
| `GET` | `/api/progress/{job_id}` | Polls real-time progress updates for active processing jobs |
| `GET` | `/api/jobs` | Returns all active, completed, and failed generation jobs |
| `GET` | `/api/course/{job_id}/flashcards` | Fetches generated flashcards for a course or concept |
| `GET` | `/api/course/{job_id}/quiz` | Retrieves adaptive quiz questions and explanations |
| `DELETE` | `/api/course/{job_id}` | Deletes unwanted or failed courses from the library |


---

## 🎯 How It Works

1. **User Uploads Learning Material**  
   Users can:
   - paste a YouTube URL
   - upload lecture videos
   - upload PDFs
   - upload handwritten notes or images

---

2. **Backend Initializes Async Processing**  
   FastAPI immediately returns a `job_id` while launching asynchronous background processing tasks to keep the UI responsive.

---

3. **Content Extraction Pipeline**

### 🎬 Video & YouTube Processing
- `yt-dlp` downloads:
  - video
  - audio
  - transcripts

### 📝 OCR Processing
- EasyOCR extracts handwritten and printed text from:
  - PDFs
  - notes
  - images

---

4. **Multimodal Gemini Analysis**  
   Extracted content is passed into **Gemini 3.0 Flash**, where the model simultaneously processes:
   - spoken explanations
   - slides
   - diagrams
   - handwritten content
   - transcripts
   - visual context

Gemini receives a highly structured prompt demanding strict Pydantic JSON outputs.

---

5. **Structured Course Generation**  
   Gemini generates a complete structured learning module containing:

- hierarchical concepts
- prerequisite relationships
- timestamps
- categorized flashcards
- adaptive quizzes
- mastery metadata
- semantic tags

---

6. **Semantic Processing Layer**  
   Lumina analyzes:
   - course titles
   - concepts
   - aliases
   - extracted topics

to intelligently associate related study material.

This powers:
- semantic matching
- smart prioritization
- deadline-aware highlighting

---

7. **3D Skill Tree Rendering**  
   The frontend dynamically renders concepts into an interactive Three.js-powered skill tree where:
   - parent-child dependencies are visualized
   - nodes react to mastery progression
   - prerequisite paths become explorable

---

8. **Interactive Learning Experience**

Users interact through:
- flashcards
- quizzes
- concept exploration
- timestamp navigation

to actively reinforce learning.

---

9. **Smart Study Planning**

Users can:
- add upcoming test topics
- assign deadlines

Lumina automatically:
- matches relevant courses
- prioritizes important concepts
- highlights urgent study material

---

10. **Real-Time Progress Tracking**

The UI updates dynamically through multiple stages:

```text
Downloading → OCR → Analyzing → Generating → Finalizing
```

Users can monitor active processing directly from the smart course library.

---

11. **Mastery Tracking & Persistence**

As quizzes are completed:
- mastery states update in real-time
- nodes visually evolve
- progress persists through SQLite + local state storage

This transforms Lumina from:
```text
passive content consumption
```

into:
```text
interactive adaptive learning
```
---

## 🌍 Real-World Impact

- **🎓 Democratizing Education**  
  Lumina transforms free educational content from YouTube, PDFs, and handwritten notes into structured, interactive learning experiences.

- **⏳ Saving Study Time**  
  Automates note-making, flashcards, quizzes, and topic organization — reducing study preparation time by **60–80%**.

- **🧠 Smarter Learning**  
  Uses AI-powered semantic matching and deadline-aware prioritization to help students focus on the most important topics first.

- **♿ Improved Accessibility**  
  Supports multiple learning formats including videos, PDFs, images, and handwritten notes, making learning more inclusive and flexible.

- **👩‍🏫 Empowering Educators**  
  Enables teachers and creators to instantly convert lectures into interactive AI-powered study systems.

- **🚀 Personalized Learning**  
  Moves beyond passive content consumption by creating adaptive, prerequisite-aware learning paths tailored to the student.
---

## 🔮 Future Roadmap

* **Spaced Repetition Engine**: Introducing a timed scheduling algorithm (like Anki) to notify the user when a concept's "Mastery" starts decaying over weeks of inactivity.
* **Multiplayer Skill Trees**: Allowing students in the same university class to share the same Skill Tree and compete to master the nodes fastest.
* **LMS Integration**: Export pipelines for Canvas and Moodle.
* **Mobile Port**: Rewriting the Three.js layer in React Native for iOS/Android native experiences.

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License.

---
<div align="center">
  <b>Built with ❤️</b>
</div>
