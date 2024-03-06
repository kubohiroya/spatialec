import { GridItemTypes } from '/app/models/GridItemType';
import { BarChart } from '@mui/icons-material';
import React from 'react';

import { FloatingPanelItem } from '/app/models/FloatingPanelItem';
import { ROW_HEIGHT } from '/app/pages/Sim/DesktopConstants';
import { RESIZE_HANDLES } from '/app/pages/Sim/gridItems/Constants';

export const ChartPanel: FloatingPanelItem = {
  layout: {
    i: 'ChartPanel',
    x: 22,
    y: 0,
    w: 10,
    h: 10,
    isDraggable: true,
    isResizable: true,
    resizeHandles: RESIZE_HANDLES,
    enabled: true,
    shown: true,
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
