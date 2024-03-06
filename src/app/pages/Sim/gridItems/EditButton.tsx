import { GridItemTypes } from '/app/models/GridItemType';
import { Edit } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const EditButton: FloatingButtonItem = {
  layout: {
    i: 'EditButton',
    x: 0,
    y: 2,
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
    id: 'EditButton',
    type: GridItemTypes.FloatingButton,
    bindToPanelId: 'EditPanel',
    tooltip: 'Open Edit Panel',
    icon: <Edit />,
  },
};
