'use client';

import { Wand2, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

type AppHeaderProps = {
  projectName: string;
  setProjectName: (name: string) => void;
};

export function AppHeader({ projectName, setProjectName }: AppHeaderProps) {
  return (
    <header className="shrink-0">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Wand2 className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Ride Tests Agent
          </h1>
        </div>
        <div className="flex-1">
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full max-w-md mx-auto text-center font-medium text-lg bg-transparent border-0 shadow-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Project Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => alert('Exporting is not implemented yet.')}>
            <Download />
            <span>Export</span>
          </Button>
          <Button size="sm" onClick={() => alert('Saving is not implemented yet.')}>
            <Save />
            <span>Save Suite</span>
          </Button>
        </div>
      </div>
      <Separator />
    </header>
  );
}
