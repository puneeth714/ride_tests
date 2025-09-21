'use client';

import { FileText, GitBranch, Webhook, PlusCircle, UploadCloud, Trash2, File } from 'lucide-react';
import type { UploadedFile, ContextSource } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRef } from 'react';

type ContextSidebarProps = {
  contextSources: ContextSource[];
  onFileAdd: (file: UploadedFile) => void;
  onFileRemove: (filename: string) => void;
};

const iconMap = {
  document: <FileText className="h-5 w-5 text-muted-foreground" />,
  api: <Webhook className="h-5 w-5 text-muted-foreground" />,
  git: <GitBranch className="h-5 w-5 text-muted-foreground" />,
  text: <File className="h-5 w-5 text-muted-foreground" />,
};

export function ContextSidebar({ contextSources, onFileAdd, onFileRemove }: ContextSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUri = e.target?.result as string;
        onFileAdd({ filename: file.name, dataUri });
      };
      reader.readAsDataURL(file);
    }
    // Reset file input to allow uploading the same file again
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <aside className="hidden w-80 flex-col border-r bg-card p-4 md:flex">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Context Sources</h2>
      </div>
      <Card className="mb-4">
        <CardContent className="p-4 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4 text-lg">Upload Documents</CardTitle>
            <CardDescription className="mt-2 text-sm">Add PDFs, images, or other files to provide context.</CardDescription>
            <Button onClick={handleUploadClick} className="mt-4 w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Upload File
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.txt,.md"
            />
        </CardContent>
      </Card>

      <ScrollArea className="flex-1 -mx-4">
        <div className="space-y-3 px-4">
          {contextSources.map((source) => (
            <div key={source.name} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="mt-1">
                    {iconMap[source.type]}
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm text-card-foreground truncate">{source.name}</p>
                </div>
                {source.type === 'document' && (
                    <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => onFileRemove(source.name)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
