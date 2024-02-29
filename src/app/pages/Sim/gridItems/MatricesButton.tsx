import { GridItemTypes } from "/app/models/GridItemType";
import { GridOn } from "@mui/icons-material";
import React from "react";
import { FloatingButtonItem } from "/app/models/FloatingButtonItem";
import { LayoutDefault } from "/app/pages/Sim/LayoutDefault";

export function MatricesButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'MatricesButton',
      x: 0,
      y: props?.y ?? 5,
      w: 1,
      h: 1,
      isDraggable: true,
      isResizable: false,
      resizeHandles: [],
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      maximized: false,

    },
    resource: {
      id: 'MatricesButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'MatricesPanel',
      tooltip: 'Open Matrices Panel',
      icon: <GridOn />,
      onClick: props?.onClick,
    },
  };
}
