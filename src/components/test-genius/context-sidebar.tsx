'use client';

import { FileText, GitBranch, Webhook, PlusCircle } from 'lucide-react';
import type { ContextSource } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

type ContextSidebarProps = {
  contextSources: ContextSource[];
};

const iconMap = {
  document: <FileText className="h-5 w-5 text-muted-foreground" />,
  api: <Webhook className="h-5 w-5 text-muted-foreground" />,
  git: <GitBranch className="h-5 w-5 text-muted-foreground" />,
};

export function ContextSidebar({ contextSources }: ContextSidebarProps) {
  return (
    <aside className="hidden w-80 flex-col border-r bg-card p-4 md:flex">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Context Sources</h2>
        <Button variant="ghost" size="icon" onClick={() => alert('Adding new sources is not implemented yet.')}>
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 -mx-4">
        <div className="space-y-3 px-4">
          {contextSources.map((source) => (
            <div key={source.id} className="flex items-start gap-3 rounded-lg border p-3">
                <div className="mt-1">
                    {iconMap[source.type]}
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm text-card-foreground">{source.name}</p>
                    <p className="text-xs text-muted-foreground">{source.description}</p>
                </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
