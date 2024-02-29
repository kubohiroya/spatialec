import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Box, CardContent, CircularProgress } from '@mui/material';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import ReactGridLayout, {
  ItemCallback,
  Responsive as ResponsiveGridLayout,
} from 'react-grid-layout';
import { useWindowDimensions } from '/app/hooks/useWindowDimenstions';
import { FloatingItemResource } from '/app/models/FloatingItemResource';
import { entriesToRecord } from '/app/utils/arrayUtil';
import { FloatingButton } from '/components/FloatingButton/FloatingButton';
import { FloatingPanel } from '/components/FloatingPanel/FloatingPanel';
import { FloatingButtonResource } from '/app/models/FloatingButtonResource';
import { FloatingPanelResource } from '/app/models/FloatingPanelResource';
import { NUM_HORIZONTAL_GRIDS, ROW_HEIGHT } from './DesktopConstants';
import { Projects } from '/app/services/database/Projects';
import { ComponentState } from '/app/pages/Sim/ComponentState';
import { LayoutState } from '/app/pages/Sim/LayoutState';

const FloatingPanelContent = styled(CardContent)`
  padding: 8px;
  margin: 0;
  overflow: hidden;
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
const StyledResponsiveGridLayout = styled(ResponsiveGridLayout)`
  .react-grid-item.react-grid-placeholder {
    background: grey !important;
  }
`;

export type DesktopComponentProps = {
  uuid: string;
  backgroundColor: string;
  initialLayouts: LayoutState[];
  resources: Record<string, FloatingPanelResource | FloatingButtonResource>;
  gridItemChildrenMap: Record<string, ReactNode>;
  children?: ReactNode;
};

export const DesktopComponent = (props: DesktopComponentProps) => {
  const navigate = useNavigate();
  const { width, height } = useWindowDimensions();

  const [layoutStates, setLayoutStates] = useState<LayoutState[]>([]);

  const [layoutStateMap, setLayoutStateMap] = useState<
    Record<string, LayoutState>
  >({});

  const [gridItemMap, setGridItemMap] = useState<Record<
    string,
    ReactNode
  > | null>(null);

  const createForefrontLayoutStates = useCallback((
    id: string,
    _layouts: LayoutState[],
    changes?: Partial<LayoutState>,
  ) => {
    const index = _layouts.findIndex((layout) => layout.i === id);
    if (index < 0) return _layouts;
    const target = _layouts[index];
    const newLayouts = new Array<LayoutState>(_layouts.length);
    for (let i = 0; i < index; i++) {
      newLayouts[i] = _layouts[i];
    }
    for (let i = index; i < _layouts.length - 1; i++) {
      newLayouts[i] = _layouts[i + 1];
    }
    newLayouts[_layouts.length - 1] = {...target, ...changes};
    return newLayouts;
  }, []);

  const createMaximumLayout = useCallback((draft: ReactGridLayout.Layout) => {
    return {
      ...draft,
      x: 0,
      y: 0,
      w: NUM_HORIZONTAL_GRIDS,
      h: Math.floor((height - 10) / ROW_HEIGHT - 3),
    };
  }, [height]);

  const createLayouts = useCallback((layouts: ReactGridLayout.Layout[], layoutStateMap: Record<string, ComponentState>) => {
    return layouts.map((layout, index) => {
      if (layoutStateMap[layout.i]?.maximized) {
        return createMaximumLayout(layout);
      } else {
        return layout;
      }
    });
  }, [createMaximumLayout]);

  const onShow = useCallback((panelId: string) => {
    const buttonId = (
      layoutStateMap[panelId] as unknown as FloatingPanelResource
    ).bindToButtonId;
    buttonId && setLayoutStateMap((draft: Record<string, LayoutState>) => ({
      ...draft,
      [panelId]: { ...draft[panelId], shown: true },
      [buttonId]: { ...draft[buttonId], enabled: false }
    }));
  }, [layoutStateMap]);

  const onHide = useCallback((panelId: string) =>{
    const buttonId = (
      layoutStateMap[panelId] as unknown as FloatingPanelResource
    ).bindToButtonId;
    buttonId && setLayoutStateMap((draft: Record<string, LayoutState>) => ({
      ...draft,
      [panelId]: { ...draft[panelId], shown: false },
      [buttonId]: { ...draft[buttonId], enabled: true },
    }));
  }, [layoutStateMap]);

  const onForefront = useCallback((id: string) => {
    setLayoutStates(createForefrontLayoutStates(id, layoutStates));
  }, [createForefrontLayoutStates, layoutStates]);

  const onMaximize = useCallback((id: string) => {
    setLayoutStates(createForefrontLayoutStates(id, layoutStates, {maximized: true }));
  }, [createForefrontLayoutStates, layoutStates]);

  const onDemaximize = useCallback((id: string) => {
    setLayoutStates(createForefrontLayoutStates(id, layoutStates, {maximized: false }));
  }, [createForefrontLayoutStates, layoutStates]);

  const onResizeStop: ItemCallback = useCallback((
    current,
    oldItem,
    newItem,
    placeholder,
    e,
    element
  ) => {
    const newLayouts = createForefrontLayoutStates(newItem.i, current as LayoutState[]);
    setLayoutStates(newLayouts);
  }, [createForefrontLayoutStates]);

  const onDragStop: ItemCallback = useCallback((
    current,
    oldItem,
    newItem,
    placeholder,
    e,
    element
  ) => {
    const newLayouts = createForefrontLayoutStates(newItem.i, current as LayoutState[]);
    setLayoutStates(newLayouts);
  }, [createForefrontLayoutStates])

  const onLayoutChange = useCallback((current: ReactGridLayout.Layout[]) => {
    if (current.length === 0) return;
    console.log('⭐️onLayoutChange', {
      layoutStates,
      layoutStateMap,
    });
    Projects.saveComponentState(props.uuid, layoutStates.map((layout, index) => {
      return {...layoutStateMap[layout.i], ...layout}
    }))
  }, [layoutStateMap, layoutStates, props.uuid]);

  useEffect(() => {

    const createGridItem = (
      id: string,
      resource: FloatingItemResource,
      children: ReactNode
    ) => {
      if (!resource) return null;

      switch (resource.type) {
        case 'FloatingButton': {
          const itemResource = resource as FloatingButtonResource;
          return (
            <FloatingButton
              id={id}
              key={id}
              tooltip={resource.tooltip!}
              onClick={() => {
                if (itemResource.bindToPanelId) {
                  onShow(itemResource.bindToPanelId);
                  onForefront(itemResource.bindToPanelId);
                } else if (itemResource.onClick) {
                  itemResource.onClick();
                } else if (itemResource.navigateTo) {
                  navigate(itemResource.navigateTo);
                }
              }}
              disabled={!(layoutStateMap[id]?.enabled || false)}
            >
              {resource.icon}
            </FloatingButton>
          );
        }
        case 'FloatingPanel': {
          return (
            <FloatingPanel
              id={id}
              key={id}
              shown={layoutStates.some((layout) => layoutStateMap[id]?.shown)}
              title={resource.title!}
              icon={resource.icon}
              setToFront={() => onForefront(id)}
              rowHeight={resource.rowHeight!}
              titleBarMode={resource.titleBarMode!}
              onClose={() => {
                onHide(resource.id);
              }}
              onMaximize={() => {
                onMaximize(id);
              }}
              onDemaximize={() => {
                onDemaximize(id);
              }}
              maximized={layoutStateMap[id]?.maximized}
            >
              <FloatingPanelContent>{children}</FloatingPanelContent>
            </FloatingPanel>
          );
        }
        case 'BackgroundPanel':
        default:
          return <div id={id} key={id}></div>;
      }
    };

    if (layoutStates.length > 0) {
      setGridItemMap(
        entriesToRecord(
          layoutStates.map((layout) => {
            return [
              layout.i,
              createGridItem(
                layout.i,
                props.resources[layout.i],
                props.gridItemChildrenMap[layout.i]
              ),
            ];
          })
        )
      );
    }
  }, [layoutStateMap, layoutStates, navigate, onDemaximize, onForefront, onHide, onMaximize, onShow, props.gridItemChildrenMap, props.resources]);

  useEffect(() => {
    (async () => {

      const db = await Projects.openProject(props.uuid);
      let layoutStates: LayoutState[] = (await db.layoutState.toArray()).sort((a, b)=> a.zIndex && b.zIndex ? a.zIndex - b.zIndex : 0);
      if (layoutStates.length === 0){
        layoutStates = props.initialLayouts.map((initialLayout, index) => {
          if (
            initialLayout.x &&
            initialLayout.x! < 0
          ) {
            initialLayout.x = NUM_HORIZONTAL_GRIDS + initialLayout.x!;
          }
          if (
            initialLayout.y &&
            initialLayout.y! < 0
          ) {
            const rows = Math.floor((height - 100) / ROW_HEIGHT); //getRows(height);
            initialLayout.y = rows + initialLayout.y!;
          }
          return {...initialLayout, ...layoutStates, zIndex: index};
        });
      }
      setLayoutStates(layoutStates);

      const layoutMap = layoutStates.reduce((acc, layout) => {
        acc[layout.i as string] = layout;
        return acc;
      }, {} as Record<string, LayoutState>);
      setLayoutStateMap(layoutMap);

    })();
  }, [width, height, props.initialLayouts, props.resources, props.uuid]);

  return (
    <Box
      style={{
        margin: 0,
        padding: 0,
        border: 'none',
        overflow: 'hidden',
      }}
    >
      {width === 0 || layoutStates.length === 0 || gridItemMap === null ? (
        <Box
          sx={{
            display: 'flex',
            width: '100vw',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ccc',
          }}
        >
          <CircularProgress variant={'indeterminate'} size={100} />
        </Box>
      ) : (
        <StyledResponsiveGridLayout
          style={{
            backgroundColor: props.backgroundColor,
            margin: 0,
            padding: 0,
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
          layouts={{
            lg: createLayouts(layoutStates, layoutStateMap),
          }}
          onLayoutChange={onLayoutChange}
          onDragStop={onDragStop}
          onResizeStop={onResizeStop}
        >
          <Box
            sx={{ position: 'absolute', top: '-2px', left: '-8px' }}
            key={'BackgroundPanel'}
          >
            {props.children}
          </Box>
          {layoutStates
            .filter((layoutState) => layoutState.i !== 'BackgroundPanel')
            .map((layoutState, index) => gridItemMap[layoutState.i])}
        </StyledResponsiveGridLayout>
      )}
    </Box>
  );
};
