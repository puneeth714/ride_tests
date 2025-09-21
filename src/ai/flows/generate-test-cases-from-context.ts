'use server';
/**
 * @fileOverview Generates test cases from provided context using an AI model.
 *
 * - generateTestCases - A function that accepts context from various sources and returns generated test cases.
 * - GenerateTestCasesInput - The input type for the generateTestCases function.
 * - GenerateTestCasesOutput - The return type for the generateTestCases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestCasesInputSchema = z.object({
  documents: z.array(
    z.object({
      filename: z.string().describe('The name of the document.'),
      dataUri: z
        .string()
        .describe(
          "The document's data as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    })
  ).optional().describe('Uploaded documents (PDFs, Word docs, images).'),
  apiSpecUrls: z.array(z.string().url()).optional().describe('URLs to OpenAPI (Swagger) specifications.'),
  gitRepoUrl: z.string().url().optional().describe('URL to the Git repository.'),
  gitBranch: z.string().optional().describe('The branch to analyze in the Git repository.'),
  userResponses: z.array(z.string()).optional().describe('User responses to clarifying questions.'),
});
export type GenerateTestCasesInput = z.infer<typeof GenerateTestCasesInputSchema>;

const TestCaseSchema = z.object({
  id: z.string().describe('Unique identifier for the test case.'),
  title: z.string().describe('Title of the test case.'),
  steps: z.array(z.string()).describe('Array of test steps.'),
  expectedResult: z.string().describe('Expected result of the test case.'),
  priority: z.string().describe('Priority of the test case (e.g., High, Medium, Low).'),
});

const GenerateTestCasesOutputSchema = z.object({
  clarifyingQuestions: z.array(z.string()).optional().describe('Questions to ask the user to get more details for generating better test cases. If you have enough information, you can leave this empty.'),
  testCases: z.array(TestCaseSchema).optional().describe('The generated test cases.'),
});
export type GenerateTestCasesOutput = z.infer<typeof GenerateTestCasesOutputSchema>;

export async function generateTestCases(input: GenerateTestCasesInput): Promise<GenerateTestCasesOutput> {
  return generateTestCasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestCasesPrompt',
  input: {schema: GenerateTestCasesInputSchema},
  output: {schema: GenerateTestCasesOutputSchema},
  prompt: `You are an expert QA engineer responsible for generating test cases based on provided context. Your goal is to create comprehensive, specific, and edge-case-oriented tests.

First, analyze the provided context. 

Context Sources:
{{#if documents}}
Documents:
{{#each documents}}
- Filename: {{{this.filename}}}
  Content: {{media url=this.dataUri}}
{{/each}}
{{/if}}

{{#if apiSpecUrls}}
API Specifications:
{{#each apiSpecUrls}}
- URL: {{{this}}}
{{/each}}
{{/if}}

{{#if gitRepoUrl}}
Git Repository: {{{gitRepoUrl}}}
Branch: {{{gitBranch}}}
{{/if}}

If the context is ambiguous, incomplete, or lacks detail for creating thorough test cases, you MUST formulate clarifying questions to ask the user. These questions should be designed to elicit information about edge cases, user roles, specific business rules, or platform variations.

{{#if userResponses}}
The user has provided the following answers to your previous questions:
{{#each userResponses}}
- {{{this}}}
{{/each}}
Use these answers to refine your understanding and generate better test cases.
{{/if}}

If you need more information, provide a list of 'clarifyingQuestions'. Do not generate test cases yet.
If you have enough information to generate a good set of initial test cases, provide the 'testCases' in the specified JSON format and leave 'clarifyingQuestions' empty or null.
`,
});

const generateTestCasesFlow = ai.defineFlow(
  {
    name: 'generateTestCasesFlow',
    inputSchema: GenerateTestCasesInputSchema,
    outputSchema: GenerateTestCasesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
