import { Matrix, CanvasPosition, BlockColor } from "../types";
import produce from "immer";
import { SetStateAction } from "react";
import { RESOLUTION } from "../config";

export function applyFill(
  matrix: Matrix,
  setMatrix: (action: SetStateAction<Matrix>) => void,
  state: {
    toolPosition: CanvasPosition;
    color: BlockColor;
  }
) {
  setMatrix(
    produce((draft: Matrix) => {
      // We're assuming fill is always 1x1 since that makes sense,
      // e.g. you can only pick one color at a time to fill
      const startCoords = { x: state.toolPosition.x, y: state.toolPosition.y };
      const targetColor = draft[startCoords.y][startCoords.x];
      const replacementColor = state.color;

      if (targetColor === replacementColor) {
        return;
      }

      function colorBlock({ x, y }: { x: number; y: number }) {
        draft[y][x] = replacementColor;
      }

      function blockAt({ x, y }: { x: number; y: number }) {
        return draft[y][x];
      }

      colorBlock({ x: startCoords.x, y: startCoords.y });
      const queue = [startCoords];

      const maxIndex = RESOLUTION - 1;

      while (queue.length > 0) {
        const job = queue.shift();

        if (!job) {
          break;
        }

        if (job.x > 0) {
          const leftCoords = { x: job.x - 1, y: job.y };
          if (blockAt(leftCoords) === targetColor) {
            colorBlock(leftCoords);
            queue.push(leftCoords);
          }
        }

        if (job.x < maxIndex) {
          const rightCoords = { x: job.x + 1, y: job.y };
          if (blockAt(rightCoords) === targetColor) {
            colorBlock(rightCoords);
            queue.push(rightCoords);
          }
        }

        if (job.y > 0) {
          const topCoords = { x: job.x, y: job.y - 1 };
          if (blockAt(topCoords) === targetColor) {
            colorBlock(topCoords);
            queue.push(topCoords);
          }
        }

        if (job.y < maxIndex) {
          const topCoords = { x: job.x, y: job.y + 1 };
          if (blockAt(topCoords) === targetColor) {
            colorBlock(topCoords);
            queue.push(topCoords);
          }
        }
      }
    })
  );
}
