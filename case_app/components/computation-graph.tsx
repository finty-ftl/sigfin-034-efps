"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Mermaid from '@/components/mermaid';

interface ComputationGraphProps {
  type: string;
}

const graphData = {
  CoT: {
    nodes: [
      { id: "A", label: "Average Cost per Unit (CPU) ($)", value: 150 },
      { id: "B", label: "Estimated Number of Units Sold", value: 500 },
      { id: "C", label: "Initial Advertising Cost ($)", operation: "A * B", value: 75000 },
      { id: "D", label: "Scaling Factor", value: 6.67 },
      { id: "E", label: "Total Marketing & Advertising Budget ($)", operation: "C * D", value: 500000 }
    ],
    edges: [
      { from: "A", to: "C", operation: "*" },
      { from: "B", to: "C", operation: "*" },
      { from: "C", to: "E", operation: "*" },
      { from: "D", to: "E", operation: "*" }
    ],
    description: "This calculation graph estimates the total initial marketing and advertising budget for a new product launch. The calculation begins with the average cost per advertising unit (CPU) and the estimated number of units sold to determine the initial advertising cost. This cost is then scaled up by a factor to account for additional marketing expenses, resulting in a total budget estimate of $500,000."
  },
  FermiCoT: {
    nodes: [
      { id: "A1", label: "Cost per Unit (Online Ads) ($)", value: 1.50 },
      { id: "A2", label: "Cost per Unit (Offline Ads) ($)", value: 3.00 },
      { id: "A3", label: "Cost per Unit (Social Media Ads) ($)", value: 0.75 },
      { id: "B", label: "Estimated Units Sold per Month", value: 10000 },
      { id: "C1", label: "Total Ad Spend (Online Ads) ($)", operation: "A1 * B", value: 15000 },
      { id: "C2", label: "Total Ad Spend (Offline Ads) ($)", operation: "A2 * B", value: 30000 },
      { id: "C3", label: "Total Ad Spend (Social Media Ads) ($)", operation: "A3 * B", value: 7500 },
      { id: "D", label: "Total Monthly Advertising Cost ($)", operation: "C1 + C2 + C3", value: 52500 },
      { id: "E1", label: "Lower Bound Units Sold per Month", value: 5000 },
      { id: "E2", label: "Upper Bound Units Sold per Month", value: 20000 },
      { id: "F1", label: "Lower Bound Advertising Cost ($)", operation: "E1 * (A1 + A2 + A3)", value: 7500 },
      { id: "F2", label: "Upper Bound Advertising Cost ($)", operation: "E2 * (A1 + A2 + A3)", value: 30000 },
      { id: "G", label: "Final Estimated Advertising Cost ($)", value: 20000 }
    ],
    edges: [
      { from: "A1", to: "C1", operation: "*" },
      { from: "B", to: "C1", operation: "*" },
      { from: "A2", to: "C2", operation: "*" },
      { from: "B", to: "C2", operation: "*" },
      { from: "A3", to: "C3", operation: "*" },
      { from: "B", to: "C3", operation: "*" },
      { from: "C1", to: "D", operation: "+" },
      { from: "C2", to: "D", operation: "+" },
      { from: "C3", to: "D", operation: "+" },
      { from: "A1", to: "F1", operation: "+" },
      { from: "A2", to: "F1", operation: "+" },
      { from: "A3", to: "F1", operation: "+" },
      { from: "E1", to: "F1", operation: "*" },
      { from: "A1", to: "F2", operation: "+" },
      { from: "A2", to: "F2", operation: "+" },
      { from: "A3", to: "F2", operation: "+" },
      { from: "E2", to: "F2", operation: "*" },
      { from: "F1", to: "G", operation: "range lower bound" },
      { from: "F2", to: "G", operation: "range upper bound" }
    ],
    description: "This calculation graph estimates the initial monthly advertising cost for a new product launch. The cost is broken down into three advertising channels: online, offline, and social media. The total advertising cost is calculated by multiplying the cost per unit for each channel by the estimated units sold per month. Lower and upper bounds are provided based on the range of estimated units sold. The final estimated cost is approximately $20,000."
  },
  CSRFermiCoT: {
    nodes: [
      { id: "A1", label: "Digital Ad Impressions", value: 300000 },
      { id: "A2", label: "Cost per Digital Impression ($)", value: 0.03 },
      { id: "B1", label: "Number of Print Ads", value: 10 },
      { id: "B2", label: "Cost per Print Ad ($)", value: 1500 },
      { id: "C1", label: "Number of In-Person Events", value: 3 },
      { id: "C2", label: "Cost per Event ($)", value: 5000 },
      { id: "D1", label: "Digital Marketing Cost ($)", operation: "A1 * A2", value: 9000 },
      { id: "D2", label: "Print Advertising Cost ($)", operation: "B1 * B2", value: 15000 },
      { id: "D3", label: "In-Person Promotion Cost ($)", operation: "C1 * C2", value: 15000 },
      { id: "E", label: "Total Initial Advertising Cost ($)", operation: "D1 + D2 + D3", value: 39000 },
      { id: "F1", label: "Digital Marketing Cost Lower Bound ($)", operation: "D1 * 0.84", value: 7560 },
      { id: "F2", label: "Digital Marketing Cost Upper Bound ($)", operation: "D1 * 1.16", value: 10440 },
      { id: "G1", label: "Print Advertising Cost Lower Bound ($)", operation: "D2 * 0.70", value: 10500 },
      { id: "G2", label: "Print Advertising Cost Upper Bound ($)", operation: "D2 * 1.30", value: 19500 }
    ],
    edges: [
      { from: "A1", to: "D1", operation: "*" },
      { from: "A2", to: "D1", operation: "*" },
      { from: "B1", to: "D2", operation: "*" },
      { from: "B2", to: "D2", operation: "*" },
      { from: "C1", to: "D3", operation: "*" },
      { from: "C2", to: "D3", operation: "*" },
      { from: "D1", to: "E", operation: "+" },
      { from: "D2", to: "E", operation: "+" },
      { from: "D3", to: "E", operation: "+" },
      { from: "D1", to: "F1", operation: "*" },
      { from: "D1", to: "F2", operation: "*" },
      { from: "D2", to: "G1", operation: "*" },
      { from: "D2", to: "G2", operation: "*" }
    ],
    description: "This calculation graph estimates the initial advertising cost for launching a new product across digital, print, and in-person channels. The cost is calculated by multiplying impressions, ad counts, or event numbers by their respective unit costs. The total initial cost is the sum of digital, print, and in-person promotion costs. Sensitivity analysis shows variations for digital and print advertising costs."
  }
};

const generateMermaidGraph = (data: any) => {
  if (!data) return '';

  const { nodes, edges, description } = data;
  let mermaidCode = 'graph TD\n';

  // Add nodes
  nodes.forEach((node: any) => {
    const label = `${node.label}${node.value ? `\n(${node.value})` : ''}`;
    mermaidCode += `    ${node.id}["${label}"]\n`;
  });

  // Add edges
  edges.forEach((edge: any) => {
    const operationSymbol = edge.operation === '*' ? '×' : 
                           edge.operation === '/' ? '÷' :
                           edge.operation === '+' ? '+' :
                           edge.operation === 'range' ? '→' : edge.operation;
    mermaidCode += `    ${edge.from} -->|${operationSymbol}| ${edge.to}\n`;
  });

  return mermaidCode;
};

export function ComputationGraph({ type }: ComputationGraphProps) {
  const [mermaidGraph, setMermaidGraph] = useState('');

  useEffect(() => {
    if (type && graphData[type]) {
      setMermaidGraph(generateMermaidGraph(graphData[type]));
    }
  }, [type]);

  if (!type || !graphData[type]) {
    return <div className="text-muted-foreground">Please select a graph type</div>;
  }

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto">
        <Mermaid chart={mermaidGraph} />
      </div>
      <div className="text-sm text-muted-foreground">
        <p>{graphData[type].description}</p>
      </div>
    </div>
  );
}