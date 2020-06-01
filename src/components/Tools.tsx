import React from "react";
import { Tool } from "../types";
import { ChromePicker } from "react-color";

interface Props {
  tool: Tool;
  toolSize: number;
  toolMirroring: boolean;
  color: string;
  onToolChange: (tool: Tool) => void;
  onSizeChange: (size: number) => void;
  onColorChange: (color: string) => void;
  onToolMirroringChange: (toolMirroring: boolean) => void;
}

export function Tools(props: Props) {
  const canSizeBeChanged =
    props.tool !== "fill" && props.tool !== "color-picker";

  return (
    <div style={{ marginTop: 14 }}>
      {/* Tools */}
      <button
        disabled={props.tool === "brush"}
        onClick={() => props.onToolChange("brush")}
      >
        brush
      </button>
      <button
        disabled={props.tool === "eraser"}
        onClick={() => props.onToolChange("eraser")}
      >
        eraser
      </button>
      <button
        disabled={props.tool === "fill"}
        onClick={() => {
          // Filling can only really logically work if are not mirroring
          // and have a single tool selected.
          props.onToolChange("fill");
          props.onSizeChange(1);
          props.onToolMirroringChange(false);
        }}
      >
        fill
      </button>
      <button
        disabled={props.tool === "color-picker"}
        onClick={() => {
          // Filling can only really logically work if are not mirroring
          // and have a single tool selected.
          props.onToolChange("color-picker");
          props.onSizeChange(1);
          props.onToolMirroringChange(false);
        }}
      >
        color picker
      </button>

      <br />
      <br />

      <button
        disabled={!props.toolMirroring}
        onClick={() => props.onToolMirroringChange(false)}
      >
        normal
      </button>
      <button
        disabled={props.toolMirroring}
        onClick={() => props.onToolMirroringChange(true)}
      >
        mirror
      </button>

      <br />
      <br />

      {/* Sizes */}
      <button
        disabled={canSizeBeChanged === false || props.toolSize === 1}
        onClick={() => props.onSizeChange(1)}
      >
        1
      </button>
      <button
        disabled={canSizeBeChanged === false || props.toolSize === 2}
        onClick={() => props.onSizeChange(2)}
      >
        2
      </button>
      <button
        disabled={canSizeBeChanged === false || props.toolSize === 3}
        onClick={() => props.onSizeChange(3)}
      >
        3
      </button>
      <button
        disabled={canSizeBeChanged === false || props.toolSize === 4}
        onClick={() => props.onSizeChange(4)}
      >
        4
      </button>

      <br />
      <br />

      <ChromePicker
        color={props.color}
        onChange={(color) => {
          props.onColorChange(color.hex);
        }}
      />
    </div>
  );
}
