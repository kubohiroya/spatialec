import { GridItemTypes } from "/app/models/GridItemType";
import { Edit } from "@mui/icons-material";
import React from "react";
import { FloatingButtonItem } from "/app/models/FloatingButtonItem";
import { LayoutDefault } from "../LayoutDefault";

export function EditButton(props: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'EditButton',
      x: props?.x ?? 0,
      y: props?.y ?? 2,
      w: props?.w ?? 1,
      h: props?.h ?? 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      maximized: false,
    },
    resource: {
      id: 'EditButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'EditPanel',
      tooltip: 'Open Edit Panel',
      icon: <Edit />,
      onClick: props?.onClick,
    },
  };
}
