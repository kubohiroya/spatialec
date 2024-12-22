import { GridItemTypes } from '/app/models/GridItemType';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';
import { Edit } from '@mui/icons-material';

export const EditButton: FloatingButtonItem = {
  itemState: {
    i: 'EditButton',
    x: 0,
    y: 48,
    w: 28,
    h: 24,
    shown: true,
    enabled: false,
    maximized: false,
  },
  resource: {
    id: 'EditButton',
    type: GridItemTypes.FloatingButton,
    bindToPanelId: 'EditPanel',
    tooltip: 'Open Edit Panel',
    icon: <Edit />,
  },
};
