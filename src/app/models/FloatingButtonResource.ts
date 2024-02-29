import { FloatingItemResource } from './FloatingItemResource';

export type FloatingButtonResource = {
  bindToPanelId?: string;
  navigateTo?: string;
  onClick?: () => void;
} & FloatingItemResource;
