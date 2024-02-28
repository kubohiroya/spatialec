import { GridItemTypes } from "/app/models/GridItemType";
import { Info } from "@mui/icons-material";
import React from "react";
import { FloatingButtonItem } from "/app/models/FloatingButtonItem";
import { LayoutDefault } from "/app/pages/Sim/LayoutDefault";

export function InfoButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'InfoButton',
      x: 0,
      y: 9,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
    },
    resource: {
      id: 'InfoButton',
      type: GridItemTypes.FloatingButton,
      tooltip: 'Info',
      icon: <Info />,
      bindToPanelId: 'InfoPanel',
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      onClick: props?.onClick,
    },
  };
}
