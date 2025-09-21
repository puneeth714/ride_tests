# **App Name**: TestGenius AI

## Core Features:

- Context Aggregation: Upload documents, link to APIs, and connect to Git repositories to provide context for test case generation.
- Interactive Test Case Generation: The AI will ask clarifying questions based on the provided context. The AI tool then displays the generated test cases in a list view as they are generated, providing immediate feedback.
- AI-Powered Refinement: Users can refine test cases by entering commands (e.g., 'Add a step to verify the user receives a confirmation email.'). The AI will interpret the command and update the test case fields in real-time. The LLM must act as a tool that helps apply edits requested by the user.
- Test Suite Management: Save the complete test suite to the backend. From there, export the test cases to various formats (CSV, JSON) or push them directly to integrated tools like Jira.
- Project Dashboard: Display a grid of existing projects with a 'Create New Project' button. List of added context sources with icons (PDF, API, Git). For Git sources, show the selected branch or commit range.

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to reflect the technical nature of the app while keeping it friendly.
- Background color: Light grey (#F5F5F5) for a clean, modern look and to ensure readability.
- Accent color: A vivid purple (#9C27B0) to draw attention to CTAs and interactive elements.
- Body and headline font: 'Inter' sans-serif for a modern, neutral and objective look that is very suitable for both headlines and body text.
- Use clear, professional icons from the Material-UI library to represent different context sources (PDF, API, Git).
- Flow-based UI design: The numbered components guide the user from left-to-right, from context input to final export.
- Subtle highlights and transitions to indicate changes made by the AI during the refinement stage.