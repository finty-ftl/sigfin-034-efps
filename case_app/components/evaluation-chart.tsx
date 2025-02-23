"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { mockEvaluationComments } from '@/lib/mock-data';

interface EvaluationData {
  name: string;
  CoT: number;
  FermiCoT: number;
  CSRFermiCoT: number;
}

interface EvaluationChartProps {
  data: any;
}

export function EvaluationChart({ data }: EvaluationChartProps) {
  const formatData = () => {
    const metrics = [
      'problem_understanding',
      'decomposition_process_appropriateness',
      'assumption_validity',
      'quantity_scale_consistency',
      'calculation_process_accuracy',
      'uncertainty_consideration',
      'explanation_clarity',
      'comparison_and_validation',
      'final_answer_persuasiveness',
      'suggestion_for_improvement_and_expansion'
    ];

    return metrics.map(metric => ({
      name: metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      CoT: data.CoT[metric].score / data.CoT[metric].max_score,
      FermiCoT: data.FermiCoT[metric].score / data.FermiCoT[metric].max_score,
      CSRFermiCoT: data.CSRFermiCoT[metric].score / data.CSRFermiCoT[metric].max_score,
    }));
  };

  const answerTypes = ['CoT', 'FermiCoT', 'CSRFermiCoT'];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Evaluation Results</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {answerTypes.map((type) => (
            <Card key={type} className="p-4">
              <h4 className="font-medium mb-2">{type}</h4>
              <p className="text-lg font-semibold">
                Score: {data[type].scaled_ensemble_weighted_score.toFixed(3)}
              </p>
            </Card>
          ))}
        </div>
        <div className="w-full h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={formatData()}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={30} domain={[0, 1]} />
              <Radar
                name="CoT"
                dataKey="CoT"
                stroke="hsl(221, 83%, 53%)"
                fill="hsl(221, 83%, 53%)"
                fillOpacity={0.3}
              />
              <Radar
                name="FermiCoT"
                dataKey="FermiCoT"
                stroke="hsl(45, 93%, 47%)"
                fill="hsl(45, 93%, 47%)"
                fillOpacity={0.3}
              />
              <Radar
                name="CSRFermiCoT"
                dataKey="CSRFermiCoT"
                stroke="hsl(142, 76%, 36%)"
                fill="hsl(142, 76%, 36%)"
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">General Review</h3>
        <div className="grid grid-cols-3 gap-4">
          {answerTypes.map((type) => (
            <Card key={type} className="p-4">
              <h4 className="font-medium mb-2">{type}</h4>
              <p className="text-sm text-muted-foreground">{mockEvaluationComments[type]}</p>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}