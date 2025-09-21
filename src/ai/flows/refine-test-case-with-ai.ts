'use server';
/**
 * @fileOverview A flow for refining test cases using natural language commands.
 *
 * - refineTestCaseWithAI - A function that refines a test case based on a natural language command.
 * - RefineTestCaseWithAIInput - The input type for the refineTestCaseWithAI function.
 * - RefineTestCaseWithAIOutput - The return type for the refineTestCaseWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TestCaseSchema = z.object({
  id: z.string().describe('The unique identifier of the test case.'),
  title: z.string().describe('The title of the test case.'),
  steps: z.array(z.string()).describe('The steps to execute for the test case.'),
  expectedResult: z.string().describe('The expected result of the test case.'),
  priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the test case.'),
});

export type TestCase = z.infer<typeof TestCaseSchema>;

const RefineTestCaseWithAIInputSchema = z.object({
  testCase: TestCaseSchema.describe('The current test case as a JSON object.'),
  userCommand: z.string().describe('The natural language command to modify the test case.'),
});

export type RefineTestCaseWithAIInput = z.infer<typeof RefineTestCaseWithAIInputSchema>;

const RefineTestCaseWithAIOutputSchema = TestCaseSchema.describe('The refined test case as a JSON object.');

export type RefineTestCaseWithAIOutput = z.infer<typeof RefineTestCaseWithAIOutputSchema>;

export async function refineTestCaseWithAI(input: RefineTestCaseWithAIInput): Promise<RefineTestCaseWithAIOutput> {
  return refineTestCaseWithAIFlow(input);
}

const refineTestCaseWithAIPrompt = ai.definePrompt({
  name: 'refineTestCaseWithAIPrompt',
  input: {schema: RefineTestCaseWithAIInputSchema},
  output: {schema: RefineTestCaseWithAIOutputSchema},
  prompt: `Given the following test case:\n\n{{{json testCase}}}\n\nModify it based on this command: \'{{{userCommand}}}\'\n\nReturn only the updated JSON for the test case.`,
});

const refineTestCaseWithAIFlow = ai.defineFlow(
  {
    name: 'refineTestCaseWithAIFlow',
    inputSchema: RefineTestCaseWithAIInputSchema,
    outputSchema: RefineTestCaseWithAIOutputSchema,
  },
  async input => {
    const {output} = await refineTestCaseWithAIPrompt(input);
    return output!;
  }
);
