import { GridItemTypes } from '/app/models/GridItemType';
//import { FolderOpen } from '@mui/icons-material';
import FolderOpen from '~icons/mdi/folder-open?raw';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';

export const InputOutputPanel: FloatingPanelItem = {
  itemState: {
    i: 'InputOutputPanel',
    x: 24,
    y: 0,
    w: 218,
    h: 90,
    shown: true,
    enabled: true,
    maximized: false,
  },
  resource: {
    id: 'InputOutputPanel',
    type: GridItemTypes.FloatingPanel,
    title: 'Input/Output',
    icon: FolderOpen,
    bindToButtonId: 'InputOutputButton',
  },
};
