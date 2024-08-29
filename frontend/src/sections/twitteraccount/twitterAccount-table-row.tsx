import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';
import { Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';

import { updateTwitterAccountOwner, updateTwitterAccountStrategy } from 'src/api/twitterAccount';

import Label from 'src/components/label/label';

import { IOwner } from 'src/types/owner';
import { ISTRATEGY } from 'src/types/strategy';
import { ITwitterAccount } from 'src/types/twitter';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};
type OwnerParamsProps = {
  owners: IOwner[];
  params: GridCellParams;
  handleUpdateData: (updatedTwitterAccount: ITwitterAccount) => void;
};
type StrategyParamsProps = {
  strategies: ISTRATEGY[];
  params: GridCellParams;
  handleUpdateData: (updatedTwitterAccount: ITwitterAccount) => void;
};

export function RenderCellUserName({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <Avatar
        alt={params.row.username}
        src={params.row.profile_pic[0]}
        variant="rounded"
        sx={{ width: 24, height: 24, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={params.row.username}
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

export function RenderCellSB({ params }: ParamsProps) {
  const getSBANText = (sban: string) => {
    if (sban === '1') {
      return 'YES';
    }
    if (sban === '2') {
      return 'NO';
    }
    return '???';
  };

  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <Label
        variant="soft"
        color={
          (params.row.gban === '1' && 'success') ||
          (params.row.gban === '2' && 'warning') ||
          params.row.gban ||
          'warning'
        }
      >
        {getSBANText(params.row.gban)}
      </Label>
    </Stack>
  );
}

export function RenderCellGhosty({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <Label
        variant="soft"
        color={
          (params.row.gban > 70 && 'success') ||
          (params.row.gban <= 70 && params.row.gban > 30 && 'warning') ||
          (params.row.gban <= 30 && 'warning') ||
          'warning'
        }
      >
        {params.row.gban ? `${params.row.gban * 100}%` : '???'}
      </Label>
    </Stack>
  );
}

export function RenderCellTrb({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <Label
        variant="soft"
        color={
          (params.row.trban === '1' && 'success') ||
          (params.row.trban === '2' && 'warning') ||
          params.row.trban ||
          'warning' ||
          'default'
        }
      >
        {params.row.trban ? 'Active' : 'Inactive'}
      </Label>
    </Stack>
  );
}

export function RenderCellOwner({ owners, params, handleUpdateData }: OwnerParamsProps) {
  const [selectedValue, setSelectedValue] = useState<string>(params.row?.owner);

  useEffect(() => {
    setSelectedValue(params.row?.owner);
  }, [params.row?.owner]);

  // Handle change event
  const handleChange = async (event: SelectChangeEvent<string>) => {
    setSelectedValue(event.target.value);
    const updateResult = await updateTwitterAccountOwner({
      id: params.row.id,
      owner: event.target.value,
    });
    handleUpdateData(updateResult.result);
  };
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <FormControl fullWidth>
        <Select value={selectedValue} onChange={handleChange}>
          <MenuItem value="" />
          {owners?.map((owner) => (
            <MenuItem key={owner.id} value={owner.id}>
              {owner.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

export function RenderCellStrategy({ strategies, params, handleUpdateData }: StrategyParamsProps) {
  const [selectedValue, setSelectedValue] = useState<string>(params.row?.strategy || '');

  useEffect(() => {
    setSelectedValue(params.row?.strategy);
  }, [params.row?.strategy]);
  // Handle change event
  const handleChange = async (event: SelectChangeEvent<string>) => {
    setSelectedValue(event.target.value);
    const updateResult = await updateTwitterAccountStrategy({
      id: params.row.id,
      strategy: event.target.value,
    });
    handleUpdateData(updateResult.result);
  };
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <FormControl fullWidth>
        <Select value={selectedValue} onChange={handleChange}>
          <MenuItem value="" />
          {strategies?.map((strategy) => (
            <MenuItem key={strategy.id} value={strategy.id}>
              {strategy.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

export function RenderCellAge({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <ListItemText
        disableTypography
        primary={calculateAge(params.row.createdAt)}
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

function calculateAge(timestamp: string): string {
  // Convert the string timestamp to a number (assuming the timestamp is in seconds since Unix epoch)
  const timestampNum = Date.parse(timestamp); // Convert the date string to milliseconds

  const diff = (Date.now() - timestampNum) / 1000; // Difference in milliseconds

  if (diff < 60) {
    return `${Math.floor(diff)} seconds ago`;
  }
  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (diff < 2592000) {
    // 30 days
    const days = Math.floor(diff / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (diff < 31536000) {
    // 365 days
    const months = Math.floor(diff / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diff / 31536000);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}
