import { GridItemTypes } from '/app/models/GridItemType';
import { History } from '@mui/icons-material';

import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';

export const TimeMachineButton: FloatingButtonItem = {
  itemState: {
    i: 'TimeMachineButton',
    x: 0,
    y: 192,
    w: 24,
    h: 24,
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
