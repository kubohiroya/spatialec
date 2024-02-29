import { GridItemTypes } from '/app/models/GridItemType';
import { Timer } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';
import { LayoutDefault } from '/app/pages/Sim/LayoutDefault';

export function TimerControlButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'TimerControlButton',
      x: props?.x ?? 0,
      y: props?.y ?? 4,
      w: props?.w ?? 1,
      h: props?.h ?? 1,
      isDraggable: true,
      isResizable: false,
      resizeHandles: [],
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      maximized: false,
    },
    resource: {
      id: 'TimerControlButton',
      type: GridItemTypes.FloatingButton,
      bindToPanelId: 'TimerControlPanel',
      tooltip: 'Open TimerControl Panel',
      icon: <Timer />,
    },
  };
}
