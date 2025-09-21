'use server';

import { generateTestCases as generateTestCasesFlow } from '@/ai/flows/generate-test-cases-from-context';
import { refineTestCaseWithAI as refineTestCaseWithAIFlow, RefineTestCaseWithAIInput } from '@/ai/flows/refine-test-case-with-ai';
import type { TestCase } from '@/lib/types';
import { z } from 'zod';

function toTitleCase(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


export async function generateTestCases(context: string, projectName: string): Promise<TestCase[]> {
    try {
        if (!context.trim()) {
            return [];
        }

        const result = await generateTestCasesFlow({
            documents: [{
                filename: `${projectName}-context.txt`,
                dataUri: `data:text/plain;base64,${Buffer.from(context).toString('base64')}`
            }]
        });

        // Normalize priority and add a version for UI animation purposes
        return result.map((tc, index) => ({
            ...tc,
            id: tc.id || `${Date.now()}-${index}`,
            priority: toTitleCase(tc.priority),
            _version: 1,
        })) as TestCase[];

    } catch (error) {
        console.error("Error generating test cases:", error);
        throw new Error("Failed to generate test cases. Please check the AI service.");
    }
}

export async function refineTestCase(testCase: TestCase, command: string): Promise<TestCase> {
    try {
        // Ensure priority conforms to the schema expected by the AI flow
        const priority = toTitleCase(testCase.priority);
        const validPriorities = ['High', 'Medium', 'Low'];
        const validatedPriority = validPriorities.includes(priority) ? priority as 'High' | 'Medium' | 'Low' : 'Medium';

        const input: RefineTestCaseWithAIInput = {
            testCase: {
                id: testCase.id,
                title: testCase.title,
                steps: testCase.steps,
                expectedResult: testCase.expectedResult,
                priority: validatedPriority,
            },
            userCommand: command,
        };

        const result = await refineTestCaseWithAIFlow(input);
        
        return {
            ...result,
            id: result.id || testCase.id,
            priority: toTitleCase(result.priority),
        };

    } catch (error) {
        console.error("Error refining test case:", error);
        throw new Error("Failed to refine the test case. Please check the AI service.");
    }
}
