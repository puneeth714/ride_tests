'use client';

import { useState } from 'react';
import type { TestCase, ContextSource } from '@/lib/types';
import { AppHeader } from './app-header';
import { ContextSidebar } from './context-sidebar';
import { TestSuitePanel } from './test-suite-panel';
import { TestCaseEditor } from './test-case-editor';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { generateTestCases, refineTestCase } from '@/app/actions';

export function ProjectWorkspace() {
  const { toast } = useToast();
  const [projectName, setProjectName] = useState('Q4 Checkout Funnel Regression');
  const [contextSources, setContextSources] = useState<ContextSource[]>([
    { id: '1', type: 'document', name: 'Product Requirements.pdf', description: 'Initial PRD from product team' },
    { id: '2', type: 'document', name: 'UI Mockups v2.fig', description: 'Figma mockups for the new flow'},
    { id: '3', type: 'api', name: 'Checkout API Spec', description: 'OpenAPI v3 specification' },
    { id: '4', type: 'git', name: 'feature/new-checkout', description: 'Git branch with backend and UI changes' },
  ]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  
  const handleGenerate = async (context: string) => {
    if (!context.trim()) {
      toast({
        variant: "destructive",
        title: "Context is empty",
        description: "Please provide some context before generating test cases.",
      });
      return;
    }

    setIsGenerating(true);
    setTestCases([]);
    setSelectedTestCase(null);

    try {
      const result = await generateTestCases(context, projectName);
      // Simulate live generation for better UX
      result.forEach((tc, index) => {
        setTimeout(() => {
          setTestCases(prev => [...prev, tc]);
        }, index * 100);
      });
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
        <ContextSidebar contextSources={contextSources} />
        <Separator orientation="vertical" />
        <TestSuitePanel
          testCases={testCases}
          onTestCaseSelect={setSelectedTestCase}
          selectedTestCase={selectedTestCase}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
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
