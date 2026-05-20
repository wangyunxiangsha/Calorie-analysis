export type RecognitionCandidate = {
  name: string;
  confidence: number;
  foodId: string | null;
  defaultServingG: number;
  servingUnit: string;
  llmEstimate?: {
    calories?: number;
    proteinG?: number;
    carbsG?: number;
    fatG?: number;
    notes?: string;
  };
};

export type RecognitionAnalyzeResult = {
  taskId: string;
  candidates: RecognitionCandidate[];
  needsManualPick: boolean;
  provider: string;
};
