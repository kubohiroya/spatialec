import { GridItemTypes } from "/app/models/GridItemType";
import { BarChart } from "@mui/icons-material";
import React from "react";
import { FloatingButtonItem } from "/app/models/FloatingButtonItem";
import { LayoutDefault } from "/app/pages/Sim/LayoutDefault";

export function ChartButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'ChartButton',
      x: props?.x ?? 0,
      y: props?.y ?? 6,
      w: props?.w ?? 1,
      h: props?.h ?? 1,
      isDraggable: true,
      isResizable: false,
      resizeHandles: [],
      enabled: props?.enabled ?? true,
      shown: props?.shown ?? true,
      maximized: false,
    },
    resource: {
      id: 'ChartButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'ChartPanel',
      tooltip: 'Open Chart Panel',
      icon: <BarChart />,
      onClick: props?.onClick,
    },
  };
}
