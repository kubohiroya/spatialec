import { Checkbox, Radio, RadioGroup } from '@mui/material';
import { TreeView } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { StyledTreeItem } from '/components/TreeView/StyledTreeItem';
import { Flag, LocationCity, Map, Route } from '@mui/icons-material';
import React, { useCallback, useEffect, useState } from 'react';
import {
  GADMGeoJsonResourceEntity,
  IdeGsmCitiesResourceEntity,
  IdeGsmRoutesResourceEntity,
  MapTileResourceEntity,
  ResourceEntity,
} from '/app/models/ResourceEntity';
import { ResourceTypes } from '/app/models/ResourceType';

import { ResourceTable } from '/app/services/database/ResourceTable';
import { Projects } from '/app/services/database/Projects';
import { useNotifyTableChanged } from '/app/services/database/useNotifyTableChanged';
import { MouseEvent } from 'react';

export const LayersPanelComponent = ({ uuid }: { uuid: string }) => {
  const [mapTileResourceEntities, setMapTileResourceEntities] = useState<
    MapTileResourceEntity[]
  >([]);

  const [gadmGeoJsonResourceEntities, setGadmGeoJsonResourceEntities] =
    useState<GADMGeoJsonResourceEntity[]>([]);

  const [ideGsmCitiesResourceEntities, setIdeGsmCitiesResourceEntities] =
    useState<IdeGsmCitiesResourceEntity[]>([]);

  const [ideGsmRoutesResourceEntities, setIdeGsmRoutesResourceEntities] =
    useState<IdeGsmRoutesResourceEntity[]>([]);

  const [enabledMapTile, setEnabledMapTile] = useState<boolean>(false);
  const [selectedMapTileUuid, setSelectedMapTileUuid] = useState<string>('');
  const [enabledGADMGeoJson, setEnabledGADMGeoJson] = useState<boolean>(false);
  const [selectedGADMGeoJsonUuid, setSelectedGADMGeoJsonUuid] = useState<
    string[]
  >([]);

  const syncEnabledStateFromDBtoState = useCallback(() => {
    Projects.openProject(uuid).then((database) =>
      database.getLayerPanelState().then((layerPanelState) => {
        if (layerPanelState) {
          setEnabledMapTile(layerPanelState.mapTileEnabled);
          setEnabledGADMGeoJson(layerPanelState.gadmGeoJsonEnabled);
        }
      })
    );
  }, [uuid]);

  const syncOptionsFromDBtoState = useCallback(async() => {
    ResourceTable.getResourcesByType(ResourceTypes.mapTiles).then(
      (mapTilerApiKeyResourceEntities: ResourceEntity[]) => {
        setMapTileResourceEntities(
          mapTilerApiKeyResourceEntities as unknown as MapTileResourceEntity[]
        );
      }
    );

    ResourceTable.getResourcesByType(ResourceTypes.gadmGeoJSON).then(
      (gadmGeoJsonResourceEntities: ResourceEntity[]) => {
        setGadmGeoJsonResourceEntities(
          gadmGeoJsonResourceEntities as unknown as GADMGeoJsonResourceEntity[]
        );
      }
    );

    ResourceTable.getResourcesByType(ResourceTypes.idegsmCities).then(
      (ideGsmCitiesResourceEntities: ResourceEntity[]) => {
        setIdeGsmCitiesResourceEntities(
          ideGsmCitiesResourceEntities as unknown as IdeGsmCitiesResourceEntity[]
        );
      }
    );

    ResourceTable.getResourcesByType(ResourceTypes.idegsmRoutes).then(
      (ideGsmRoutesResourceEntities: ResourceEntity[]) => {
        setIdeGsmRoutesResourceEntities(
          ideGsmRoutesResourceEntities as unknown as IdeGsmRoutesResourceEntity[]
        );
      }
    );
  }, []);

  const syncSelectedStateFromDBtoState = useCallback(() => {
    Projects.openProject(uuid).then((database) =>
      database.getLayerPanelState().then((selectedResourceUUIDs) => {
        if (selectedResourceUUIDs) {
          setSelectedMapTileUuid(selectedResourceUUIDs.mapTileUuid);
          setSelectedGADMGeoJsonUuid(selectedResourceUUIDs.gadmGeoJsonUuid);
        }
      })
    );
  }, [uuid]);

  useNotifyTableChanged(Projects.openProject(uuid), Projects.layerPanelState, () => {
    syncOptionsFromDBtoState();
    syncSelectedStateFromDBtoState();
  });

  useEffect(() => {
    syncOptionsFromDBtoState();
    syncEnabledStateFromDBtoState();
    syncSelectedStateFromDBtoState();
  }, [syncEnabledStateFromDBtoState, syncOptionsFromDBtoState, syncSelectedStateFromDBtoState]);

  const updateEnabledState = (event: MouseEvent, type: string)=>{
    event.stopPropagation();
    if (type === ResourceTypes.mapTiles) {
      const newEnabledMapTile = !enabledMapTile
      setEnabledMapTile(newEnabledMapTile);
      Projects.openProject(uuid).then((project) => {
        project.updateLayerPanelState({
          mapTileEnabled: newEnabledMapTile
        });
      });

    }
    else if (type === ResourceTypes.gadmGeoJSON) {
      const newEnabledGADMGeoJSON = !enabledGADMGeoJson
      setEnabledGADMGeoJson(newEnabledGADMGeoJSON);
      Projects.openProject(uuid).then((project) => {
        project.updateLayerPanelState({
          gadmGeoJsonEnabled: newEnabledGADMGeoJSON
        });
      });
    }
  }

  const updateSelectState = (uuid: string, type: string, value: string)=>{
    switch (type){
      case ResourceTypes.mapTiles:
        setSelectedMapTileUuid(value);
        Projects.openProject(uuid).then((project) => {
          project.updateLayerPanelState({
            mapTileUuid: value,
          });
        });
        break;
      case ResourceTypes.gadmGeoJSON:
        (()=>{
          const newSelectedGADMGeoJsonUuid =
            selectedGADMGeoJsonUuid.includes(
              value
            )
              ? selectedGADMGeoJsonUuid.filter(
                (uuid) => value !== uuid
              )
              : [
                ...selectedGADMGeoJsonUuid,
                value,
              ];
          setSelectedGADMGeoJsonUuid(newSelectedGADMGeoJsonUuid);

          Projects.openProject(uuid).then((project) =>
            project.updateLayerPanelState({
              gadmGeoJsonUuid: newSelectedGADMGeoJsonUuid,
            })
          );

        })();
        break;
    }
  }

  return (
    <TreeView
      style={{
        overflow: 'scroll',
      }}
      multiSelect
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={[
        ResourceTypes.mapTiles,
        ResourceTypes.gadmGeoJSON,
        ResourceTypes.idegsmCities,
        ResourceTypes.idegsmRoutes,
      ]}
    >
      <StyledTreeItem
        nodeId={ResourceTypes.mapTiles}
        level={1}
        labelText="MapTiler"
        labelIcon={Map}
        control={<Checkbox checked={enabledMapTile} onClick={(event: React.MouseEvent)=>updateEnabledState(event, ResourceTypes.mapTiles)}/>}
      >
        <RadioGroup
          value={selectedMapTileUuid}
          name="mapTileOptionGroup"
        >
          {mapTileResourceEntities.map((mapTileResourceEntity) => (
            <StyledTreeItem
              disabled={!enabledMapTile}
              key={mapTileResourceEntity.uuid}
              nodeId={mapTileResourceEntity.uuid}
              level={2}
              labelText={mapTileResourceEntity.name}
              labelIcon={Map}
              control={<Radio
                checked={selectedMapTileUuid === mapTileResourceEntity.uuid}
                onClick={(event) => {
                  updateSelectState(uuid, ResourceTypes.mapTiles, mapTileResourceEntity.uuid);
                }}
              />}
              value={mapTileResourceEntity.uuid}
            />
          ))}
        </RadioGroup>
      </StyledTreeItem>

      <StyledTreeItem
        nodeId={ResourceTypes.gadmGeoJSON}
        level={1}
        labelText={`GADM GeoJSON`}
        labelIcon={Flag}
        control={<Checkbox checked={enabledGADMGeoJson} onClick={(event: React.MouseEvent)=>updateEnabledState(event, ResourceTypes.gadmGeoJSON)}/>}
      >
        {gadmGeoJsonResourceEntities.map((gadmGeoJsonResourceEntity) => (
          <StyledTreeItem
            key={gadmGeoJsonResourceEntity.uuid}
            nodeId={gadmGeoJsonResourceEntity.uuid}
            level={2}
            labelText={gadmGeoJsonResourceEntity.name}
            labelIcon={Flag}
            control={
              <Checkbox
                disabled={!enabledGADMGeoJson}
                name={gadmGeoJsonResourceEntity.uuid}
                checked={selectedGADMGeoJsonUuid.includes(
                  gadmGeoJsonResourceEntity.uuid
                )}
                value={gadmGeoJsonResourceEntity.uuid}
                onClick={(event) => {
                  updateSelectState(uuid, ResourceTypes.gadmGeoJSON, gadmGeoJsonResourceEntity.uuid);
                }}
              />
            }
          />
        ))}
      </StyledTreeItem>
      <StyledTreeItem
        nodeId={ResourceTypes.idegsmCities}
        level={1}
        labelText="Cities"
        labelIcon={LocationCity}
        control={<Checkbox/>}
      >
        {ideGsmCitiesResourceEntities.map((ideGsmCitiesResourceEntity) => (
          <StyledTreeItem
            key={ideGsmCitiesResourceEntity.uuid}
            nodeId={ideGsmCitiesResourceEntity.uuid}
            level={2}
            labelText={ideGsmCitiesResourceEntity.name}
            labelIcon={LocationCity}
            control={
              <Checkbox
                onChange={(event) => {
                  console.log('[idegsm city] uuid', uuid);
                }}
              />
            }
          />
        ))}
      </StyledTreeItem>
      <StyledTreeItem
        nodeId={ResourceTypes.idegsmRoutes}
        level={1}
        labelText="Routes"
        labelIcon={Route}
        control={<Checkbox/>}
      >
        {ideGsmRoutesResourceEntities.map((ideGsmRoutesResourceEntity) => (
          <StyledTreeItem
            key={ideGsmRoutesResourceEntity.uuid}
            nodeId={ideGsmRoutesResourceEntity.uuid}
            level={2}
            labelText={ideGsmRoutesResourceEntity.name}
            labelIcon={Route}
            control={
              <Checkbox
                onChange={(event) => {
                  // do something
                  console.log('[idegsm route] uuid', uuid);
                }}
              />
            }
          />
        ))}
      </StyledTreeItem>
    </TreeView>
  );
};
