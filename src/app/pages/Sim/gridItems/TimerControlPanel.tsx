import { GridItemTypes } from '/app/models/GridItemType';
import { Timer } from '@mui/icons-material';
import React from 'react';
import {
  RESIZE_HANDLES,
  ROW_HEIGHT,
} from '/app/pages/Sim/SimDesktopComponent';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';
import { LayoutDefault } from '/app/pages/Sim/LayoutDefault';

export function TimerControlPanel(props?: LayoutDefault): FloatingPanelItem {
  return {
    layout: {
      i: 'TimerControlPanel',
      x: props?.x ?? 1,
      y: props?.y ?? 9,
      w: props?.w ?? 8,
      h: props?.h ?? 4,
      minW: 8,
      minH: 4,
      isDraggable: true,
      isResizable: true,
      resizeHandles: RESIZE_HANDLES,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      maximized: false,
    },
    resource: {
      id: 'TimerControlPanel',
      type: GridItemTypes.FloatingPanel,
      title: 'Timer Control',
      icon: <Timer />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      bindToButtonId: 'TimerControlButton',
    },
  };
}
