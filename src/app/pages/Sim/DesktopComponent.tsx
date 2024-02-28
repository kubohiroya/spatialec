import React, { ReactNode, useEffect, useState } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Box, CardContent, CircularProgress } from "@mui/material";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import ReactGridLayout, { ItemCallback, Responsive as ResponsiveGridLayout } from "react-grid-layout";
import { useWindowDimensions } from "/app/hooks/useWindowDimenstions";
import { FloatingItemResource } from "/app/models/FloatingItemResource";
import { entriesToRecord } from "/app/utils/arrayUtil";
import { FloatingButton } from "/components/FloatingButton/FloatingButton";
import { FloatingPanel } from "/components/FloatingPanel/FloatingPanel";
import { FloatingButtonResource } from "/app/models/FloatingButtonResource";
import { FloatingPanelResource } from "/app/models/FloatingPanelResource";
import { GridItemTypes } from "/app/models/GridItemType";
import { NUM_HORIZONTAL_GRIDS, ROW_HEIGHT } from "./DesktopConstants";

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
  backgroundColor: string;
  initialLayouts: ReactGridLayout.Layout[];
  resources: Record<string, FloatingPanelResource | FloatingButtonResource>;
  gridItemChildrenMap: Record<string, ReactNode>;
  children?: ReactNode;
};

type ComponentState = {
  enabled: boolean;
  shown: boolean;
};
export const DesktopComponent = (props: DesktopComponentProps) => {
  const navigate = useNavigate();
  const { width, height } = useWindowDimensions();

  const [forefront, setForefront] = useState<string>('' as string);
  const [layouts, setLayouts] = useState<ReactGridLayout.Layout[]>([
    ...props.initialLayouts.map((layout) => ({
      ...layout,
      //y: !props.resources[layout.i].shown ? layout.y - numRows : layout.y,
    })),
  ]);

  const [maximizedLayout, setMaximizedLayout] =
    useState<ReactGridLayout.Layout | null>(null);

  useEffect(() => {
    // requestAnimationFrame(() => {
    setLayouts((draft) => {
      draft.forEach((layout) => {
        if (props.resources[layout.i].x && props.resources[layout.i].x! < 0) {
          layout.x = NUM_HORIZONTAL_GRIDS + props.resources[layout.i].x!;
        }
        if (props.resources[layout.i].y && props.resources[layout.i].y! < 0) {
          const rows = Math.floor((height - 100) / ROW_HEIGHT); //getRows(height);
          layout.y = rows + props.resources[layout.i].y!;
        }
      });
      return draft;
    });
    // });
  }, [width, height, props.resources]);

  /*
  const [removedLayoutsMap, setRemovedLayoutsMap] = useState<
    Record<string, ReactGridLayout.Layout>
  >(
    entriesToRecord<string, ReactGridLayout.Layout>(
      layouts
        .filter(
          (item) =>
            props.resources[item.i] &&
            props.resources[item.i].type === GridItemType.FloatingPanel &&
            !props.resources[item.i].shown,
        )
        .map((item) => [item.i, item]),
    ),
  );

   */

  const [componentStateMap, setComponentStateMap] = useState<
    Record<string, ComponentState>
  >(
    entriesToRecord<string, ComponentState>(
      layouts.map((item) => {
        if (!props.resources[item.i]) {
          console.error('ERROR', item.i, props.resources);
        }
        const shown = props.resources[item.i].shown || false;
        const enabled =
          props.resources[item.i].type === GridItemTypes.FloatingButton
            ? (props.resources[item.i] as FloatingButtonResource).enabled
            : true;
        return [
          item.i,
          {
            shown,
            enabled,
          },
        ];
      }),
    ),
  );

  const [gridItemMap, setGridItemMap] = useState<Record<
    string,
    ReactNode
  > | null>(null);

  const createForefront = (
    id: string,
    _layouts: Array<ReactGridLayout.Layout>,
  ) => {
    const index = _layouts.findIndex((layout) => layout.i === id);
    if (index < 0) return _layouts;
    const target = _layouts[index];
    const newLayouts = new Array<ReactGridLayout.Layout>(_layouts.length);
    for (let i = 0; i < index; i++) {
      newLayouts[i] = _layouts[i];
    }
    for (let i = index; i < _layouts.length - 1; i++) {
      newLayouts[i] = _layouts[i + 1];
    }
    newLayouts[_layouts.length - 1] = target;
    return newLayouts;
  };

  const createMaximizeLastItem = (_layouts: Array<ReactGridLayout.Layout>) => {
    const target = _layouts[_layouts.length - 1];
    setMaximizedLayout({ ...target });
    const newLayouts = [..._layouts];
    newLayouts[_layouts.length - 1] = {
      ...target,
      x: 0,
      y: 0,
      w: NUM_HORIZONTAL_GRIDS,
      h: Math.floor((height - 10) / ROW_HEIGHT - 3),
    };
    return newLayouts;
  };

  const onDemaximize = () => {
    console.log(0);
    if (maximizedLayout) {
      console.log(1);
      const newLayouts = [...layouts];
      newLayouts[layouts.length - 1] = maximizedLayout;
      console.log(2, newLayouts);
      setLayouts(newLayouts);
      setMaximizedLayout(null);
    }
  };

  const onShow = (panelId: string) => {
    props.resources[panelId].shown = true;
    setLayouts((layouts: ReactGridLayout.Layout[]) => {
      return layouts.map((layout) =>
        layout.i !== panelId ? { ...layout, show: true } : layout,
      );
    });

    /*
    setRemovedLayoutsMap(
      (removedLayoutsMap: Record<string, ReactGridLayout.Layout>) => {
        return filterRecord(removedLayoutsMap, (key) => key !== panelId);
      },
    );
     */

    const buttonId = (
      props.resources[panelId] as unknown as FloatingPanelResource
    ).bindToButtonId;
    if (buttonId) {
      setComponentStateMap((draft: Record<string, ComponentState>) => {
        return {
          ...draft,
          [panelId]: { ...draft[panelId], shown: true },
          [buttonId]: { ...draft[buttonId], enabled: false },
        };
      });
    }
  };

  const onHide = (panelId: string) => {
    props.resources[panelId].shown = false;
    setLayouts((layouts: ReactGridLayout.Layout[]) => {
      return layouts.map((layout) =>
        layout.i !== panelId ? { ...layout, show: false } : layout,
      );
    });

    /*
    const removingLayout = layouts.find((layout) => layout.i === panelId);
    if (removingLayout) {
      setRemovedLayoutsMap(
        (removedLayoutsMap: Record<string, ReactGridLayout.Layout>) => {
          return {
            ...removedLayoutsMap,
            [removingLayout.i]: { ...removingLayout },
          };
        },
      );
      setLayouts((layouts: ReactGridLayout.Layout[]) => {
        return layouts.map((layout) =>
          layout.i !== panelId ? layout : { ...layout, y: layout.y - numRows },
        );
      });
    }
     */

    const buttonId = (
      props.resources[panelId] as unknown as FloatingPanelResource
    ).bindToButtonId;
    if (buttonId) {
      setComponentStateMap((draft: Record<string, ComponentState>) => {
        return {
          ...draft,
          [panelId]: { ...draft[panelId], shown: false },
          [buttonId]: { ...draft[buttonId], enabled: true },
        };
      });
    }
  };

  const onForefront = (id: string) => {
    setForefront(id);
    setLayouts((layouts) => {
      return createForefront(id, layouts);
    });
  };

  const onMaximize = (id: string) => {
    setForefront(id);
    setLayouts((layouts) => {
      return createMaximizeLastItem(createForefront(id, layouts));
    });
  };

  const onResizeStop: ItemCallback = (
    current,
    oldItem,
    newItem,
    placeholder,
    e,
    element,
  ) => {
    const newLayouts = createForefront(oldItem.i, current);
    setLayouts(newLayouts);
  };

  const onDragStop: ItemCallback = (
    current,
    oldItem,
    newItem,
    placeholder,
    e,
    element,
  ) => {
    const newLayouts = createForefront(oldItem.i, current);
    setLayouts(newLayouts);
  };

  const onLayoutChange = (current: ReactGridLayout.Layout[]) => {
    if (current.length === 0) return;
    const newLayouts = createForefront(forefront, current);
    /*
    setRemovedLayoutsMap(
      (removedLayoutsMap: Record<string, ReactGridLayout.Layout>) => {
        return filterRecord(removedLayoutsMap, (key) => key !== panelId);
      },
    );
     */

    /*
    console.log('⭐️onLayoutChange', {
      newLayouts,
      x: newLayouts[newLayouts.length - 1].i,
    });
     */
    setLayouts(newLayouts);
  };

  const createGridItem = (
    id: string,
    resource: FloatingItemResource,
    children: ReactNode,
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
            disabled={!(componentStateMap[id]?.enabled || false)}
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
            shown={layouts.some(layout => componentStateMap[id].shown)}
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
              onDemaximize();
            }}
            maximized={maximizedLayout?.i === id}
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

  useEffect(() => {
    if (layouts.length > 0 && Object.keys(props.resources).length > 0) {
      setGridItemMap(
        entriesToRecord(
          layouts.map((layout) => {
            return [
              layout.i,
              createGridItem(
                layout.i,
                props.resources[layout.i],
                props.gridItemChildrenMap[layout.i],
              ),
            ];
          }),
        ),
      );
    }
  }, [layouts, props.resources]);

  return (
    <Box
      style={{
        margin: 0,
        padding: 0,
        border: 'none',
        overflow: 'hidden'
      }}
    >
      {width === 0 || layouts.length === 0 || gridItemMap === null ? (
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
          layouts={{ lg: layouts }}
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
          {layouts
            .filter((layout) => layout.i !== 'BackgroundPanel')
            .map((layout, index) => gridItemMap[layout.i])}
        </StyledResponsiveGridLayout>
      )}
    </Box>
  );
};
