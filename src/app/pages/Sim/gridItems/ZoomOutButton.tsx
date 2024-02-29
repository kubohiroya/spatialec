import { GridItemTypes } from '/app/models/GridItemType';
import { ZoomOut } from '@mui/icons-material';
import React from 'react';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';
import { LayoutDefault } from '/app/pages/Sim/LayoutDefault';

export function ZoomOutButton(props?: LayoutDefault): FloatingButtonItem {
  return {
    layout: {
      i: 'ZoomOutButton',
      x: 0,
      y: props?.y ?? 0,
      w: 1,
      h: 1,
      resizeHandles: [],
      isDraggable: true,
      isResizable: false,
      shown: props?.shown ?? true,
      enabled: props?.enabled ?? true,
      maximized: false,
    },
    resource: {
      id: 'ZoomOutButton',
      type: GridItemTypes.FloatingButton,
      tooltip: 'zoom out',
      icon: <ZoomOut />,
      onClick: props?.onClick
    },
  };
}
