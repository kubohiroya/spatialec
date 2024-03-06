import { GridItemTypes } from '/app/models/GridItemType';
import { FolderOpen } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const InputOutputButton: FloatingButtonItem = {
  layout: {
    i: 'InputOutputButton',
    x: 0,
    y: 1,
    w: 1,
    h: 1,
    resizeHandles: [],
    isDraggable: true,
    isResizable: false,
    shown: true,
    enabled: false,
    maximized: false,
  },
  resource: {
    id: 'InputOutputButton',
    type: GridItemTypes.FloatingButton,
    bindToPanelId: 'InputOutputPanel',
    tooltip: 'Open Input/Output Panel',
    icon: <FolderOpen />,
  },
};
