import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Box, IconButton } from '@mui/material';
import { useWindowDimensions } from '/app/hooks/useWindowDimenstions';
import { FloatingItemResource } from '/app/models/FloatingItemResource';
import { FloatingButtonResource } from '/app/models/FloatingButtonResource';
import { FloatingPanelResource } from '/app/models/FloatingPanelResource';
import { Projects } from '/app/services/database/Projects';
import { useNavigate } from 'react-router-dom';
import { FloatingPanelItem } from '/app/models/FloatingPanelItem';
import { FloatingButtonItem } from '/app/models/FloatingButtonItem';
import { CircularProgressBox } from '/components/CircularProgressBox/CircularProgressBox';
import { ComponentState } from '/app/pages/Sim/ComponentState';

import 'winbox/dist/css/winbox.min.css'; // required
import 'winbox/dist/css/themes/white.min.css'; // optional
import './styles.css';
import { ItemState } from '/app/pages/Sim/ItemState';
import { FloatingPanel } from '/components/FloatingPanel/FloatingPanel';

export type DesktopComponentProps = {
  uuid: string;
  backgroundColor: string;
  resourceMap: Record<string, FloatingPanelItem | FloatingButtonItem>;
  itemMap: Record<string, ReactNode>;
  children?: ReactNode;
};

export const DesktopComponent = (props: DesktopComponentProps) => {
  const navigate = useNavigate();
  const { width, height } = useWindowDimensions();

  const [itemStateMap, setItemStateMap] = useState<Record<
    string,
    ItemState
  > | null>(null);

  const [itemMap, setItemMap] = useState<Record<string, ReactNode> | null>(
    null
  );

  const createForefrontStatesMap = useCallback(
    (
      itemStateMap: Record<string, ItemState> | null,
      id: string,
      changes?: Partial<ItemState>
    ) => {
      if (itemStateMap === null) return null;
      const targetZIndex = itemStateMap[id]?.zIndex;
      if (!targetZIndex || targetZIndex < 0) {
        throw new Error();
      }

      const newItemStateMap: Record<string, ItemState> = {};

      for (const itemStateMapKey in itemStateMap) {
        const value = itemStateMap[itemStateMapKey];
        if (value.zIndex === targetZIndex) {
          newItemStateMap[itemStateMapKey] = {
            ...value,
            zIndex: Object.keys(itemStateMap).length - 1,
            ...changes,
          };
        } else if (value.zIndex !== undefined && value.zIndex > targetZIndex) {
          newItemStateMap[itemStateMapKey] = {
            ...value,
            zIndex: value.zIndex - 1,
          };
        } else {
          newItemStateMap[itemStateMapKey] = value;
        }
      }
      return newItemStateMap;
    },
    []
  );

  const saveItemStateMap = useCallback(
    async (newItemStateMap: Record<string, ItemState> | null) => {
      if (newItemStateMap) {
        setItemStateMap(newItemStateMap);
        await Projects.updateItemStates(
          props.uuid,
          Object.values(newItemStateMap)
        );
      }
    },
    [props.uuid]
  );

  const onFocus = useCallback(
    async (itemStateMap: Record<string, ItemState> | null, panelId: string) => {
      const newItemStateMap = createForefrontStatesMap(itemStateMap, panelId);
      await saveItemStateMap(newItemStateMap);
    },
    [createForefrontStatesMap, saveItemStateMap]
  );

  const onMove = useCallback(
    async (
      itemStateMap: Record<string, ItemState> | null,
      panelId: string,
      x: number,
      y: number
    ) => {
      if (itemStateMap) {
        const newItemStateMap = createForefrontStatesMap(
          itemStateMap,
          panelId,
          { x, y }
        );
        await saveItemStateMap(newItemStateMap);
        console.log(panelId, { x, y });
      }
    },
    [createForefrontStatesMap, saveItemStateMap]
  );

  const onResize = useCallback(
    async (
      itemStateMap: Record<string, ItemState> | null,
      panelId: string,
      w: number,
      h: number
    ) => {
      if (itemStateMap) {
        const newItemStateMap = createForefrontStatesMap(
          itemStateMap,
          panelId,
          { w, h }
        );
        await saveItemStateMap(newItemStateMap);
        console.log(panelId, { w, h });
      }
    },
    [createForefrontStatesMap, saveItemStateMap]
  );

  const update = useCallback(
    async (newItemStateMap: Record<string, ComponentState> | null) => {
      if (newItemStateMap === null) return;

      const createGridItem = (
        newItemStateMap: Record<string, ItemState> | null,
        id: string,
        resource: FloatingItemResource,
        children: ReactNode
      ) => {
        if (!newItemStateMap || !resource) return null;

        const itemState = newItemStateMap[id];

        if (!itemState.shown) {
          return null;
        }

        const onShow = (
          itemStateMap: Record<string, ItemState> | null,
          panelId: string,
          buttonId: string,
          newValue: boolean
        ) => {
          if (itemStateMap === null) return;
          const newItemStateMap = {
            ...itemStateMap,
            [panelId]: { ...itemStateMap[panelId], shown: newValue },
            [buttonId]: { ...itemStateMap[buttonId], enabled: !newValue },
          };
          console.log('onShow', newValue);
          update(newItemStateMap);
        };

        switch (resource.type) {
          case 'FloatingButton': {
            const buttonResource = resource as FloatingButtonResource;
            return (
              <IconButton
                id={id}
                key={id}
                style={{
                  position: 'fixed',
                  zIndex: itemState.zIndex,
                  width: itemState.w,
                  height: itemState.h,
                  ...(itemState.x >= 0
                    ? { left: itemState.x }
                    : { right: -1 * itemState.x }),
                  ...(itemState.y >= 0
                    ? { top: itemState.y }
                    : { bottom: -1 * itemState.y }),
                }}
                disabled={!itemState.enabled}
                title={buttonResource.tooltip ?? ''}
                onClick={() => {
                  if (buttonResource.bindToPanelId) {
                    onShow(
                      newItemStateMap,
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
              >
                {resource.icon}
              </IconButton>
            );
          }
          case 'FloatingPanel': {
            const panelResource = resource as FloatingPanelResource;

            const onMaximize = (
              itemStateMap: Record<string, ItemState> | null,
              panelId: string,
              maximized: boolean
            ) => {
              const newItemStateMap = createForefrontStatesMap(
                itemStateMap,
                panelId,
                {
                  maximized,
                }
              );
              saveItemStateMap(newItemStateMap);
              update(newItemStateMap);
            };

            return (
              <FloatingPanel
                key={id}
                id={id}
                x={itemState.x >= 0 ? itemState.x : width + itemState.x}
                y={itemState.y >= 0 ? itemState.y : height + itemState.y}
                w={itemState.w}
                h={itemState.h}
                maximized={itemState.maximized}
                minimized={!itemState.shown}
                title={panelResource.title ?? ''}
                icon={panelResource.icon}
                resource={panelResource}
                onShow={(id, buttonId, shown) =>
                  onShow(newItemStateMap, id, buttonId, shown)
                }
                onFocus={(id) => onFocus(newItemStateMap, id)}
                onMaximize={(id, maximize) =>
                  onMaximize(newItemStateMap, id, maximize)
                }
                onResize={(id, w, h) => onResize(newItemStateMap, id, w, h)}
                onMove={(id, x, y) => onMove(newItemStateMap, id, x, y)}
              >
                {children}
              </FloatingPanel>
            );
          }
          default:
            throw new Error(resource.type);
        }
      };

      setItemStateMap(newItemStateMap);
      setItemMap(
        Object.keys(newItemStateMap).reduce((acc, id) => {
          acc[id] = createGridItem(
            newItemStateMap,
            id,
            props.resourceMap[id].resource,
            props.itemMap[id]
          );
          return acc;
        }, {} as Record<string, ReactNode>)
      );

      // console.log(newItemStateMap);

      await Projects.bulkUpdateItemStates(
        props.uuid,
        Object.values(newItemStateMap)
      );
    },
    [
      createForefrontStatesMap,
      height,
      navigate,
      onFocus,
      onMove,
      onResize,
      props.itemMap,
      props.resourceMap,
      props.uuid,
      saveItemStateMap,
      width,
    ]
  );

  const initialize = useCallback(async () => {
    const storedItemStates: ItemState[] | undefined =
      await Projects.getItemStates(props.uuid);
    if (!storedItemStates) {
      return;
    }
    const itemStateMap =
      storedItemStates.length === 0
        ? Object.keys(props.resourceMap).reduce((acc, key) => {
            acc[key] = props.resourceMap[key].itemState;
            return acc;
          }, {} as Record<string, ItemState>)
        : storedItemStates.reduce((acc, itemState) => {
            acc[itemState.i as string] = itemState;
            return acc;
          }, {} as Record<string, ItemState>);
    await update(itemStateMap);
  }, [props.resourceMap, props.uuid, update]);

  useEffect(() => {
    initialize().then(() => {
      console.log('initialize done');
    });
  }, [initialize]);

  const items = useMemo(() => {
    return (
      itemStateMap !== null &&
      itemMap !== null &&
      Object.values(itemStateMap)
        .sort((a, b) => {
          if (a.zIndex && b.zIndex) {
            return a.zIndex - b.zIndex;
          } else {
            return 0;
          }
        })
        .map((value) => itemMap[value.i])
    );
  }, [itemMap, itemStateMap]);

  return (
    <Box
      style={{
        margin: 0,
        padding: 0,
        border: 'none',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {width === 0 || !items || items?.length === 0 ? (
        <CircularProgressBox />
      ) : (
        <>
          <Box key={'BackgroundPanel'}>{props.children}</Box>
          {items}
        </>
      )}
    </Box>
  );
};
