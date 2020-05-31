import { Matrix, CanvasPosition, BlockColor } from "../types";
import produce from "immer";
import { SetStateAction } from "react";
import { RESOLUTION } from "../config";

export function applyColor(
  setMatrix: (action: SetStateAction<Matrix>) => void,
  state: {
    toolSize: number;
    toolPosition: CanvasPosition;
    toolMirroring: boolean;
    color: BlockColor;
  }
) {
  setMatrix(
    produce((draft: Matrix) => {
      const fromX = state.toolPosition.x;
      const toX = fromX + state.toolSize - 1;
      const fromY = state.toolPosition.y;
      const toY = fromY + state.toolSize - 1;

      for (let y = fromY; y <= toY; y++) {
        for (let x = fromX; x <= toX; x++) {
          draft[y][x] = state.color;
        }
      }

      if (!state.toolMirroring) {
        return draft;
      }

      const mirroredFromX = RESOLUTION - state.toolPosition.x - state.toolSize;
      const mirroredToX = mirroredFromX + state.toolSize - 1;

      for (let y = fromY; y <= toY; y++) {
        for (let x = mirroredFromX; x <= mirroredToX; x++) {
          draft[y][x] = state.color;
        }
      }
    })
  );
}
