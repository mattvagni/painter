import React from "react";
import { Matrix } from "../types";
import { Layer, Rect } from "react-konva";
import { BLOCK_SIZE } from "../config";

interface Props {
  matrix: Matrix;
  canvasColor: string;
}

export const CanvasBlocks = React.memo((props: Props) => {
  return (
    <Layer>
      {props.matrix.map((row, rowIdx) => {
        return row.map((color, colIdx) => {
          return (
            <Rect
              key={`${rowIdx}.${colIdx}`}
              width={BLOCK_SIZE}
              height={BLOCK_SIZE}
              x={colIdx * BLOCK_SIZE}
              y={rowIdx * BLOCK_SIZE}
              fill={color || props.canvasColor}
            />
          );
        });
      })}
    </Layer>
  );
});
