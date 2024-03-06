import { GridItemTypes } from '/app/models/GridItemType';
import { GridOn } from '@mui/icons-material';
import React from 'react';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';
import { RESIZE_HANDLES } from '/app/pages/Sim/gridItems/Constants';
import { ROW_HEIGHT } from '/app/pages/Sim/DesktopConstants';

export const MatricesPanel: FloatingPanelItem = {
  layout: {
    i: 'MatricesPanel',
    x: 10,
    y: -9,
    w: 23,
    h: 9,
    isDraggable: true,
    isResizable: true,
    resizeHandles: RESIZE_HANDLES,
    shown: true,
    enabled: true,
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
