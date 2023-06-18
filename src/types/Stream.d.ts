export interface ChunkObj {
  data: {
    choices: [
      {
        delta: {
          content?: string;
        };
      }
    ];
  };
}
