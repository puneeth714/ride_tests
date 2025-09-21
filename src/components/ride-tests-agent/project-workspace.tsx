'use client';

import { useState } from 'react';
import type { TestCase, UploadedFile, ContextSource } from '@/lib/types';
import { AppHeader } from './app-header';
import { ContextSidebar } from './context-sidebar';
import { TestSuitePanel } from './test-suite-panel';
import { TestCaseEditor } from './test-case-editor';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { generateTestCases, refineTestCase } from '@/app/actions';
import { GenerateTestCasesInput } from '@/ai/flows/generate-test-cases-from-context';

const initialContext = `User Authentication Flow

This document outlines the requirements for the user authentication flow in our application.

1. User Login:
- Users should be able to log in with their email and password.
- Upon successful login, the user is redirected to their dashboard.
- If login fails due to incorrect credentials, an "Invalid email or password" error should be displayed.
- The system should lock the account for 15 minutes after 5 failed login attempts.

2. User Registration:
- New users can sign up using their name, email, and a password.
- Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character.
- A verification email is sent to the user's email address upon registration.

3. Password Reset:
- A "Forgot Password?" link should be available on the login page.
- Users can enter their email to receive a password reset link.
- The link should be valid for 1 hour.`;


export function ProjectWorkspace() {
  const { toast } = useToast();
  const [projectName, setProjectName] = useState('Q4 Checkout Funnel Regression');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([]);
  const [context, setContext] = useState(initialContext);

  const contextSources: ContextSource[] = [
    { name: 'Pasted Context', type: 'text' },
    ...uploadedFiles.map(f => ({ name: f.filename, type: 'document' as const }))
  ];

  const handleFileAdd = (file: UploadedFile) => {
    if (uploadedFiles.some(f => f.filename === file.filename)) {
      toast({
        variant: "destructive",
        title: "File already exists",
        description: `A file named ${file.filename} has already been uploaded.`,
      });
      return;
    }
    setUploadedFiles(prev => [...prev, file]);
  };

  const handleFileRemove = (filename: string) => {
    setUploadedFiles(prev => prev.filter(f => f.filename !== filename));
  };
  
  const handleGenerate = async (userResponses?: string[]) => {
    const allDocuments: UploadedFile[] = [...uploadedFiles];
    if (context.trim()) {
        allDocuments.push({
            filename: 'pasted-context.txt',
            dataUri: `data:text/plain;base64,${Buffer.from(context).toString('base64')}`
        });
    }

    if (allDocuments.length === 0) {
      toast({
        variant: "destructive",
        title: "Context is empty",
        description: "Please provide some context before generating test cases.",
      });
      return;
    }

    setIsGenerating(true);
    if (!userResponses) {
        setTestCases([]);
    }
    setSelectedTestCase(null);
    setClarifyingQuestions([]);

    try {
      const input: GenerateTestCasesInput = {
          documents: allDocuments,
          userResponses
      };
      const result = await generateTestCases(input);
      
      if(result.clarifyingQuestions && result.clarifyingQuestions.length > 0) {
        setClarifyingQuestions(result.clarifyingQuestions);
      }

      if (result.testCases && result.testCases.length > 0) {
        // Simulate live generation for better UX
        result.testCases.forEach((tc, index) => {
          setTimeout(() => {
            setTestCases(prev => [...prev, tc]);
          }, index * 100);
        });
      }
    } catch (e) {
      const error = e instanceof Error ? e : new Error('An unknown error occurred');
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (command: string) => {
    if (!selectedTestCase) return;
    if (!command.trim()) {
      toast({
        variant: "destructive",
        title: "Command is empty",
        description: "Please provide a command to refine the test case.",
      });
      return;
    }

    setIsRefining(true);
    try {
      const refined = await refineTestCase(selectedTestCase, command);
      const updatedTestCase = { ...refined, _version: (selectedTestCase._version || 1) + 1 };
      
      const updatedTestCases = testCases.map(tc =>
        tc.id === updatedTestCase.id ? updatedTestCase : tc
      );

      setTestCases(updatedTestCases);
      setSelectedTestCase(updatedTestCase);

    } catch (e) {
      const error = e instanceof Error ? e : new Error('An unknown error occurred');
      toast({
        variant: "destructive",
        title: "Refinement Failed",
        description: error.message,
      });
    } finally {
      setIsRefining(false);
    }
  };


  return (
    <div className="flex h-screen w-full flex-col bg-background text-foreground">
      <AppHeader projectName={projectName} setProjectName={setProjectName} />
      <div className="flex flex-1 overflow-hidden">
        <ContextSidebar 
            contextSources={contextSources}
            onFileAdd={handleFileAdd}
            onFileRemove={handleFileRemove}
        />
        <Separator orientation="vertical" />
        <TestSuitePanel
          testCases={testCases}
          onTestCaseSelect={setSelectedTestCase}
          selectedTestCase={selectedTestCase}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          clarifyingQuestions={clarifyingQuestions}
          context={context}
          setContext={setContext}
        />
        {selectedTestCase && (
          <>
            <Separator orientation="vertical" />
            <TestCaseEditor
              key={selectedTestCase.id}
              testCase={selectedTestCase}
              onRefine={handleRefine}
              isRefining={isRefining}
              onClose={() => setSelectedTestCase(null)}
            />
          </>
        )}
      </div>
    </div>
  );
}
