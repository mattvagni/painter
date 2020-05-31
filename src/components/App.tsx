import React, { useState, useEffect, useCallback } from "react";
import {
  Tool,
  ToolStatus,
  Matrix,
  CanvasPosition,
  BlockColor,
  PixelPosition,
} from "../types";
import { Canvas } from "./Canvas";
import { RESOLUTION, BLOCK_SIZE, CANVAS_SIZE } from "../config";
import { doTimes } from "../utils";
import { Tools } from "./Tools";
import { applyColor } from "../drawing/applyColor";
import { applyFill } from "../drawing/applyFill";
import { Layout } from "./Layout";

function calculateToolPosition({
  mouseX,
  mouseY,
  canvasX,
  canvasY,
  toolSize,
}: {
  mouseX: number;
  mouseY: number;
  canvasX: number;
  canvasY: number;
  toolSize: number;
}): CanvasPosition {
  const relativeX = mouseX - canvasX;
  const relativeY = mouseY - canvasY;

  const pixelSize = BLOCK_SIZE * toolSize;

  let adjustedX = relativeX;
  let adjustedY = relativeY;

  // If the brush size is 'event' then it has to be
  // positioned at the closes 'intersection' of the
  // grid so that it aligns with each block. Otherwise it
  // to the nearest block.
  if (toolSize % 2 === 0) {
    adjustedX = Math.round(relativeX / BLOCK_SIZE) * BLOCK_SIZE;
    adjustedY = Math.round(relativeY / BLOCK_SIZE) * BLOCK_SIZE;
  } else {
    adjustedX =
      Math.floor(adjustedX / BLOCK_SIZE) * BLOCK_SIZE + BLOCK_SIZE / 2;
    adjustedY =
      Math.floor(adjustedY / BLOCK_SIZE) * BLOCK_SIZE + BLOCK_SIZE / 2;
  }

  // Make sure it doesn't go off the left or top edge
  adjustedX = Math.max(adjustedX, pixelSize / 2);
  adjustedY = Math.max(adjustedY, pixelSize / 2);

  // Make sure it doesn't go off the right or bottom edge
  adjustedX = Math.min(adjustedX, CANVAS_SIZE - pixelSize / 2);
  adjustedY = Math.min(adjustedY, CANVAS_SIZE - pixelSize / 2);

  const x = Math.round((adjustedX - pixelSize / 2) / BLOCK_SIZE);
  const y = Math.round((adjustedY - pixelSize / 2) / BLOCK_SIZE);

  return { x, y };
}

function createEmptyMatrix(): Matrix {
  let matrix: Matrix = [];

  doTimes(RESOLUTION, () => {
    const row: BlockColor[] = [];

    doTimes(RESOLUTION, () => {
      row.push(null);
    });

    matrix.push(row);
  });

  return matrix;
}

export function App() {
  const [mouseStatus, setMouseStatus] = useState<"down" | "up">("up");
  const [tool, setTool] = useState<Tool>("brush");
  const [toolSize, setToolSize] = useState(2);
  const [toolMirroring, setToolMirroring] = useState(false);
  const [toolPosition, setToolPosition] = useState<CanvasPosition>({
    x: 0,
    y: 0,
  });
  const [toolStatus, setToolStatus] = useState<ToolStatus>("inactive");

  const [canvasPosition, setCanvasPosition] = useState<PixelPosition>({
    x: 0,
    y: 0,
  });

  const [color, setColor] = useState("#4d5061");
  const [canvasColor] = useState("#fff");
  const [matrix, setMatrix] = useState<Matrix>(createEmptyMatrix());

  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const applyTool = useCallback(() => {
    if (toolStatus !== "active") {
      return;
    }

    if (tool === "brush") {
      applyColor(setMatrix, {
        toolSize,
        toolPosition,
        toolMirroring,
        color,
      });
    }

    if (tool === "eraser") {
      applyColor(setMatrix, {
        toolSize,
        toolPosition,
        toolMirroring,
        color: null,
      });
    }

    if (tool === "fill") {
      applyFill(matrix, setMatrix, {
        toolPosition,
        color,
      });
    }

    if (tool === "color-picker") {
      setColor(matrix[toolPosition.y][toolPosition.x] || canvasColor);
    }
  }, [
    canvasColor,
    color,
    matrix,
    tool,
    toolMirroring,
    toolPosition,
    toolSize,
    toolStatus,
  ]);

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      const { x, y } = calculateToolPosition({
        mouseX: event.pageX,
        mouseY: event.pageY,
        canvasX: canvasPosition.x,
        canvasY: canvasPosition.y,
        toolSize,
      });

      // Only set state if something changed - this feels way better
      // than throttling mouse move events.
      if (toolPosition.x !== x || toolPosition.y !== y) {
        setToolPosition({ x, y });
      }

      if (mouseStatus === "up") {
        return;
      }

      applyTool();
    },
    [
      applyTool,
      canvasPosition.x,
      canvasPosition.y,
      mouseStatus,
      toolPosition.x,
      toolPosition.y,
      toolSize,
    ]
  );

  const onMouseDown = useCallback(() => {
    setMouseStatus("down");
    applyTool();
  }, [applyTool]);

  const onMouseUp = useCallback(() => {
    setMouseStatus("up");
  }, [setMouseStatus]);

  useEffect(() => {
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [onMouseDown, onMouseMove, onMouseUp]);

  return (
    <Layout
      main={
        <Canvas
          matrix={matrix}
          color={color}
          canvasColor={canvasColor}
          toolPosition={toolPosition}
          toolSize={toolSize}
          toolStatus={toolStatus}
          toolMirroring={toolMirroring}
          onMouseEnter={() => setToolStatus("active")}
          onMouseLeave={() => setToolStatus("inactive")}
          onLayout={setCanvasPosition}
          onPreviewChange={setPreviewImageUrl}
        />
      }
      side={
        <>
          <img
            alt="preview"
            src={previewImageUrl}
            width="152"
            height="152"
            style={{ marginBottom: 18 }}
          />
          <Tools
            tool={tool}
            toolSize={toolSize}
            toolMirroring={toolMirroring}
            color={color}
            onColorChange={setColor}
            onToolChange={setTool}
            onSizeChange={setToolSize}
            onToolMirroringChange={setToolMirroring}
          />
        </>
      }
    />
  );
}
