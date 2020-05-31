import React, { useRef, useEffect, useState } from "react";
import { Stage } from "react-konva";
import {
  Matrix,
  CanvasPosition,
  ToolStatus,
  BlockColor,
  PixelPosition,
} from "../types";
import { CANVAS_SIZE } from "../config";
import { CanvasGrid } from "./CanvasGrid";
import { CanvasTool } from "./CanvasTool";
import { CanvasBlocks } from "./CanvasBlocks";

interface Props {
  matrix: Matrix;
  toolSize: number;
  color: BlockColor;
  canvasColor: string;
  toolPosition: CanvasPosition;
  toolStatus: ToolStatus;
  toolMirroring: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLayout: (position: PixelPosition) => void;
  onPreviewChange: (previewImage: string) => void;
}

export function Canvas(props: Props) {
  const { onLayout } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Stage | null>(null);
  const [rect, setRect] = useState<PixelPosition>({ x: 0, y: 0 });

  const getDomRect = () => {
    if (!wrapperRef.current) {
      return;
    }

    const rect = wrapperRef.current.getBoundingClientRect();
    setRect({ x: rect.x, y: rect.y });
  };

  useEffect(() => {
    getDomRect();
  }, []);

  const { onPreviewChange, matrix } = props;

  useEffect(() => {
    const frame = setTimeout(() => {
      requestAnimationFrame(() => {
        if (!stageRef.current) {
          return;
        }
        onPreviewChange(stageRef.current.getStage().toDataURL());
      });
    }, 50);

    return () => {
      clearInterval(frame);
    };
  }, [matrix, onPreviewChange]);

  useEffect(() => {
    onLayout(rect);
  }, [onLayout, rect]);

  return (
    <div
      ref={wrapperRef}
      style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, position: "relative" }}
    >
      {/* Drawing canvas */}
      <Stage
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        ref={stageRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <CanvasBlocks matrix={props.matrix} canvasColor={props.canvasColor} />
      </Stage>
      {/* UI canvas */}
      <Stage
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <CanvasGrid />
        <CanvasTool
          toolPosition={props.toolPosition}
          toolSize={props.toolSize}
          toolStatus={props.toolStatus}
          toolMirroring={props.toolMirroring}
        />
      </Stage>
    </div>
  );
}
