// A tiny bridge so a plain HTML drop event on the canvas wrapper can reach into
// the react-three-fiber scene and place a part exactly where the cursor is.
export const dropBridge: {
  place: ((clientX: number, clientY: number, catalogId: string) => void) | null;
} = { place: null };
