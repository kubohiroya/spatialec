import { GridItemTypes } from "/app/models/GridItemType";
import React from "react";
import { Redo } from "@mui/icons-material";

import { FloatingButtonItem } from "/app/models/FloatingButtonItem";
import { LayoutDefault } from "/app/pages/Sim/LayoutDefault";

export function RedoButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'RedoButton',
      x: 0,
      y: props?.y ?? 0,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      maximized: false,
    },
    resource: {
      id: 'RedoButton',
      type: GridItemTypes.FloatingButton,
      tooltip: 'redo',
      icon: <Redo />,
      onClick: props?.onClick,
    },
  };
}
