import { GridItemTypes } from '/app/models/GridItemType';
import { FolderOpen } from '@mui/icons-material';
import React from 'react';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';
import { ROW_HEIGHT } from '/app/pages/Sim/DesktopConstants';
import { RESIZE_HANDLES } from '/app/pages/Sim/gridItems/Constants';

export const InputOutputPanel: FloatingPanelItem = {
  layout: {
    i: 'InputOutputPanel',
    x: 1,
    y: 0,
    w: 8,
    h: 3,
    minW: 8,
    minH: 3,
    resizeHandles: RESIZE_HANDLES,
    isDraggable: true,
    isResizable: true,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'InputOutputPanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Input/Output',
    icon: <FolderOpen />,
    titleBarMode: 'win',
    rowHeight: ROW_HEIGHT,
    bindToButtonId: 'InputOutputButton',
  },
};
