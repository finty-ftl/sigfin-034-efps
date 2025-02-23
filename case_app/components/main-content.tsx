"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Send, Bot, BarChart3, RefreshCcw, GitGraph, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { mockAnswers, mockEvaluation } from '@/lib/mock-data';
import { EvaluationChart } from '@/components/evaluation-chart';
import { ComputationGraph } from '@/components/computation-graph';

interface MainContentProps {
  onHistoryUpdate: (history: any[]) => void;
  selectedHistoryItem?: any;
}

export function MainContent({ onHistoryUpdate, selectedHistoryItem }: MainContentProps) {
  const [started, setStarted] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [selectedGraphType, setSelectedGraphType] = useState('');
  const [aiAnswers, setAiAnswers] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isAnswersCollapsed, setIsAnswersCollapsed] = useState(false);

  useEffect(() => {
    if (selectedHistoryItem) {
      setUserAnswer(selectedHistoryItem.answer);
      setStarted(true);
    }
  }, [selectedHistoryItem]);

  const handleStart = () => {
    setStarted(true);
  };

  const handleSubmit = () => {
    if (userAnswer.trim()) {
      const newHistoryItem = {
        id: history.length + 1,
        answer: userAnswer,
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [...history, newHistoryItem];
      setHistory(updatedHistory);
      onHistoryUpdate(updatedHistory);
    }
  };

  const handleAIAnswer = () => {
    setAiAnswers(mockAnswers);
    setShowAnswers(true);
  };

  const handleEvaluate = () => {
    setShowEvaluation(true);
  };

  const handleComputeGraph = () => {
    setShowGraph(true);
    setSelectedGraphType('');
  };

  const handleClear = () => {
    setStarted(false);
    setUserAnswer('');
    setShowEvaluation(false);
    setSelectedGraphType('');
    setAiAnswers({});
    setShowAnswers(false);
    setShowGraph(false);
    setIsAnswersCollapsed(false);
  };

  const answerTypes = ['CoT', 'FermiCoT', 'CSRFermiCoT'];

  const truncateAnswer = (answer: string) => {
    const firstParagraph = answer.split('\n')[0];
    return firstParagraph.length > 150 ? firstParagraph.substring(0, 150) + '...' : firstParagraph;
  };

  if (!started) {
    return (
      <div className="h-full flex items-center justify-center">
        <Button onClick={handleStart} size="lg" className="w-64">
          <Play className="mr-2 h-4 w-4" />
          Start
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Problem</h2>
        <p className="text-lg mb-4">
          How much is the initial cost for advertising and promoting a new product?
        </p>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter your answer..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex gap-4">
            <Button onClick={handleSubmit}>
              <Send className="mr-2 h-4 w-4" />
              Submit
            </Button>
            <Button variant="secondary" onClick={handleAIAnswer}>
              <Bot className="mr-2 h-4 w-4" />
              AI Answer
            </Button>
            {showAnswers && (
              <Button variant="outline" onClick={() => setIsAnswersCollapsed(!isAnswersCollapsed)}>
                {isAnswersCollapsed ? (
                  <ChevronDown className="mr-2 h-4 w-4" />
                ) : (
                  <ChevronUp className="mr-2 h-4 w-4" />
                )}
                Toggle Answer
              </Button>
            )}
          </div>
        </div>
      </Card>

      {showAnswers && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {answerTypes.map((type) => (
            <Card key={type} className="p-6">
              <h3 className="text-lg font-semibold mb-4">{type}</h3>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>
                  {isAnswersCollapsed ? truncateAnswer(aiAnswers[type]) : aiAnswers[type]}
                </ReactMarkdown>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showAnswers && (
        <div className="flex gap-4">
          <Button onClick={handleEvaluate} className="flex-1">
            <BarChart3 className="mr-2 h-4 w-4" />
            Evaluate
          </Button>
          <Button onClick={handleComputeGraph} className="flex-1">
            <GitGraph className="mr-2 h-4 w-4" />
            Compute Graph
          </Button>
        </div>
      )}

      {showEvaluation && (
        <EvaluationChart data={mockEvaluation} />
      )}

      {showGraph && (
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Computation Graph</h3>
              <Select value={selectedGraphType} onValueChange={setSelectedGraphType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {answerTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedGraphType && <ComputationGraph type={selectedGraphType} />}
          </div>
        </Card>
      )}

      <Button variant="outline" onClick={handleClear} className="w-full">
        <RefreshCcw className="mr-2 h-4 w-4" />
        Clear
      </Button>
    </div>
  );
}