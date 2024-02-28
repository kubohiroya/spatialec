import { GeoDatabaseTableTypes } from '/app/models/GeoDatabaseTableType';
import React, { useCallback, useState } from 'react';
import { GeoDatabaseEntityUpsertDialog } from '/app/pages/Home/GeoDatabaseEntityUpsertDialog';
import { MapTileDialogContent } from '/app/pages/Home/resource/mapTile/MapTileDialogContent';
import { ResourceTypes } from '/app/models/ResourceType';

import { ResourceTable } from '/app/services/database/ResourceTable';
import { generateNewName } from '/app/utils/nameUtil';

export const MapTileDialog = () => {
  const onSubmit = useCallback(
    async (values: {
      uuid: string | undefined;
      type: string;
      formData: FormData;
    }) => {
      const formJson = Object.fromEntries(
        (values.formData as any).entries()
      ) as {
        name: string;
        description: string;
        apiKey: string;
        mapName: string;
      };

      if (!values.uuid) {
        await ResourceTable.createResource(undefined, ResourceTypes.mapTiles, {
          ...formJson,
        });
      } else {
        await ResourceTable.updateResource(
          values.uuid,
          ResourceTypes.mapTiles,
          {
            ...formJson,
          }
        );
      }
    },
    []
  );

  const [name, setName] = useState<string>('');

  ResourceTable.getResourcesByType(ResourceTypes.mapTiles).then((resources) => {
    const delimiter = 'MapTiler Cloud API Key #';
    const names = resources.map((resource) => resource.name);
    const newName = generateNewName(
      names,
      delimiter
    );
    setName(newName);
  });

  if (name === '') {
    return null;
  }

  return (
    <GeoDatabaseEntityUpsertDialog
      uuid={undefined}
      tableType={GeoDatabaseTableTypes.resources}
      type={ResourceTypes.mapTiles}
      onSubmit={onSubmit}
    >
      <MapTileDialogContent
        name={name}
        mapName={'openstreetmap'}
        description={''}
        apiKey={''}
      />
    </GeoDatabaseEntityUpsertDialog>
  );
};


