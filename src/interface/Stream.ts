// export interface ChunkObj {
//   data?: {
//     choices: [
//       {
//         delta: {
//           content?: string;
//         };
//       }
//     ];
//   };
// }

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
