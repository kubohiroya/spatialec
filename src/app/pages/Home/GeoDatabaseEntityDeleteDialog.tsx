import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import React, { useCallback } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { createProjectLink } from '/createProjectLink';
import dexie from 'dexie';
import { GeoDatabaseTableTypes } from '/app/models/GeoDatabaseTableType';

import { TypeIcons } from '/app/pages/Home/resource/TypeIcons';
import { ProjectTypes } from '/app/models/ProjectType';
import { ResourceTypes } from '/app/models/ResourceType';
import { Delete } from '@mui/icons-material';
import { ProjectTable } from '/app/services/database/ProjectTable';
import { Projects } from '/app/services/database/Projects';
import { ResourceTable } from '/app/services/database/ResourceTable';
import { Resources } from '/app/services/database/Resources';

type DeleteDatabaseItemDialogProps = {
  tableType: string;
};
export const GeoDatabaseEntityDeleteDialog = ({
  tableType,
}: DeleteDatabaseItemDialogProps) => {
  const { uuid, type, name } = useLoaderData() as {
    uuid: string;
    type: ProjectTypes | ResourceTypes;
    name: string | undefined;
    description: string | undefined;
  };

  const navigate = useNavigate();

  const goHome = useCallback(() => {
    switch (tableType) {
      case GeoDatabaseTableTypes.projects:
        navigate('/projects', { replace: true });
        break;
      case GeoDatabaseTableTypes.resources:
        navigate('/resources', { replace: true });
        break;
      default:
        throw new Error(`Unknown Type: ${tableType}`);
    }
  }, [navigate, tableType]);

  const handleDelete = useCallback(async () => {
    switch (tableType) {
      case GeoDatabaseTableTypes.projects:
        await dexie.delete(Projects.fileNameOf(tableType, uuid));
        await ProjectTable.deleteProject(uuid);

        break;
      case GeoDatabaseTableTypes.resources:
        await dexie.delete(Resources.fileNameOf(tableType, uuid));
        await ResourceTable.deleteResource(uuid);
        break;
      default:
        throw new Error(`Unknown Type: ${tableType}`);
    }
    goHome();
  }, [goHome, uuid]);

  const handleCancel = useCallback(() => {
    goHome();
  }, [goHome]);

  return (
    <Dialog open={true}>
      <DialogTitle>
        {TypeIcons[type]} Delete
        {tableType === GeoDatabaseTableTypes.projects
          ? ' project'
          : ' resource'}
      </DialogTitle>
      <DialogContent dividers>
        <Typography>
          Are you sure you want to delete the following item?
        </Typography>
        <Link to={createProjectLink({ uuid, type })}>{name}</Link>
      </DialogContent>
      <DialogActions>
        <Button
          variant={'outlined'}
          onClick={handleDelete}
          endIcon={<Delete />}
        >
          Delete
        </Button>
        <Button variant={'contained'} autoFocus onClick={handleCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
