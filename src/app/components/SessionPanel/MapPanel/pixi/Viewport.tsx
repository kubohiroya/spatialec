import React, { useEffect, useLayoutEffect } from 'react';
import { PixiComponent, useApp } from '@pixi/react';
import { Viewport as PixiViewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';
import { Container } from 'pixi.js';
import { createViewportCenter } from '../CreateViewportCenter';
import { BoundingBox } from '../../../../models/BoundingBox';
import { MovedEvent, ZoomedEvent } from 'pixi-viewport/dist/types';
import PixiViewportDragEvent = GlobalMixins.PixiVieportDragEvent;

export interface ViewportBaseProps {
  pause: boolean;
  boundingBox: BoundingBox;
  viewportCenter: [number, number, number];
  onSetViewportCenter: (viewportWindow: [number, number, number]) => void;
  screenWidth: number;
  screenHeight: number;
  children?: React.ReactNode;
  onDragStart?: () => void;
  onDragEnd?: (ev: PixiViewportDragEvent) => void;
  onPinchStart?: () => void;
  onPinchEnd?: () => void;
  onSnapStart?: () => void;
  onSnapEnd?: () => void;
  onSnapZoomStart?: () => void;
  onSnapZoomEnd?: () => void;
  onZoomed?: (event: ZoomedEvent) => void;
  onZoomedEnd?: () => void;
  onMouseUp: () => void;

  onMoved?: (ev: MovedEvent) => void;
  onMovedEnd?: (xyz: { x: number; y: number; zoom: number }) => void;
}

export interface ViewportAppProps extends ViewportBaseProps {
  app: PIXI.Application;
}

const createPixiViewport = (props: ViewportAppProps) => {
  const viewport = new PixiViewport({
    passiveWheel: false,
    events: props.app.renderer.events,
    stopPropagation: true,
    screenWidth: props.screenWidth,
    screenHeight: props.screenHeight,

    worldWidth: 1000,
    worldHeight: 1000,
  });

  viewport.moveCenter(
    props.viewportCenter[2] || 0,
    props.viewportCenter[1] || 0,
  );
  viewport.setZoom(props.viewportCenter[0] || 1, true);

  viewport
    .drag({
      wheel: false,
    })
    .wheel({
      wheelZoom: true,
    })
    .pinch()
    .clampZoom({
      maxScale: 5,
      minScale: 0.1,
    });

  props.onDragStart && viewport.on('drag-start', props.onDragStart);
  props.onDragEnd && viewport.on('drag-end', props.onDragEnd);
  props.onPinchStart && viewport.on('pinch-start', props.onPinchStart);
  props.onPinchEnd && viewport.on('pinch-end', props.onPinchEnd);
  props.onSnapStart && viewport.on('snap-start', props.onSnapStart);
  props.onSnapEnd && viewport.on('snap-end', props.onSnapEnd);
  props.onSnapZoomStart &&
    viewport.on('snap-zoom-start', props.onSnapZoomStart);
  props.onSnapZoomEnd && viewport.on('snap-zoom-end', props.onSnapZoomEnd);
  props.onZoomed && viewport.on('zoomed', props.onZoomed);
  props.onZoomedEnd && viewport.on('zoomed-end', props.onZoomedEnd);
  props.onMouseUp && viewport.on('mouseup', props.onMouseUp);

  props.onMoved && viewport.on('moved', props.onMoved);
  //props.onMovedEnd && viewport.on('moved-end', props.onMovedEnd);
  props.onMovedEnd &&
    viewport.on('moved-end', (ev: PixiViewport) => {
      props.onMovedEnd &&
        props.onMovedEnd({
          x: ev.center.x,
          y: ev.center.y,
          zoom: ev.lastViewport!.scaleX,
        });
    });
  return viewport;
};

export const Viewport = (props: ViewportBaseProps) => {
  const app = useApp();

  const fit = ({
    left,
    top,
    right,
    bottom,
    paddingMarginRatio,
  }: BoundingBox) => {
    if (props.screenWidth === 0) return;

    const viewport = app.stage.getChildAt(0) as PixiViewport;

    const viewportCenter = createViewportCenter({
      left,
      top,
      right,
      bottom,
      width: props.screenWidth,
      height: props.screenHeight,
      paddingMarginRatio,
    });

    viewport.moveCenter(viewportCenter[2], viewportCenter[1]);
    viewport.setZoom(viewportCenter[0], true);

    requestAnimationFrame(() => {
      props.onSetViewportCenter(viewportCenter);
    });
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      const viewport = app.stage.getChildAt(0) as PixiViewport;
      if (props.screenWidth > 0 && props.screenHeight > 0) {
        if (props.viewportCenter) {
          viewport.moveCenter(props.viewportCenter[2], props.viewportCenter[1]);
          viewport.setZoom(props.viewportCenter[0], true);
        } else {
          fit(props.boundingBox);
        }
      }
    });
  }, [props.viewportCenter]);

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      const viewport = app.stage.getChildAt(0) as PixiViewport;
      viewport.pause = props.pause;
    });
  }, [props.pause]);

  const PixiComponentViewport = PixiComponent('Viewport', {
    create: (props: ViewportAppProps) => {
      const viewport = createPixiViewport(props);
      viewport.options.events.domElement = props.app.renderer
        .view as HTMLCanvasElement;
      return viewport;
    },
    didMount(viewport: PixiViewport, parent: Container) {
      // fit(props.boundingBox);
    },
    willUnmount: (viewport: PixiViewport) => {
      /*
      props.onSetViewportWindow({
        centerX: viewport.center.x,
        centerY: viewport.center.y,
        scale: viewport.scaled,
      });
       */
      //viewport.options.noTicker = true;
      viewport.destroy({ children: true });
    },
  });

  return <PixiComponentViewport app={app} {...props} />;
};
