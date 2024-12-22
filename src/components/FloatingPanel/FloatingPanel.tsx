import React, { forwardRef, ReactNode } from 'react';
import { CardContent } from '@mui/material';
import styled from '@emotion/styled';
import WinBox from 'react-winbox';
import { base64Encode } from '/app/utils/base64Util';
import { addXmlnsToSvg } from '/app/utils/svgUtil';
import { FloatingPanelResource } from '/app/models/FloatingPanelResource';

const StyledWinBox = styled(WinBox)`
  border-radius: 8px;
`;

const FloatingPanelContent = styled(CardContent)`
  padding: 8px;
  margin: 0;
  overflow: hidden;
`;

const DEFAULT_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 18 18"><path fill="#fff" d="m1.613.21.094.083L8 6.585 14.293.293l.094-.083a1 1 0 0 1 1.403 1.403l-.083.094L9.415 8l6.292 6.293a1 1 0 0 1-1.32 1.497l-.094-.083L8 9.415l-6.293 6.292-.094.083A1 1 0 0 1 .21 14.387l.083-.094L6.585 8 .293 1.707A1 1 0 0 1 1.613.21z"/></svg>';

type FloatingPanelProps = {
  id: string;
  key: string;
  title: string;
  icon: ReactNode;
  x: number;
  y: number;
  w: number;
  h: number;
  maximized: boolean;
  minimized: boolean;
  resource: FloatingPanelResource;
  onShow: (id: string, buttonId: string, shown: boolean) => void;
  onFocus: (id: string) => void;
  onMaximize: (id: string, maximize: boolean) => void;
  onResize: (id: string, w: number, h: number) => void;
  onMove: (id: string, x: number, y: number) => void;
  children: ReactNode;
};

export const FloatingPanel = forwardRef<HTMLDivElement, FloatingPanelProps>(
  (
    {
      id,
      x,
      y,
      w,
      h,
      maximized,
      minimized,
      resource,
      onShow,
      onFocus,
      onMaximize,
      onResize,
      onMove,
      children,
    }: FloatingPanelProps,
    ref
  ) => {
    return (
      <StyledWinBox
        noFull
        id={id}
        key={id}
        x={x}
        y={y}
        width={w}
        height={h}
        max={maximized}
        min={minimized}
        title={resource.title ?? ''}
        border={4}
        icon={
          'data:image/svg+xml;base64,' +
          base64Encode(
            addXmlnsToSvg(
              typeof resource.icon === 'string' ? resource.icon : DEFAULT_ICON
            )
          )
        }
        onClose={() => {
          setTimeout(() => {
            if (resource.bindToButtonId) {
              onShow(id, resource.bindToButtonId, false);
            }
          }, 1);
        }}
        onFocus={() => onFocus(id)}
        onMaximize={() => onMaximize(id, true)}
        onMinimize={() => onMaximize(id, false)}
        onResize={(w: number, h: number) => {
          onResize(id, w, h);
        }}
        onMove={(x: number, y: number) => {
          onMove(id, x, y);
        }}
      >
        <FloatingPanelContent>{children}</FloatingPanelContent>
      </StyledWinBox>
    );
  }
);
