import { GridItemTypes } from '/app/models/GridItemType';
import Edit from '~icons/mdi/edit?raw';

import { FloatingPanelItem } from '/app/models/FloatingPanelItem';

export const EditPanel: FloatingPanelItem = {
  itemState: {
    i: 'EditPanel',
    x: 24,
    y: 0,
    w: 210,
    h: 91,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'EditPanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Edit Panel',
    icon: Edit,
    bindToButtonId: 'EditButton',
  },
};
