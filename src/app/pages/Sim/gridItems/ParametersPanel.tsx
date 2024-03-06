import { GridItemTypes } from '/app/models/GridItemType';
import { Tune } from '@mui/icons-material';
import React from 'react';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';
import { RESIZE_HANDLES } from '/app/pages/Sim/gridItems/Constants';
import { ROW_HEIGHT } from '/app/pages/Sim/DesktopConstants';

export const ParametersPanel: FloatingPanelItem = {
  layout: {
    i: 'ParametersPanel',
    x: 1,
    y: 0,
    w: 8,
    h: 4,
    minW: 8,
    minH: 4,
    isDraggable: true,
    isResizable: true,
    resizeHandles: RESIZE_HANDLES,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'ParametersPanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Parameters',
    icon: <Tune />,
    titleBarMode: 'win',
    rowHeight: ROW_HEIGHT,
    bindToButtonId: 'ParametersButton',
  },
};
