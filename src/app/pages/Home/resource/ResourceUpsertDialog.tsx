import { useLoaderData } from 'react-router-dom';
import { GeoDatabaseTableTypes } from '/app/models/GeoDatabaseTableType';
import React, { useCallback } from 'react';
import { DialogContent, FormControl, TextField } from '@mui/material';
import { GeoDatabaseEntityUpsertDialog } from '/app/pages/Home/GeoDatabaseEntityUpsertDialog';
import { ResourceTypes } from '/app/models/ResourceType';
import { ProjectTypes } from '/app/models/ProjectType';
import { MapTileDialogContent } from '/app/pages/Home/resource/mapTile/MapTileDialogContent';
import { ResourceTable } from '/app/services/database/ResourceTable';
import { generateNewName } from '/app/utils/nameUtil';

const GeoDatabaseEntityDialogContent = ({
  type,
  name,
  description,
}: {
  type: string;
  name: string | undefined;
  description: string | undefined;
}) => {
  return (
    <>
      Please enter the name and description of this {type}.
      <FormControl style={{ display: 'flex' }}>
        <TextField
          name="name"
          autoComplete="off"
          defaultValue={name}
          label="Name"
          autoFocus
          required
          fullWidth
          margin="dense"
        />
        <TextField
          autoComplete="off"
          name={'description'}
          defaultValue={description}
          label="Description"
          multiline={true}
          rows={8}
          fullWidth
          margin="dense"
        />
      </FormControl>
    </>
  );
};

export const ResourceUpsertDialog = () => {
  const { uuid, type, name, description, mapName, apiKey } = useLoaderData() as {
    uuid: string | undefined;
    type: ResourceTypes;
    name: string | undefined;
    description: string | undefined;
    mapName:string | undefined;
    apiKey: string | undefined;
  };

  const onSubmit = useCallback(
    async (values: {
      uuid: string | undefined;
      type: ResourceTypes | ProjectTypes;
      formData: FormData;
    }) => {
      const formJson = Object.fromEntries(
        (values.formData as any).entries(),
      ) as {
        name: string;
        description: string;
      };

      if (!uuid) {
        await ResourceTable.createResource(uuid, type,{
          ...formJson,
          items: [],
        });
      } else {
        await ResourceTable.updateResource(uuid, type,{
          ...formJson,
        });
      }
    },
    [type, uuid],
  );

  return (
    <GeoDatabaseEntityUpsertDialog
      uuid={uuid}
      tableType={GeoDatabaseTableTypes.resources}
      type={type}
      onSubmit={onSubmit}
    >
      <DialogContent>
        {type === ResourceTypes.gadmGeoJSON && (
          <GeoDatabaseEntityDialogContent
            type={'resource'}
            {...{ name, description }}
          />
        )}
        {type === ResourceTypes.mapTiles && (
          <MapTileDialogContent {...{ name, description, mapName, apiKey }} />
        )}
      </DialogContent>
    </GeoDatabaseEntityUpsertDialog>
  );
};
