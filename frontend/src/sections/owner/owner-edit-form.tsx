import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';

import { createOwner, updateOwner } from 'src/api/owner';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { IOwner } from 'src/types/owner';

// ----------------------------------------------------------------------

type Props = {
  currentOwner: IOwner;
  handleUpdateData: (updatedOwner: IOwner) => void;
  onClose: VoidFunction;
};

export default function OwnerForm({ currentOwner, handleUpdateData, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const EventSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Title is required'),
    bio: Yup.string(),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: { name: currentOwner.name, bio: currentOwner.bio },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!currentOwner.id) {
        const saveResult = await createOwner(data);
        if (saveResult.result) {
          enqueueSnackbar('Create success!');
        }
        handleUpdateData(saveResult.result);
      } else {
        const updateResult = await updateOwner({ ...data, id: currentOwner.id });
        enqueueSnackbar('Update success!');
        handleUpdateData(updateResult.result);
      }
      onClose();
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFTextField name="name" label="Name" />

        <RHFTextField name="bio" label="Bio" multiline rows={3} />
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
