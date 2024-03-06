import { GridItemTypes } from '/app/models/GridItemType';
import { Edit } from '@mui/icons-material';
import React from 'react';

import { FloatingPanelItem } from '/app/models/FloatingPanelItem';
import { RESIZE_HANDLES } from '/app/pages/Sim/gridItems/Constants';
import { ROW_HEIGHT } from '/app/pages/Sim/DesktopConstants';

export const EditPanel: FloatingPanelItem = {
  layout: {
    i: 'EditPanel',
    x: 1,
    y: 0,
    w: 9,
    h: 3,
    resizeHandles: RESIZE_HANDLES,
    isDraggable: true,
    isResizable: true,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'EditPanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Edit Panel',
    icon: <Edit />,
    titleBarMode: 'win',
    rowHeight: ROW_HEIGHT,
    bindToButtonId: 'EditButton',
  },
};
