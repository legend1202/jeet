import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import { Card, Divider, CardHeader, Typography } from '@mui/material';

import { getTimezones } from 'src/utils/timezone';

import { upload } from 'src/api/upload';
import { useGetOnwers } from 'src/api/owner';
import { useGetStrategy } from 'src/api/strategy';
import { createTwitterAccount, updateTwitterAccount } from 'src/api/twitterAccount';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFUpload, RHFTextField } from 'src/components/hook-form';

import { IOwner } from 'src/types/owner';
import { Timezone } from 'src/types/timezone';
import { ISTRATEGY } from 'src/types/strategy';
import { IUploadUrlType, ITwitterAccount, ITTwitterAccount } from 'src/types/twitter';

// ----------------------------------------------------------------------

const TWITTER_BLUE = ['Unverified', 'Verified'];

type Props = {
  currentTwitterAccount: ITwitterAccount | any;
  handleUpdateData: (updatedTwitterAccount: ITwitterAccount) => void;
  onClose: VoidFunction;
};

export default function OwnerForm({ currentTwitterAccount, handleUpdateData, onClose }: Props) {
  const [profileUrls, setProfileUrls] = useState([] as IUploadUrlType);
  const [bannerUrls, setBannerUrls] = useState([] as IUploadUrlType);

  const [timezones, setTimezones] = useState<Timezone[]>([]);

  useEffect(() => {
    setTimezones(getTimezones());
  }, []);

  const { enqueueSnackbar } = useSnackbar();

  const { owners } = useGetOnwers();
  const { strategies } = useGetStrategy();

  const EventSchema = Yup.object().shape({
    username: Yup.string().max(255).required('Title is required'),
    password: Yup.string(),
    totp_secret: Yup.string(),
    additional_data: Yup.string(),
    auth_token: Yup.string(),
    proxy: Yup.string(),
    twitter_blue: Yup.string(),
    owner: Yup.string(),
    strategy: Yup.string(),
    timezone: Yup.string(),
    start_date: Yup.string(),
    personality_prompt: Yup.string(),
    twitter_name: Yup.string(),
    profile_pic: Yup.array(),
    banner_pic: Yup.array(),
    bio: Yup.string(),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: {
      username: currentTwitterAccount?.username || '',
      auth_token: currentTwitterAccount?.auth_token || '',
      twitter_blue: currentTwitterAccount?.twitter_blue || '',
      owner: currentTwitterAccount?.owner || '',
      proxy: currentTwitterAccount?.proxy || '',
      twitter_name: currentTwitterAccount?.twitter_name || '',
      profile_pic: currentTwitterAccount?.profile_pic || [],
      banner_pic: currentTwitterAccount?.banner_pic || [],
      personality_prompt: currentTwitterAccount?.personality_prompt || '',
      strategy: currentTwitterAccount?.strategy || '',
      timezone: currentTwitterAccount?.timezone || '',
      start_date: currentTwitterAccount?.start_date || '',
      additional_data: currentTwitterAccount?.additional_data || '',
      password: currentTwitterAccount?.password || '',
      totp_secret: currentTwitterAccount?.totp_secret || '',
      bio: currentTwitterAccount?.bio || '',
    },
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentTwitterAccount?.id) {
      setProfileUrls(currentTwitterAccount.profile_pic);
      setBannerUrls(currentTwitterAccount.banner_pic);
    }
  }, [currentTwitterAccount]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!currentTwitterAccount?.id) {
        const saveData = {
          ...data,
          profile_pic: profileUrls,
          banner_pic: bannerUrls,
        } as ITTwitterAccount;

        const saveResult = await createTwitterAccount(saveData);

        if (saveResult.result) {
          enqueueSnackbar('Create success!');
        }
        handleUpdateData(saveResult.result);
      } else {
        const updateData = {
          ...data,
          profile_pic: profileUrls,
          banner_pic: bannerUrls,
          id: currentTwitterAccount?.id,
        } as ITTwitterAccount;

        const updateResult = await updateTwitterAccount(updateData);
        enqueueSnackbar('Update success!');
        handleUpdateData(updateResult.result);
      }
      onClose();
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  const handleDropProfile = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const uploadResult = await upload(acceptedFiles);

      const newUploadUrls = [uploadResult];
      setProfileUrls([...newUploadUrls]);
      setValue('profile_pic', [...newFiles], { shouldValidate: true });
    },
    [setValue]
  );

  const handleDropBanner = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const uploadResult = await upload(acceptedFiles);

      const newUploadUrls = [uploadResult];
      setBannerUrls([...newUploadUrls]);

      setValue('banner_pic', [...newFiles], { shouldValidate: true });
    },
    [setValue]
  );

  const handleRemoveFileProfile = useCallback(
    (inputFile: File | string) => {
      const filtered =
        values.profile_pic && values.profile_pic?.filter((file) => file !== inputFile);

      values.profile_pic?.forEach((file, index) => {
        if (file === inputFile) {
          const urlFiltered = profileUrls?.filter((_, pos) => index !== pos);
          setProfileUrls(urlFiltered);
        }
      });
      setValue('profile_pic', filtered);
    },
    [setValue, values.profile_pic, profileUrls]
  );

  const handleRemoveFileBanner = useCallback(
    (inputFile: File | string) => {
      const filtered = values.banner_pic && values.banner_pic?.filter((file) => file !== inputFile);

      values.banner_pic?.forEach((file, index) => {
        if (file === inputFile) {
          const urlFiltered = bannerUrls?.filter((_, pos) => index !== pos);
          setBannerUrls(urlFiltered);
        }
      });
      setValue('banner_pic', filtered);
    },
    [setValue, values.banner_pic, bannerUrls]
  );

  const handleRemoveAllFilesProfile = useCallback(() => {
    setValue('profile_pic', []);
    setBannerUrls([]);
  }, [setValue]);

  const handleRemoveAllFilesBanner = useCallback(() => {
    setValue('banner_pic', []);
    setBannerUrls([]);
  }, [setValue]);

  const handleUploadImage = async () => {
    console.log('');
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="username" label="User Name" />

              <RHFTextField name="password" label="Password" />

              <RHFTextField name="totp_secret" label="2FA Secret" />
            </Box>
          </Stack>
        </Card>
        <Card>
          <CardHeader title="Additional login data" />
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="additional_data" label="Email or Phone" />
              <RHFTextField name="auth_token" label="Auth Token" />
              <RHFTextField name="proxy" label="Proxy" placeholder="username:password@ip:port" />
            </Box>
          </Stack>
        </Card>

        <Divider />

        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFSelect
                native
                name="twitter_blue"
                label="Twitter Blue"
                InputLabelProps={{ shrink: true }}
              >
                {TWITTER_BLUE.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect native name="owner" label="Owner" InputLabelProps={{ shrink: true }}>
                <option key="" value="" />
                {owners?.map((owner: IOwner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect native name="strategy" label="Strategy" InputLabelProps={{ shrink: true }}>
                <option key="" value="" />
                {strategies?.map((strategy: ISTRATEGY) => (
                  <option key={strategy.id} value={strategy.id}>
                    {strategy.name}
                  </option>
                ))}
              </RHFSelect>
            </Box>
          </Stack>
        </Card>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFSelect native name="timezone" label="Timezone" InputLabelProps={{ shrink: true }}>
                <option key="" value="" />
                {timezones?.map((timezone: Timezone) => (
                  <option key={timezone.label} value={timezone.utc}>
                    {`${timezone.label} ${timezone.utc}`}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="start_date" label="Start Date" type="Date" />
            </Box>
          </Stack>
        </Card>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField
                name="personality_prompt"
                label="Personality Prompt"
                multiline
                rows={3}
              />
            </Box>
          </Stack>
        </Card>

        <Divider />

        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField name="twitter_name" label="Twitter Name" />

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Profile Picture</Typography>
                <RHFUpload
                  multiple
                  thumbnail
                  name="profile_pic"
                  maxSize={13145728}
                  onDrop={handleDropProfile}
                  onRemove={handleRemoveFileProfile}
                  onRemoveAll={handleRemoveAllFilesProfile}
                  onUpload={handleUploadImage}
                />
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Banner Picture</Typography>
                <RHFUpload
                  multiple
                  thumbnail
                  name="banner_pic"
                  maxSize={13145728}
                  onDrop={handleDropBanner}
                  onRemove={handleRemoveFileBanner}
                  onRemoveAll={handleRemoveAllFilesBanner}
                  onUpload={handleUploadImage}
                />
              </Stack>

              <RHFTextField name="bio" label="Bio" multiline rows={3} />
            </Box>
          </Stack>
        </Card>
      </Stack>

      <DialogActions>
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Save Changes
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
