export interface StreamFormat {
  id: string;
  object: string;
  created: Date | number;
  model: 'gpt-3.5-turbo-0301';
  choices: [
    {
      delta: {
        content?: string;
      };
      index?: number;
      finish_reason?: null | string;
    }
  ];
}
