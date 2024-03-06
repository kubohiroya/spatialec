import { GridItemTypes } from '/app/models/GridItemType';
import { Layers } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const LayersButton: FloatingButtonItem = {
  layout: {
    i: 'LayersButton',
    x: 0,
    y: 7,
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
    id: 'LayersButton',
    type: GridItemTypes.FloatingButton,
    bindToPanelId: 'LayersPanel',
    tooltip: 'Open Layers Panel',
    icon: <Layers />,
  },
};
