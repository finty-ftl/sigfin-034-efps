"use client";

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart?: string;
}

mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  securityLevel: 'loose',
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#ffffff',
    primaryBorderColor: '#2563eb',
    lineColor: '#64748b',
    secondaryColor: '#475569',
    tertiaryColor: '#94a3b8',
  },
  flowchart: {
    curve: 'basis',
    padding: 20,
    nodeSpacing: 50,
    rankSpacing: 50,
    htmlLabels: true,
  },
});

export default function Mermaid({ chart }: MermaidProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (elementRef.current && chart) {
      const renderChart = async () => {
        try {
          elementRef.current!.innerHTML = '';
          const { svg } = await mermaid.render(`mermaid-svg-${key}`, chart);
          if (elementRef.current) {
            elementRef.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Failed to render mermaid chart:', error);
          if (elementRef.current) {
            elementRef.current.innerHTML = '<p class="text-destructive">Failed to render graph</p>';
          }
        }
      };

      renderChart();
    }
  }, [chart, key]);

  useEffect(() => {
    setKey(prev => prev + 1);
  }, [chart]);

  if (!chart) {
    return <div className="text-muted-foreground">No graph data available</div>;
  }

  return <div ref={elementRef} className="mermaid" />;
}