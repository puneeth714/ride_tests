export type TestCase = {
  id: string;
  title: string;
  steps: string[];
  expectedResult: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  // Internal state for triggering animations
  _version?: number;
};

export type ContextSource = {
  id: string;
  type: 'document' | 'api' | 'git';
  name: string;
  description: string;
};
