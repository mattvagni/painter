import React from "react";
import { Layer, Line } from "react-konva";
import { RESOLUTION, CANVAS_SIZE, BLOCK_SIZE } from "../config";
import { doTimes } from "../utils";

interface Line {
  color: string;
  width: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const CanvasGrid = React.memo(() => {
  const lines: Line[] = [];
  const centerLines: Line[] = [];

  doTimes(RESOLUTION, (idx) => {
    const isMajorLine = idx % 8 === 0;
    const isCenterLine = idx > 0 && idx % (RESOLUTION / 2) === 0;
    let offset = BLOCK_SIZE * idx;

    if (isMajorLine) {
      offset = offset - 1;
    }

    const horizontalLine: Line = {
      x1: offset,
      y1: 0,
      x2: offset,
      y2: CANVAS_SIZE,
      color: "#e7eaed",
      width: isMajorLine ? 2 : 1,
    };
    const verticalLine: Line = {
      x1: 0,
      y1: offset,
      x2: CANVAS_SIZE,
      y2: offset,
      color: "#e7eaed",
      width: 1,
    };

    if (isMajorLine) {
      horizontalLine.width = 2;
      verticalLine.width = 2;
    }

    if (isCenterLine) {
      horizontalLine.color = "red";
      verticalLine.color = "red";
    }

    if (isCenterLine) {
      centerLines.push(horizontalLine, verticalLine);
    } else {
      lines.push(horizontalLine, verticalLine);
    }
  });

  return (
    <>
      <Layer>
        {lines.map((line, idx) => (
          <Line
            key={idx}
            points={[line.x1, line.y1, line.x2, line.y2]}
            stroke={line.color}
            strokeWidth={line.width}
          />
        ))}
        {centerLines.map((line, idx) => (
          <Line
            key={"center" + idx}
            points={[line.x1, line.y1, line.x2, line.y2]}
            stroke={line.color}
            strokeWidth={line.width}
          />
        ))}
      </Layer>
    </>
  );
});
