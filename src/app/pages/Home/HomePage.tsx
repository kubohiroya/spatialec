import React, { useEffect } from 'react';
import { FullScreenBox } from '/components/FullScreenBox/FullScreenBox';
import AppHeader from '/components/AppHeader/AppHeader';
import { Share } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import GithubCorner from 'react-github-corner';
import { FileDropComponent } from '/app/components/FileDropComponent/FileDropComponent';
import { useLocalFileHandler } from './useLocalFileHandler';
import { APP_TITLE } from '/app/pages/Home/Constants';
// @ts-ignore
import packageInfo from '../../../../package.json?raw';

const packageJson = JSON.parse(packageInfo);

export const HomePage = () => {
  const navigate = useNavigate();
  const { handleFiles } = useLocalFileHandler();

  useEffect(() => {
    if (window.location.hash === '' || window.location.hash === '#/') {
      navigate('/projects', { replace: true });
    }
  }, [navigate]);

  return (
    <FullScreenBox>
      <FileDropComponent
        type={'projects'}
        acceptableSuffixes={['json.zip', '.json', '.csv']}
        handleFiles={handleFiles}
        onFinish={(lastUpdated: number) => {
          console.log('finish loading: ', lastUpdated);
        }}
      >
        <AppHeader startIcon={<Share fontSize={'large'} />}>
          {APP_TITLE}
        </AppHeader>
        <Outlet />
      </FileDropComponent>
      <GithubCorner
        style={{ position: 'absolute', top: 0, right: 0 }}
        href={packageJson.repository.url}
        size={64}
      />
    </FullScreenBox>
  );
};
