import { GridItemTypes } from '/app/models/GridItemType';
import { Timer } from '@mui/icons-material';

import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const TimerControlButton: FloatingButtonItem = {
  itemState: {
    i: 'TimerControlButton',
    x: 0,
    y: 216,
    w: 24,
    h: 24,
    shown: true,
    enabled: false,
    maximized: false,
  },
  resource: {
    id: 'TimerControlButton',
    type: GridItemTypes.FloatingButton,
    bindToPanelId: 'TimerControlPanel',
    tooltip: 'Open TimerControl Panel',
    icon: <Timer />,
  },
};
