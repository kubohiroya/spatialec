import { GridItemTypes } from '/app/models/GridItemType';
import { GridOn } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const MatricesButton: FloatingButtonItem = {
  layout: {
    i: 'MatricesButton',
    x: 0,
    y: 5,
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
    id: 'MatricesButton',
    type: GridItemTypes.FloatingButton,
    bindToPanelId: 'MatricesPanel',
    tooltip: 'Open Matrices Panel',
    icon: <GridOn />,
  },
};
