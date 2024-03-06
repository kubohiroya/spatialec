import { GridItemTypes } from '/app/models/GridItemType';
import { Timer } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const TimerControlButton: FloatingButtonItem = {
  layout: {
    i: 'TimerControlButton',
    x: 0,
    y: 9,
    w: 1,
    h: 1,
    isDraggable: true,
    isResizable: false,
    resizeHandles: [],
    shown: true,
    enabled: false,
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
