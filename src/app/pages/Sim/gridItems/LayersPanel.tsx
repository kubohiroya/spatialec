import { GridItemTypes } from '/app/models/GridItemType';
import { Layers } from '@mui/icons-material';
import React from 'react';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';
import { RESIZE_HANDLES } from '/app/pages/Sim/gridItems/Constants';
import { ROW_HEIGHT } from '/app/pages/Sim/DesktopConstants';

export const LayersPanel: FloatingPanelItem = {
  layout: {
    i: 'LayersPanel',
    x: 22,
    y: 7,
    w: 10,
    h: 8,
    isDraggable: true,
    isResizable: true,
    resizeHandles: RESIZE_HANDLES,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'LayersPanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Layers',
    icon: <Layers />,
    titleBarMode: 'win',
    rowHeight: ROW_HEIGHT,
    bindToButtonId: 'LayersButton',
  },
};
