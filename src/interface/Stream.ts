export enum StreamType {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
}

export interface ChunkObj {
  candidates: [
    {
      content: {
        parts: [
          {
            text: string;
          },
        ];
      };
    },
  ];
}
