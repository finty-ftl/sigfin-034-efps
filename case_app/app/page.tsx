"use client";

import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/sidebar';
import { MainContent } from '@/components/main-content';
import { ThemeToggle } from '@/components/theme-toggle';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function Home() {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel 
          defaultSize={20} 
          minSize={10} 
          maxSize={30}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          collapsible
        >
          <div className="flex flex-col h-full bg-card">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold truncate">
                  {isCollapsed ? "EFP" : "Economic Fermi Problems"}
                </h1>
              </div>
            </div>
            <div className="flex-1">
              <Sidebar 
                history={history} 
                onSelectHistory={setSelectedHistoryItem}
                isCollapsed={isCollapsed}
              />
            </div>
            <div className="p-4 border-t">
              <ThemeToggle isCollapsed={isCollapsed} />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <main className="h-full p-8 overflow-y-auto">
            <MainContent 
              onHistoryUpdate={setHistory} 
              selectedHistoryItem={selectedHistoryItem}
            />
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}