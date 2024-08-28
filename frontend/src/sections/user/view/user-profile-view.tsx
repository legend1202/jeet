'use client';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { Dialog, DialogTitle } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProfileCover from '../profile-cover';
import ProfileForm from '../profile-edit-form';

export default function UserProfileView() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const [openForm, setOpenForm] = useState<boolean>(false);

  const handleNewOwnerPopOver = () => {
    setOpenForm(true);
  };

  const onCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Profile"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'User', href: paths.dashboard.user.root },
            { name: user?.displayName },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card
          sx={{
            mb: 3,
            height: 290,
          }}
        >
          <ProfileCover user={user} handleNewOwnerPopOver={handleNewOwnerPopOver} />
        </Card>
      </Container>
      <Dialog fullWidth maxWidth="xs" open={openForm} onClose={onCloseForm}>
        <DialogTitle sx={{ minHeight: 76 }}>Edit Profile</DialogTitle>

        <ProfileForm user={user} onClose={onCloseForm} />
      </Dialog>
    </>
  );
}
