"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, FileText } from "lucide-react";

interface HistoryItem {
  id: number;
  answer: string;
  timestamp: string;
}

interface SidebarProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
}

export function Sidebar({ history, onSelectHistory }: SidebarProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          History
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm">No history yet</p>
          ) : (
            history.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start mb-2"
                onClick={() => onSelectHistory(item)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Answer #{item.id}
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}