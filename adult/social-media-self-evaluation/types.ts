
export interface Question {
  id: number;
  title: string;
  statement: string;
}

export interface ScoreTier {
  range: string;
  label: string;
  description: string;
  minScore: number;
  color: string; // tailwind gradient classes
}
