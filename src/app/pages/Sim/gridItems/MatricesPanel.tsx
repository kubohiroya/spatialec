import { GridItemTypes } from "/app/models/GridItemType";
import { GridOn } from "@mui/icons-material";
import React from "react";
import { RESIZE_HANDLES, ROW_HEIGHT } from "/app/pages/Sim/SimDesktopComponent";
import { FloatingPanelItem } from "/app/models/FloatingPanelItem";
import { LayoutDefault } from "/app/pages/Sim/LayoutDefault";

export function MatricesPanel(props?: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'MatricesPanel',
      x: props?.x ?? 10,
      y: props?.y ?? 5,
      w: props?.w ?? 23,
      h: props?.h ?? 9,
      isDraggable: true,
      isResizable: true,
      resizeHandles: RESIZE_HANDLES,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      maximized: false,
    },
    resource: {
      id: 'MatricesPanel',
      type: GridItemTypes.FloatingPanel,
      title: 'Matrices',
      icon: <GridOn />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      bindToButtonId: 'MatricesButton',
    },
  };
}
