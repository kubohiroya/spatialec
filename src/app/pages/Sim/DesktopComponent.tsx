import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Box, CardContent } from '@mui/material';
import styled from '@emotion/styled';
import {
  ItemCallback,
  Responsive as ResponsiveGridLayout,
} from 'react-grid-layout';
import { useWindowDimensions } from '/app/hooks/useWindowDimenstions';
import { FloatingItemResource } from '/app/models/FloatingItemResource';
import { FloatingButton } from '/components/FloatingButton/FloatingButton';
import { FloatingPanel } from '/components/FloatingPanel/FloatingPanel';
import { FloatingButtonResource } from '/app/models/FloatingButtonResource';
import { FloatingPanelResource } from '/app/models/FloatingPanelResource';
import { NUM_HORIZONTAL_GRIDS, ROW_HEIGHT } from './DesktopConstants';
import { Projects } from '/app/services/database/Projects';
import { LayoutState } from '/app/pages/Sim/LayoutState';
import { useNavigate } from 'react-router-dom';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';
import { CircularProgressBox } from '/components/CircularProgressBox/CircularProgressBox';
import { AsyncFunctionManager } from '/app/utils/AsyncFunctionManager';
import { ComponentState } from '/app/pages/Sim/ComponentState';

const FloatingPanelContent = styled(CardContent)`
  padding: 8px;
  margin: 0;
  overflow: hidden;
`;

const asyncFunctionManager = new AsyncFunctionManager();

const StyledResponsiveGridLayout = styled(ResponsiveGridLayout)`
  .react-grid-item.react-grid-placeholder {
    background: grey !important;
  }
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
`;

export type DesktopComponentProps = {
  uuid: string;
  backgroundColor: string;
  layoutResourceMap: Record<string, FloatingPanelItem | FloatingButtonItem>;
  gridItemMap: Record<string, ReactNode>;
  children?: ReactNode;
};

export const DesktopComponent = (props: DesktopComponentProps) => {
  const navigate = useNavigate();
  const { width, height } = useWindowDimensions();

  const [layoutStateMap, setLayoutStateMap] = useState<Record<
    string,
    LayoutState
  > | null>(null);

  const [gridItemMap, setGridItemMap] = useState<Record<
    string,
    ReactNode
  > | null>(null);

  const onLayoutChange = useCallback(
    (
      currentLayout: ReactGridLayout.Layout[],
      allLayouts: ReactGridLayout.Layouts
    ) => {
      console.log('onLayoutChange');
    },
    []
  );

  const createForefrontLayoutStatesMap = useCallback(
    (
      layoutStateMap: Record<string, LayoutState> | null,
      id: string,
      changes?: Partial<LayoutState>
    ) => {
      if (layoutStateMap === null) return null;
      const targetZIndex = layoutStateMap[id]?.zIndex;
      if (!targetZIndex || targetZIndex < 0) {
        console.error({ layoutStatesMap: layoutStateMap });
        throw new Error();
      }

      const newLayoutStateMap: Record<string, LayoutState> = {};

      for (const layoutsMapKey in layoutStateMap) {
        const value = layoutStateMap[layoutsMapKey];
        if (value.zIndex === targetZIndex) {
          newLayoutStateMap[layoutsMapKey] = {
            ...value,
            zIndex: Object.keys(layoutStateMap).length - 1,
            ...changes,
          };
        } else if (value.zIndex !== undefined && value.zIndex > targetZIndex) {
          newLayoutStateMap[layoutsMapKey] = {
            ...value,
            zIndex: value.zIndex - 1,
          };
        } else {
          newLayoutStateMap[layoutsMapKey] = value;
        }
      }
      return newLayoutStateMap;
    },
    []
  );

  const createLayoutStates = useCallback(
    (layoutStateMap: Record<string, LayoutState> | null, height: number) => {
      if (layoutStateMap === null) return;
      return Object.keys(layoutStateMap)
        .map((id) => {
          const layout = layoutStateMap[id];
          if (layoutStateMap[id]?.maximized) {
            return {
              ...layoutStateMap[id],
              x: 0,
              y: 0,
              w: NUM_HORIZONTAL_GRIDS,
              h: Math.floor((height - 10) / ROW_HEIGHT - 3),
            };
          } else {
            return layout;
          }
        })
        .sort((a, b) => {
          if (a.zIndex && b.zIndex) {
            return a.zIndex - b.zIndex;
          } else {
            return 0;
          }
        });
    },
    []
  );

  const onLayoutStateMapChange = useCallback(
    (layoutStateMap: Record<string, LayoutState> | null) => {
      if (layoutStateMap === null) return;
      Projects.saveLayoutState(props.uuid, Object.values(layoutStateMap));
      update(layoutStateMap);
    },
    [props.uuid]
  );

  const onResizeStop: ItemCallback = useCallback(
    (current, oldItem, newItem, placeholder, e, element) => {
      onLayoutStateMapChange(
        createForefrontLayoutStatesMap(layoutStateMap, newItem.i)
      );
    },
    [createForefrontLayoutStatesMap, layoutStateMap, onLayoutStateMapChange]
  );

  const onDragStop: ItemCallback = useCallback(
    (current, oldItem, newItem, placeholder, e, element) => {
      onLayoutStateMapChange(
        createForefrontLayoutStatesMap(layoutStateMap, newItem.i)
      );
    },
    [createForefrontLayoutStatesMap, layoutStateMap, onLayoutStateMapChange]
  );

  const onForefront = useCallback(
    (layoutStateMap: Record<string, LayoutState> | null, panelId: string) => {
      const newLayoutStateMap = createForefrontLayoutStatesMap(
        layoutStateMap,
        panelId
      );
      console.log('onForefront', panelId);
      onLayoutStateMapChange(newLayoutStateMap);
    },
    [createForefrontLayoutStatesMap, onLayoutStateMapChange]
  );

  const onShow = useCallback(
    (
      layoutStateMap: Record<string, LayoutState> | null,
      panelId: string,
      buttonId: string,
      newValue: boolean
    ) => {
      if (layoutStateMap === null) return;
      const newLayoutStateMap = {
        ...layoutStateMap,
        [panelId]: { ...layoutStateMap[panelId], shown: newValue },
        [buttonId]: { ...layoutStateMap[buttonId], enabled: !newValue },
      };
      console.log('onClose', panelId, buttonId, newLayoutStateMap);
      onLayoutStateMapChange(
        createForefrontLayoutStatesMap(newLayoutStateMap, panelId)
      );
    },
    [createForefrontLayoutStatesMap, onLayoutStateMapChange]
  );

  const onMaximize = useCallback(
    (
      layoutStateMap: Record<string, LayoutState> | null,
      panelId: string,
      maximized: boolean
    ) => {
      const newLayoutStateMap = createForefrontLayoutStatesMap(
        layoutStateMap,
        panelId,
        { maximized }
      );
      console.log('onMaximize', panelId, newLayoutStateMap);
      onLayoutStateMapChange(newLayoutStateMap);
    },
    [createForefrontLayoutStatesMap, onLayoutStateMapChange]
  );

  const createGridItem = useCallback(
    (
      layoutStateMap: Record<string, LayoutState> | null,
      id: string,
      resource: FloatingItemResource,
      children: ReactNode
    ) => {
      if (!layoutStateMap || !resource) return null;
      switch (resource.type) {
        case 'FloatingButton': {
          const buttonResource = resource as FloatingButtonResource;
          return (
            <FloatingButton
              id={id}
              key={id}
              tooltip={buttonResource.tooltip ?? ''}
              onClick={() => {
                if (buttonResource.bindToPanelId) {
                  onShow(
                    layoutStateMap,
                    buttonResource.bindToPanelId,
                    id,
                    true
                  );
                } else if (buttonResource.onClick) {
                  buttonResource.onClick();
                } else if (buttonResource.navigateTo) {
                  navigate(buttonResource.navigateTo);
                }
              }}
              disabled={!(layoutStateMap[id]?.enabled || false)}
            >
              {buttonResource.icon}
            </FloatingButton>
          );
        }
        case 'FloatingPanel': {
          const panelResource = resource as FloatingPanelResource;
          return (
            <FloatingPanel
              id={id}
              key={id}
              shown={layoutStateMap[id]?.shown}
              title={panelResource.title ?? ''}
              icon={panelResource.icon}
              setToFront={() => onForefront(layoutStateMap, id)}
              rowHeight={panelResource.rowHeight ?? 0}
              titleBarMode={panelResource.titleBarMode ?? 'win'}
              onClose={() => {
                if (panelResource.bindToButtonId) {
                  onShow(
                    layoutStateMap,
                    id,
                    panelResource.bindToButtonId,
                    false
                  );
                }
              }}
              onMaximize={(maximize: boolean) => {
                onMaximize(layoutStateMap, id, maximize);
              }}
              maximized={layoutStateMap[id]?.maximized}
            >
              <FloatingPanelContent>{children}</FloatingPanelContent>
            </FloatingPanel>
          );
        }
        default:
          throw new Error(resource.type);
      }
    },
    [navigate, onForefront, onMaximize, onShow]
  );

  const update = useCallback(
    (
      layoutStateMap: Record<string, ReactGridLayout.Layout & ComponentState>
    ) => {
      setLayoutStateMap(layoutStateMap);
      setGridItemMap(
        Object.keys(layoutStateMap).reduce((acc, id) => {
          acc[id] = createGridItem(
            layoutStateMap,
            id,
            props.layoutResourceMap[id].resource,
            props.gridItemMap[id]
          );
          return acc;
        }, {} as Record<string, ReactNode>)
      );
    },
    [
      navigate,
      onForefront,
      onMaximize,
      onShow,
      props.gridItemMap,
      props.layoutResourceMap,
    ]
  );

  const initialize = useCallback(async () => {
    console.log('init 0');
    const storedLayouts: LayoutState[] | undefined =
      await Projects.getLayoutStates(props.uuid);
    if (!storedLayouts) {
      console.log('init -');
      return;
    }
    console.log('init 1');
    const layoutStateMap =
      storedLayouts.length === 0
        ? Object.keys(props.layoutResourceMap).reduce((acc, key) => {
            acc[key] = props.layoutResourceMap[key].layout;
            return acc;
          }, {} as Record<string, LayoutState>)
        : storedLayouts.reduce((acc, layout) => {
            acc[layout.i as string] = layout;
            return acc;
          }, {} as Record<string, LayoutState>);
    console.log('init 2');
    update(layoutStateMap);
    console.log('init 3');
  }, [props.layoutResourceMap, props.uuid, update]);

  useEffect(() => {
    asyncFunctionManager.runAsyncFunction(async () => {
      console.log('init start');
      await initialize();
      console.log('init done');
    });
  }, [initialize]);

  const gridItems = useMemo(() => {
    if (layoutStateMap === null || gridItemMap === null) return;
    return Object.values(layoutStateMap)
      .sort((a, b) => {
        if (a.zIndex && b.zIndex) {
          return a.zIndex - b.zIndex;
        } else {
          return 0;
        }
      })
      .map((value) => gridItemMap[value.i]);
  }, [gridItemMap, layoutStateMap]);

  const lg = useMemo(() => {
    return createLayoutStates(layoutStateMap, height);
  }, [createLayoutStates, height, layoutStateMap]);

  console.log(
    '*',
    width === 0 ||
      !lg ||
      !gridItems ||
      lg.length === 0 ||
      gridItems?.length === 0
  );

  return (
    <Box
      style={{
        margin: 0,
        padding: 0,
        border: 'none',
        overflow: 'hidden',
      }}
    >
      {width === 0 ||
      !lg ||
      !gridItems ||
      lg.length === 0 ||
      gridItems?.length === 0 ? (
        <CircularProgressBox />
      ) : (
        <>
          <Box
            sx={{
              position: 'absolute',
              height: '100vh',
            }}
            key={'BackgroundPanel'}
          >
            {props.children}
          </Box>
          <StyledResponsiveGridLayout
            style={{
              backgroundColor: props.backgroundColor,
            }}
            compactType={'vertical'}
            autoSize={true}
            allowOverlap={true}
            isResizable={false}
            isBounded={false}
            width={width}
            draggableHandle=".draggable"
            breakpoints={{ lg: 1140 }}
            cols={{ lg: NUM_HORIZONTAL_GRIDS }}
            rowHeight={ROW_HEIGHT}
            margin={[4, 4]}
            containerPadding={[8, 2]}
            onLayoutChange={onLayoutChange}
            onDragStop={onDragStop}
            onResizeStop={onResizeStop}
            layouts={{
              lg,
            }}
          >
            {gridItems}
          </StyledResponsiveGridLayout>
        </>
      )}
    </Box>
  );
};
