import { GridItemTypes } from "/app/models/GridItemType";
import { BarChart } from "@mui/icons-material";
import React from "react";
import { RESIZE_HANDLES, ROW_HEIGHT } from "../SimDesktopComponent";

import { FloatingPanelItem } from "/app/models/FloatingPanelItem";
import { LayoutDefault } from "/app/pages/Sim/LayoutDefault";

export function ChartPanel(props: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'ChartPanel',
      x: props?.x ?? 22,
      y: props?.y ?? 0,
      w: props?.w ?? 10,
      h: props?.h ?? 10,
      isDraggable: true,
      isResizable: true,
      resizeHandles: RESIZE_HANDLES,
      enabled: props?.enabled ?? true,
      shown: props?.shown ?? true,
      maximized: false,
    },
    resource: {
      id: 'ChartPanel',
      type: GridItemTypes.FloatingPanel,
      title: 'Chart',
      icon: <BarChart />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      bindToButtonId: 'ChartButton',
    },
  };
}
