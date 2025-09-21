'use client';

import { useState } from 'react';
import { Bot, Loader, Wand2, ChevronDown, ChevronRight, MessageSquareQuote } from 'lucide-react';
import type { TestCase } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type TestSuitePanelProps = {
  testCases: TestCase[];
  onTestCaseSelect: (testCase: TestCase) => void;
  selectedTestCase: TestCase | null;
  isGenerating: boolean;
  onGenerate: (context: string, userResponses?: string[]) => void;
  clarifyingQuestions: string[];
};

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

export function TestSuitePanel({
  testCases,
  onTestCaseSelect,
  selectedTestCase,
  isGenerating,
  onGenerate,
  clarifyingQuestions,
}: TestSuitePanelProps) {
  const [context, setContext] = useState(initialContext);
  const [questionResponses, setQuestionResponses] = useState<string[]>(Array(clarifyingQuestions.length).fill(''));

  const handleResponseChange = (index: number, value: string) => {
    const newResponses = [...questionResponses];
    newResponses[index] = value;
    setQuestionResponses(newResponses);
  };
  
  const handleRegenerateWithAnswers = () => {
      onGenerate(context, questionResponses);
  };

  const priorityVariant = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      default: return 'outline';
    }
  };

  const renderContent = () => {
    if (testCases.length === 0 && !isGenerating && clarifyingQuestions.length === 0) {
      return (
        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
          <h2 className="text-2xl font-bold tracking-tight mb-4">1. Provide Context</h2>
          <Card className="flex-1 flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col">
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Paste your requirements, user stories, API specs, or any other context here..."
                className="flex-1 text-sm resize-none"
              />
            </CardContent>
          </Card>
          <div className="flex justify-end mt-4">
            <Button size="lg" onClick={() => onGenerate(context)} disabled={isGenerating} className="bg-accent hover:bg-accent/90">
              {isGenerating ? <Loader className="animate-spin" /> : <Wand2 />}
              <span>Generate Test Cases</span>
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">2. Review & Refine Test Suite</h2>
          <Button variant="outline" onClick={() => onGenerate(context)} disabled={isGenerating}>
            {isGenerating && testCases.length === 0 ? <Loader className="animate-spin" /> : <Wand2 />}
            <span>Regenerate</span>
          </Button>
        </div>
        <Collapsible className="mb-4 border rounded-lg">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 font-medium text-lg bg-card rounded-t-lg">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                <span>Context</span>
              </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 border-t">
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Paste your requirements, user stories, API specs, or any other context here..."
                className="flex-1 text-sm resize-none"
                rows={10}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {clarifyingQuestions.length > 0 && (
            <Card className="mb-4 bg-accent/10 border-accent/50">
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-2 text-accent font-semibold">
                        <MessageSquareQuote className="h-5 w-5" />
                        <p>To generate better tests, please answer these questions:</p>
                    </div>
                    <div className="space-y-3 pl-7">
                        {clarifyingQuestions.map((q, i) => (
                             <div key={i} className="space-y-1">
                                <Label htmlFor={`q-${i}`} className="text-sm font-medium">{q}</Label>
                                <Input 
                                    id={`q-${i}`}
                                    value={questionResponses[i]}
                                    onChange={e => handleResponseChange(i, e.target.value)}
                                    placeholder="Your answer..."
                                />
                             </div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleRegenerateWithAnswers} disabled={isGenerating}>
                            {isGenerating ? <Loader className="animate-spin" /> : <Wand2 />}
                            <span>Generate with Answers</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )}

        <Card className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
              <Table>
                  <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-[120px]">Priority</TableHead>
                  </TableRow>
                  </TableHeader>
                  <TableBody>
                  {testCases.map((tc) => (
                      <TableRow 
                          key={tc.id} 
                          onClick={() => onTestCaseSelect(tc)}
                          className={cn("cursor-pointer", selectedTestCase?.id === tc.id && "bg-muted/50")}
                      >
                      <TableCell className="font-mono text-xs text-muted-foreground">{tc.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-medium">{tc.title}</TableCell>
                      <TableCell>
                          <Badge variant={priorityVariant(tc.priority)}>{tc.priority}</Badge>
                      </TableCell>
                      </TableRow>
                  ))}
                  {isGenerating && (
                      <TableRow>
                          <TableCell colSpan={3} className="text-center">
                              <div className="flex items-center justify-center gap-2 text-muted-foreground py-4">
                                  <Bot className="h-5 w-5 animate-pulse" />
                                  <span>{testCases.length > 0 ? 'Generating more test cases...' : 'Generating test cases...'}</span>
                              </div>
                          </TableCell>
                      </TableRow>
                  )}
                  </TableBody>
              </Table>
          </ScrollArea>
        </Card>
      </div>
    );
  }

  return renderContent();
}
