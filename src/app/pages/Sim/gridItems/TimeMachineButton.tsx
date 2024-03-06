import { GridItemTypes } from '/app/models/GridItemType';
import { History } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const TimeMachineButton: FloatingButtonItem = {
  layout: {
    i: 'TimeMachineButton',
    x: 0,
    y: 8,
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
    id: 'TimeMachineButton',
    type: GridItemTypes.FloatingButton,
    bindToPanelId: 'TimeMachinePanel',
    tooltip: 'Open TimeMachine Panel',
    icon: <History />,
  },
};
