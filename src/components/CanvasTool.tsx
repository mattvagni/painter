import React from "react";
import { ToolStatus, CanvasPosition } from "../types";
import { Layer, Rect } from "react-konva";
import { BLOCK_SIZE, RESOLUTION } from "../config";

interface Props {
  toolSize: number;
  toolPosition: CanvasPosition;
  toolStatus: ToolStatus;
  toolMirroring: boolean;
}

export const CanvasTool = React.memo((props: Props) => {
  const strokeWidth = 2;
  const size = props.toolSize * BLOCK_SIZE - 2;
  const y = props.toolPosition.y * BLOCK_SIZE + 1;

  return (
    <Layer>
      {props.toolStatus === "active" && (
        <>
          <Rect
            width={size}
            height={size}
            strokeWidth={strokeWidth}
            stroke={"#38b3fc"}
            x={props.toolPosition.x * BLOCK_SIZE + 1}
            y={y}
          />

          {props.toolMirroring && (
            <Rect
              width={size}
              height={size}
              strokeWidth={strokeWidth}
              stroke={"#45c454"}
              x={
                (RESOLUTION - props.toolPosition.x - props.toolSize) *
                  BLOCK_SIZE +
                1
              }
              y={y}
            />
          )}
        </>
      )}
    </Layer>
  );
});
