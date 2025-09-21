'use client';

import { useState, useEffect } from 'react';
import { Loader, X, Wand2 } from 'lucide-react';
import type { TestCase } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

type TestCaseEditorProps = {
  testCase: TestCase;
  onRefine: (command: string) => void;
  isRefining: boolean;
  onClose: () => void;
};

type HighlightableFields = 'title' | 'steps' | 'expectedResult' | 'priority';

function getChangedFields(original: TestCase, updated: TestCase): HighlightableFields[] {
    const changes: HighlightableFields[] = [];
    if (original.title !== updated.title) changes.push('title');
    if (original.expectedResult !== updated.expectedResult) changes.push('expectedResult');
    if (original.priority !== updated.priority) changes.push('priority');
    if (JSON.stringify(original.steps) !== JSON.stringify(updated.steps)) changes.push('steps');
    return changes;
}

export function TestCaseEditor({ testCase, onRefine, isRefining, onClose }: TestCaseEditorProps) {
  const [command, setCommand] = useState('');
  const [highlightedFields, setHighlightedFields] = useState<HighlightableFields[]>([]);

  useEffect(() => {
    if (testCase._version && testCase._version > 1) {
        // This is a crude way to detect changes. A real app might get diffs from the backend.
        // For now, we just highlight everything.
        setHighlightedFields(['title', 'steps', 'expectedResult', 'priority']);
        const timer = setTimeout(() => setHighlightedFields([]), 1500);
        return () => clearTimeout(timer);
    }
  }, [testCase._version]);

  const handleRefineClick = () => {
      onRefine(command);
      setCommand('');
  }

  const priorityVariant = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <aside className="w-full max-w-md flex-col border-l bg-card md:flex">
      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">3. Refine with AI</h2>
                    <p className="text-sm text-muted-foreground">Edit test case details with commands.</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                    <X className="h-5 w-5" />
                </Button>
            </div>
            
            <div className="space-y-4">
                <div className={cn("space-y-1 rounded-md p-2 -m-2 transition-colors", highlightedFields.includes('title') && 'animate-highlight')}>
                    <Label htmlFor="title">Title</Label>
                    <p id="title" className="text-sm font-medium">{testCase.title}</p>
                </div>

                <div className={cn("space-y-1 rounded-md p-2 -m-2 transition-colors", highlightedFields.includes('priority') && 'animate-highlight')}>
                    <Label>Priority</Label>
                    <div>
                        <Badge variant={priorityVariant(testCase.priority)}>{testCase.priority}</Badge>
                    </div>
                </div>

                <div className={cn("space-y-2 rounded-md p-2 -m-2 transition-colors", highlightedFields.includes('steps') && 'animate-highlight')}>
                    <Label>Steps</Label>
                    <ol className="list-decimal list-inside space-y-1.5 text-sm pl-2">
                        {testCase.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>

                <div className={cn("space-y-1 rounded-md p-2 -m-2 transition-colors", highlightedFields.includes('expectedResult') && 'animate-highlight')}>
                    <Label>Expected Result</Label>
                    <p className="text-sm">{testCase.expectedResult}</p>
                </div>
            </div>
        </div>
      </ScrollArea>
      <div className="border-t p-4 space-y-3 bg-background/50">
        <Label htmlFor="refine-command">Describe the changes you want...</Label>
        <Textarea
          id="refine-command"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="e.g., 'Add a step to verify the confirmation email' or 'Change priority to High'"
          className="bg-card"
          rows={3}
        />
        <Button onClick={handleRefineClick} disabled={isRefining} className="w-full bg-accent hover:bg-accent/90">
          {isRefining ? <Loader className="animate-spin" /> : <Wand2 />}
          <span>Refine</span>
        </Button>
      </div>
    </aside>
  );
}
