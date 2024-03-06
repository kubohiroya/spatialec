import { GridItemTypes } from '/app/models/GridItemType';
import { ZoomOut } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const ZoomOutButton: FloatingButtonItem = {
  layout: {
    i: 'ZoomOutButton',
    x: 0,
    y: -2,
    w: 1,
    h: 1,
    resizeHandles: [],
    isDraggable: true,
    isResizable: false,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'ZoomOutButton',
    type: GridItemTypes.FloatingButton,
    tooltip: 'zoom out',
    icon: <ZoomOut />,
  },
};
