import { GridItemTypes } from '/app/models/GridItemType';
import { Info } from '@mui/icons-material';
import React from 'react';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';
import { RESIZE_HANDLES } from '/app/pages/Sim/gridItems/Constants';
import { ROW_HEIGHT } from '/app/pages/Sim/DesktopConstants';

export const InfoPanel: FloatingPanelItem = {
  layout: {
    i: 'InfoPanel',
    x: 10,
    y: 0,
    w: 5,
    h: 3,
    minW: 5,
    minH: 3,
    resizeHandles: RESIZE_HANDLES,
    isDraggable: true,
    isResizable: true,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'InfoPanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Information',
    icon: <Info />,
    titleBarMode: 'win',
    rowHeight: ROW_HEIGHT,
    bindToButtonId: 'InfoButton',
  },
};
