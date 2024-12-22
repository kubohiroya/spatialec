import { GridItemTypes } from '/app/models/GridItemType';
import Info from '~icons/mdi/info?raw';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';

export const InfoPanel: FloatingPanelItem = {
  itemState: {
    i: 'InfoPanel',
    x: 308,
    y: 0,
    w: 200,
    h: 72,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'InfoPanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Information',
    icon: Info,
    bindToButtonId: 'InfoButton',
  },
};
