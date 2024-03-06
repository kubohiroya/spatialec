import { GridItemTypes } from '/app/models/GridItemType';
import { History } from '@mui/icons-material';
import React from 'react';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';
import { RESIZE_HANDLES } from '/app/pages/Sim/gridItems/Constants';
import { ROW_HEIGHT } from '/app/pages/Sim/DesktopConstants';

export const TimeMachinePanel: FloatingPanelItem = {
  layout: {
    i: 'TimeMachinePanel',
    x: -1,
    y: -4,
    w: 20,
    h: 3,
    minW: 10,
    minH: 3,
    isDraggable: true,
    isResizable: true,
    resizeHandles: RESIZE_HANDLES,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'TimeMachinePanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Time Machine',
    icon: <History />,
    titleBarMode: 'win',
    rowHeight: ROW_HEIGHT,
    bindToButtonId: 'TimeMachineButton',
  },
};
