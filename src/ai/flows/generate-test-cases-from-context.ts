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
});
export type GenerateTestCasesInput = z.infer<typeof GenerateTestCasesInputSchema>;

const TestCaseSchema = z.object({
  id: z.string().describe('Unique identifier for the test case.'),
  title: z.string().describe('Title of the test case.'),
  steps: z.array(z.string()).describe('Array of test steps.'),
  expectedResult: z.string().describe('Expected result of the test case.'),
  priority: z.string().describe('Priority of the test case (e.g., High, Medium, Low).'),
});

const GenerateTestCasesOutputSchema = z.array(TestCaseSchema);
export type GenerateTestCasesOutput = z.infer<typeof GenerateTestCasesOutputSchema>;

export async function generateTestCases(input: GenerateTestCasesInput): Promise<GenerateTestCasesOutput> {
  return generateTestCasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestCasesPrompt',
  input: {schema: GenerateTestCasesInputSchema},
  output: {schema: GenerateTestCasesOutputSchema},
  prompt: `You are an expert QA engineer responsible for generating test cases based on provided context.\n\nContext Sources:\n{{#if documents}}\nDocuments:\n{{#each documents}}\nFilename: {{{this.filename}}}\nContent: {{media url=this.dataUri}}\n{{/each}}\n{{/if}}\n\n{{#if apiSpecUrls}}\nAPI Specifications:\n{{#each apiSpecUrls}}\nURL: {{{this}}}\n{{/each}}\n{{/if}}\n\n{{#if gitRepoUrl}}\nGit Repository: {{{gitRepoUrl}}}\nBranch: {{{gitBranch}}}\n{{/if}}\n\nBased on the context above, generate a comprehensive set of test cases.  If there are ambiguities or missing details, formulate clarifying questions to ask the user. Once you have enough information, generate test cases in the following JSON format: [{id, title, steps: [], expectedResult, priority}].\n\nEnsure each test case includes a unique ID, a descriptive title, a list of steps to execute, the expected result, and a priority level.\n`,
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
