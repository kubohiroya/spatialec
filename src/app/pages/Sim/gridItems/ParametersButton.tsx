import { GridItemTypes } from "/app/models/GridItemType";
import { Tune } from "@mui/icons-material";
import React from "react";
import { FloatingButtonItem } from "/app/models/FloatingButtonItem";
import { LayoutDefault } from "../LayoutDefault";

export function ParametersButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'ParametersButton',
      x: 0,
      y: props?.y ?? 3,
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
      id: 'ParametersButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'ParametersPanel',
      tooltip: 'Open Parameters Panel',
      icon: <Tune />,
      onClick: props?.onClick,
    },
  };
}
