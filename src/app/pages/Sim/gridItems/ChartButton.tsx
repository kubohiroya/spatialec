import { GridItemTypes } from '/app/models/GridItemType';
import { BarChart } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const ChartButton: FloatingButtonItem = {
  layout: {
    i: 'ChartButton',
    x: 0,
    y: 6,
    w: 1,
    h: 1,
    isDraggable: true,
    isResizable: false,
    resizeHandles: [],
    enabled: false,
    shown: true,
    maximized: false,
  },
  resource: {
    id: 'ChartButton',
    type: GridItemTypes.FloatingButton,
    bindToPanelId: 'ChartPanel',
    tooltip: 'Open Chart Panel',
    icon: <BarChart />,
  },
};
