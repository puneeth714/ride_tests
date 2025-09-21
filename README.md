# Ride Tests Agent

This is a Next.js application that uses AI to generate test cases from context. It's built with Next.js, Genkit for AI functionality, and ShadCN UI for components.

## Getting Started

Follow these instructions to get a local copy up and running on your machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or another package manager like yarn or pnpm

### Installation

1.  **Clone the repository**
    If you have git installed, you can clone the repository. Otherwise, you can download the source code.

2.  **Install dependencies**
    Navigate to the project directory and run the following command to install all the necessary packages:

    ```bash
    npm install
    ```

### Environment Variables

The application requires a Google AI API key to function.

1.  Create a `.env` file in the root of the project by making a copy of the `.env.example` file (if it exists) or creating a new one.
2.  Add your API key to the `.env` file:

    ```
    GEMINI_API_KEY=your_google_ai_api_key
    ```

    You can obtain a `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Application

This project consists of two main parts that need to run concurrently: the Next.js frontend and the Genkit AI service. You will need two separate terminal windows.

1.  **Start the Genkit AI Service**
    In your first terminal, run the following command to start the Genkit server. The `--watch` flag will automatically restart the server when you make changes to the AI flow files.

    ```bash
    npm run genkit:watch
    ```

    Wait for the message indicating that the Genkit server has started.

2.  **Start the Next.js Development Server**
    In your second terminal, run the following command to start the Next.js frontend application:

    ```bash
    npm run dev
    ```

3.  **Open the application**
    Once both servers are running, open your web browser and navigate to [http://localhost:9002](http://localhost:9002) to see the application in action.

## Available Scripts

- `npm run dev`: Starts the Next.js development server on port 9002.
- `npm run genkit:dev`: Starts the Genkit server once.
- `npm run genkit:watch`: Starts the Genkit server in watch mode.
- `npm run build`: Creates a production build of the Next.js application.
- `npm run start`: Starts the production Next.js server.
- `npm run lint`: Lints the project files using ESLint.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.