import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import { Card, Divider, CardHeader, Typography } from '@mui/material';

import { createStrategy, updateStrategy } from 'src/api/strategy';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { IOwner } from 'src/types/owner';
import { ITSTRATEGY, TEngagement } from 'src/types/strategy';

// ----------------------------------------------------------------------

const STRATEGY_STATUS = ['Active', 'Inactive'];

const STRATEGY_GROWTH = ['Linear', 'Exponential'];

const ENGAGEMENT_MODEL = ['All', 'Tweet', 'Retweet', 'Quote', 'Comment'];

type Props = {
  currentStrategy: ITSTRATEGY | any;
  handleUpdateData: (updatedOwner: IOwner) => void;
  onClose: VoidFunction;
};

export default function OwnerForm({ currentStrategy, handleUpdateData, onClose }: Props) {
  const [engagements, setEngagements] = useState<TEngagement[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const EventSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Title is required'),
    tweet_status: Yup.string(),
    tweet_max_day: Yup.string(),
    tweet_initial_day: Yup.string(),
    tweet_days2max: Yup.string(),
    tweet_growth: Yup.string(),
    tweet_fluctuation: Yup.string(),
    tweet_date: Yup.string(),
    follow_status: Yup.string(),
    follow_max_day: Yup.string(),
    follow_initial_day: Yup.string(),
    follow_days2max: Yup.string(),
    follow_growth: Yup.string(),
    follow_fluctuation: Yup.string(),
    follow_limit: Yup.string(),
    follow_date: Yup.string(),
    likes_status: Yup.string(),
    likes_max_day: Yup.string(),
    likes_initial_day: Yup.string(),
    likes_days2max: Yup.string(),
    likes_growth: Yup.string(),
    likes_fluctuation: Yup.string(),
    likes_date: Yup.string(),
    bookmark_status: Yup.string(),
    bookmark_max_day: Yup.string(),
    bookmark_initial_day: Yup.string(),
    bookmark_days2max: Yup.string(),
    bookmark_growth: Yup.string(),
    bookmark_fluctuation: Yup.string(),
    bookmark_date: Yup.string(),
    quote_status: Yup.string(),
    quote_max_day: Yup.string(),
    quote_initial_day: Yup.string(),
    quote_days2max: Yup.string(),
    quote_growth: Yup.string(),
    quote_fluctuation: Yup.string(),
    quote_date: Yup.string(),
    comment_status: Yup.string(),
    comment_max_day: Yup.string(),
    comment_initial_day: Yup.string(),
    comment_days2max: Yup.string(),
    comment_growth: Yup.string(),
    comment_fluctuation: Yup.string(),
    comment_date: Yup.string(),
    model_username: Yup.string(),
    model_option: Yup.string(),
    bio: Yup.string(),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: {
      name: currentStrategy?.name || '',
      tweet_status: currentStrategy?.tweet_status || 'Active',
      tweet_max_day: currentStrategy?.tweet_max_day || '',
      tweet_initial_day: currentStrategy?.tweet_initial_day || '',
      tweet_days2max: currentStrategy?.tweet_days2max || '',
      tweet_growth: currentStrategy?.tweet_growth || 'Linear',
      tweet_fluctuation: currentStrategy?.tweet_fluctuation || '',
      tweet_date: currentStrategy?.tweet_date || '',
      follow_status: currentStrategy?.follow_status || 'Active',
      follow_max_day: currentStrategy?.follow_max_day || '',
      follow_initial_day: currentStrategy?.follow_initial_day || '',
      follow_days2max: currentStrategy?.follow_days2max || '',
      follow_growth: currentStrategy?.follow_growth || 'Linear',
      follow_fluctuation: currentStrategy?.follow_fluctuation || '',
      follow_limit: currentStrategy?.follow_limit || '',
      follow_date: currentStrategy?.follow_date || '',
      likes_status: currentStrategy?.likes_status || 'Active',
      likes_max_day: currentStrategy?.likes_max_day || '',
      likes_initial_day: currentStrategy?.likes_initial_day || '',
      likes_days2max: currentStrategy?.likes_days2max || '',
      likes_growth: currentStrategy?.likes_growth || 'Linear',
      likes_fluctuation: currentStrategy?.likes_fluctuation || '',
      likes_date: currentStrategy?.likes_date || '',
      bookmark_status: currentStrategy?.bookmark_status || 'Active',
      bookmark_max_day: currentStrategy?.bookmark_max_day || '',
      bookmark_initial_day: currentStrategy?.bookmark_initial_day || '',
      bookmark_days2max: currentStrategy?.bookmark_days2max || '',
      bookmark_growth: currentStrategy?.bookmark_growth || 'Linear',
      bookmark_fluctuation: currentStrategy?.bookmark_fluctuation || '',
      bookmark_date: currentStrategy?.bookmark_date || '',
      quote_status: currentStrategy?.quote_status || 'Active',
      quote_max_day: currentStrategy?.quote_max_day || '',
      quote_initial_day: currentStrategy?.quote_initial_day || '',
      quote_days2max: currentStrategy?.quote_days2max || '',
      quote_growth: currentStrategy?.quote_growth || 'Linear',
      quote_fluctuation: currentStrategy?.quote_fluctuation || '',
      quote_date: currentStrategy?.quote_date || '',
      comment_status: currentStrategy?.comment_status || 'Active',
      comment_max_day: currentStrategy?.comment_max_day || '',
      comment_initial_day: currentStrategy?.comment_initial_day || '',
      comment_days2max: currentStrategy?.comment_days2max || '',
      comment_growth: currentStrategy?.comment_growth || 'Linear',
      comment_fluctuation: currentStrategy?.comment_fluctuation || '',
      comment_date: currentStrategy?.comment_date || '',
      model_username: '',
      model_option: 'All',
    },
  });

  useEffect(() => {
    if (currentStrategy?.engagements) {
      setEngagements(currentStrategy.engagements);
    }
  }, [currentStrategy]);

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!currentStrategy?.id) {
        const saveData = { ...data, engagements };
        const saveResult = await createStrategy(saveData);
        if (saveResult.result) {
          enqueueSnackbar('Create success!');
        }
        handleUpdateData(saveResult.result);
      } else {
        const updateData = { ...data, engagements, id: currentStrategy?.id };
        const updateResult = await updateStrategy(updateData);
        enqueueSnackbar('Update success!');
        handleUpdateData(updateResult.result);
      }
      onClose();
      reset();
    } catch (error) {
      console.error(error);
    }
  });

  const addTodo = () => {
    if (values.model_username && values.model_option) {
      const newModelData = {
        model_username: values.model_username,
        model_option: values.model_option,
      } as TEngagement;

      setEngagements([...engagements, newModelData]);
    }
  };

  const removeTodo = (index: number) => {
    const newTodos = engagements.filter((_, todoIndex) => todoIndex !== index);
    setEngagements(newTodos);
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFTextField name="name" label="Name" />

        <Divider />

        <Card>
          <CardHeader title="Tweets" />

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
            >
              <RHFSelect
                native
                name="tweet_status"
                label="Status"
                InputLabelProps={{ shrink: true }}
              >
                {STRATEGY_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect
                native
                name="tweet_growth"
                label="Growth"
                InputLabelProps={{ shrink: true }}
              >
                {STRATEGY_GROWTH.map((growth) => (
                  <option key={growth} value={growth}>
                    {growth}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="tweet_date" label="Start Date" type="number" />

              <RHFTextField name="tweet_max_day" label="Max Per Day" type="number" />

              <RHFTextField name="tweet_initial_day" label="Initial Per Day" type="number" />

              <RHFTextField name="tweet_days2max" label="Days To Max" type="number" />

              <RHFTextField name="tweet_fluctuation" label="Fluctuation %" type="number" />
            </Box>
          </Stack>
        </Card>

        <Divider />

        <Card>
          <CardHeader title="Follow" />

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
            >
              <RHFSelect
                native
                name="follow_status"
                label="Status"
                InputLabelProps={{ shrink: true }}
              >
                {STRATEGY_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect
                native
                name="follow_growth"
                label="Growth"
                InputLabelProps={{ shrink: true }}
              >
                {STRATEGY_GROWTH.map((growth) => (
                  <option key={growth} value={growth}>
                    {growth}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="follow_limit" label="Limit" type="number" />

              <RHFTextField name="follow_date" label="Start Date" type="number" />

              <RHFTextField name="follow_max_day" label="Max Per Day" type="number" />

              <RHFTextField name="follow_initial_day" label="Initial Per Day" type="number" />

              <RHFTextField name="follow_days2max" label="Days To Max" type="number" />

              <RHFTextField name="follow_fluctuation" label="Fluctuation %" type="number" />
            </Box>
          </Stack>
        </Card>

        <Divider />

        <Card>
          <CardHeader title="Likes" />

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
            >
              <RHFSelect
                native
                name="likes_status"
                label="Status"
                InputLabelProps={{ shrink: true }}
              >
                {STRATEGY_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect
                native
                name="likes_growth"
                label="Growth"
                InputLabelProps={{ shrink: true }}
              >
                {STRATEGY_GROWTH.map((growth) => (
                  <option key={growth} value={growth}>
                    {growth}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="likes_date" label="Start Date" type="number" />

              <RHFTextField name="likes_max_day" label="Max Per Day" type="number" />

              <RHFTextField name="likes_initial_day" label="Initial Per Day" type="number" />

              <RHFTextField name="likes_days2max" label="Days To Max" type="number" />

              <RHFTextField name="likes_fluctuation" label="Fluctuation %" type="number" />
            </Box>
          </Stack>
        </Card>

        <Divider />

        <Card>
          <CardHeader title="Bookmark" />

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
            >
              <RHFSelect
                native
                name="bookmark_status"
                label="Status"
                InputLabelProps={{ shrink: true }}
              >
                {STRATEGY_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect
                native
                name="bookmark_growth"
                label="Growth"
                InputLabelProps={{ shrink: true }}
              >
                {STRATEGY_GROWTH.map((growth) => (
                  <option key={growth} value={growth}>
                    {growth}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="bookmark_date" label="Start Date" type="number" />

              <RHFTextField name="bookmark_max_day" label="Max Per Day" type="number" />

              <RHFTextField name="bookmark_initial_day" label="Initial Per Day" type="number" />

              <RHFTextField name="bookmark_days2max" label="Days To Max" type="number" />

              <RHFTextField name="bookmark_fluctuation" label="Fluctuation %" type="number" />
            </Box>
          </Stack>
        </Card>

        <Divider />

        <Card>
          <CardHeader title="Quote" />

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
            >
              <RHFSelect
                native
                name="quote_status"
                label="Status"
                InputLabelProps={{ shrink: true }}
              >
                {STRATEGY_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect
                native
                name="quote_growth"
                label="Growth"
                InputLabelProps={{ shrink: true }}
              >
                {STRATEGY_GROWTH.map((growth) => (
                  <option key={growth} value={growth}>
                    {growth}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="quote_date" label="Start Date" type="number" />

              <RHFTextField name="quote_max_day" label="Max Per Day" type="number" />

              <RHFTextField name="quote_initial_day" label="Initial Per Day" type="number" />

              <RHFTextField name="quote_days2max" label="Days To Max" type="number" />

              <RHFTextField name="quote_fluctuation" label="Fluctuation %" type="number" />
            </Box>
          </Stack>
        </Card>

        <Divider />

        <Card>
          <CardHeader title="Comment" />

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
            >
              <RHFSelect
                native
                name="comment_status"
                label="Status"
                InputLabelProps={{ shrink: true }}
              >
                {STRATEGY_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect
                native
                name="comment_growth"
                label="Growth"
                InputLabelProps={{ shrink: true }}
              >
                {STRATEGY_GROWTH.map((growth) => (
                  <option key={growth} value={growth}>
                    {growth}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="comment_date" label="Start Date" type="number" />

              <RHFTextField name="comment_max_day" label="Max Per Day" type="number" />

              <RHFTextField name="comment_initial_day" label="Initial Per Day" type="number" />

              <RHFTextField name="comment_days2max" label="Days To Max" type="number" />

              <RHFTextField name="comment_fluctuation" label="Fluctuation %" type="number" />
            </Box>
          </Stack>
        </Card>

        <Divider />

        <Card>
          <CardHeader title="Engagement Models" />

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(3, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="model_username" label="Username" />
              <RHFSelect
                native
                name="model_option"
                label="Options"
                InputLabelProps={{ shrink: true }}
              >
                {ENGAGEMENT_MODEL.map((growth) => (
                  <option key={growth} value={growth}>
                    {growth}
                  </option>
                ))}
              </RHFSelect>
              <Button onClick={addTodo}>+ Add</Button>
            </Box>
            {engagements?.map((todo, index) => (
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(3, 1fr)',
                  md: 'repeat(3, 1fr)',
                }}
                key={index}
              >
                <Typography> {todo.model_username}</Typography>
                <Typography> {todo.model_option}</Typography>
                <Button color="warning" onClick={() => removeTodo(index)}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </Button>
              </Box>
            ))}
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
