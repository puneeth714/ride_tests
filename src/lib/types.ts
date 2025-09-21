export type TestCase = {
  id: string;
  title: string;
  steps: string[];
  expectedResult: string;
  priority: 'High' | 'Medium' | 'Low' | string;
  // Internal state for triggering animations
  _version?: number;
};

export type UploadedFile = {
  filename: string;
  dataUri: string;
}

export type ContextSource = {
  name: string;
  type: 'document' | 'api' | 'git' | 'text';
};
