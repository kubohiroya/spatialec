import { GridItemTypes } from '/app/models/GridItemType';
//import { Layers } from '@mui/icons-material';
import Layers from '~icons/mdi/layers?raw';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';

export const LayersPanel: FloatingPanelItem = {
  itemState: {
    i: 'LayersPanel',
    x: 528,
    y: 594,
    w: 323,
    h: 260,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'LayersPanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Layers',
    icon: Layers,
    bindToButtonId: 'LayersButton',
  },
};
