import { GridItemTypes } from '/app/models/GridItemType';
import { ZoomIn } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const ZoomInButton: FloatingButtonItem = {
  layout: {
    i: 'ZoomInButton',
    x: 0,
    y: -3,
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
    id: 'ZoomInButton',
    type: GridItemTypes.FloatingButton,
    tooltip: 'zoom in',
    icon: <ZoomIn />,
  },
};
