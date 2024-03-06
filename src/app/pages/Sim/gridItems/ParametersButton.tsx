import { GridItemTypes } from '/app/models/GridItemType';
import { Tune } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const ParametersButton: FloatingButtonItem = {
  layout: {
    i: 'ParametersButton',
    x: 0,
    y: 3,
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
    id: 'ParametersButton',
    type: GridItemTypes.FloatingButton,
    bindToPanelId: 'ParametersPanel',
    tooltip: 'Open Parameters Panel',
    icon: <Tune />,
  },
};
