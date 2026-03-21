# MuslimViet

[![Build Status](https://img.shields.io/travis/com/HamidAbdol89/MuslimViet.svg?style=flat-square)](https://travis-ci.com/HamidAbdol89/MuslimViet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript Version](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

This repository contains the MuslimViet project, a platform designed to provide Islamic knowledge and support. The project is primarily developed using TypeScript and includes backend services, AI integrations, and a user interface.

## Features

*   **AI-Powered Islamic Knowledge System:** Leverages advanced AI models to provide accurate and comprehensive answers to Islamic queries.
*   **Health and Wellness Integration:** Offers guidance and information related to health and well-being from an Islamic perspective.
*   **Intelligent Dialogue System:** Facilitates natural language conversations for user interaction and information retrieval.
*   **Data Population and Management:** Includes tools for populating and managing the knowledge base.
*   **API Endpoints:** Exposes various endpoints for accessing AI functionalities and Islamic knowledge.
*   **Containerization:** Utilizes Docker for streamlined development, deployment, and environment consistency.

## Installation

This project requires Node.js and npm/yarn to be installed. For backend services and AI components, Docker is recommended.

### Prerequisites

*   Node.js (v14 or later recommended)
*   npm or yarn package manager
*   Docker (for backend services)

### Backend Setup (using Docker)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/HamidAbdol89/MuslimViet.git
    cd MuslimViet
    ```

2.  **Navigate to the AI backend directory:**
    ```bash
    cd backend/AI
    ```

3.  **Build and run the Docker image:**
    ```bash
    docker build -t muslimviet-ai .
    docker run -d -p 3000:3000 --name muslimviet-ai-container muslimviet-ai
    ```
    *Note: Ensure your `.env` files are correctly configured for your environment.*

### Frontend Setup (if applicable)

*(Instructions for frontend setup would go here if a frontend directory and its build process were evident in the file structure. As it's not explicitly detailed, this section is a placeholder.)*

## Usage

### Interacting with the AI

The primary interaction with the AI is through the exposed API endpoints.

#### Example: Querying Islamic Knowledge

*(This is a hypothetical example based on the file structure. Actual endpoints and request/response formats may vary.)*

**Endpoint:** `/api/islamic-knowledge`
**Method:** `POST`

**Request Body:**

```json
{
  "query": "What are the pillars of Islam?"
}
```

**Response Body (example):**

```json
{
  "answer": "The pillars of Islam are: Shahada (faith), Salat (prayer), Zakat (charity), Sawm (fasting), and Hajj (pilgrimage).",
  "confidence_score": 0.95
}
```

#### Example: Health Guidance

*(This is a hypothetical example based on the file structure.)*

**Endpoint:** `/api/health/guidance`
**Method:** `POST`

**Request Body:**

```json
{
  "topic": "Benefits of fasting for health"
}
```

**Response Body (example):**

```json
{
  "guidance": "Fasting can offer numerous health benefits, including improved insulin sensitivity, weight management, and cellular repair processes, all within the framework of Islamic teachings.",
  "references": ["Quranic verses", "Hadith"]
}
```

## Contributing

We welcome contributions to the MuslimViet project. Please follow these guidelines:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix (`git checkout -b feature/your-feature-name` or `git checkout -b bugfix/your-bug-fix`).
3.  **Make your changes** and ensure they are well-tested.
4.  **Commit your changes** with clear and concise commit messages.
5.  **Push to the branch** (`git push origin feature/your-feature-name`).
6.  **Open a Pull Request** against the `main` branch of the original repository.
7.  Please ensure your code adheres to the project's coding standards and TypeScript best practices.

## License

This project is not currently under a specified license.

## API Documentation

The MuslimViet project exposes several API endpoints. The following are identified from the codebase structure:

### AI Endpoints

*   **`POST /endpoint/trinhThongMinh`**: Likely a general-purpose intelligent assistant endpoint.
*   **`POST /endpoint/kienThucIslam`**: Endpoint for retrieving Islamic knowledge.
*   **`POST /endpoint/sucKhoe`**: Endpoint for health-related queries and guidance.
*   **`POST /endpoint/giaodienDebug`**: Debugging endpoint for AI interactions.

### Internal AI Modules

*   `geminiAI.js`: Integration with Gemini AI models.
*   `islamicKnowledgeSystem.js`: Core logic for the Islamic knowledge system.
*   `hamTroGiup.js`: Helper functions for AI interactions.
*   `hocSau.js`: Module for deep learning or advanced processing.
*   `kiemTraVaXuLyCauHoi.js`: Logic for question validation and processing.
*   `kiemTraYeuCau.js`: Request validation module.
*   `masterIslamicPrompt.js`: Manages master prompts for AI.
*   `islamicMasterKnowledge.js`: Handles master Islamic knowledge data.
*   `dataPopulator.js`: Script for populating the database.

*(Detailed request/response schemas and authentication requirements would be documented here if available.)*

## Configuration and Environment Variables

The backend services rely on environment variables for configuration. Key variables likely include:

*   `DATABASE_URL`: Connection string for the database.
*   `GEMINI_API_KEY`: API key for the Gemini AI service.
*   `NODE_ENV`: Specifies the environment (e.g., `development`, `production`).
*   `PORT`: The port on which the server listens.

Ensure these variables are set correctly in your `.env` files (e.g., `.env.development`) or through your deployment environment.

## Acknowledgments

The development of MuslimViet is a collaborative effort. We acknowledge the use of various open-source libraries and AI models that power this project.

*(Specific acknowledgments to individuals, organizations, or foundational technologies would be listed here.)*

---

<p align="center">
  <a href="https://readmeforge.app?utm_source=badge">
    <img src="https://readmeforge.app/badge.svg" alt="Made with ReadmeForge" height="20">
  </a>
</p>