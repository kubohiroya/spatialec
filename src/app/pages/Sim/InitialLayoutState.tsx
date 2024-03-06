export type InitialLayoutState = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  enabled?: boolean;
  shown?: boolean;
  maximized?: boolean;
  clientHeight?: number;
  onClick?: () => void;
};
