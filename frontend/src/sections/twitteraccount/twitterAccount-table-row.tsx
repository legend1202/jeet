import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';
// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
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
      return '???';
    } if (sban === '2') {
      return 'NO';
    } 
      return 'YES';
    
  };

  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <ListItemText
        disableTypography
        primary={getSBANText(params.row.sban)}
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

export function RenderCellGhosty({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <ListItemText
        disableTypography
        primary={params.row.gban ? `${params.row.gban * 100}%` : 0}
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

export function RenderCellTrb({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <ListItemText
        disableTypography
        primary={params.row.trban === 0 ? 'Inactive' : 'Active'}
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

export function RenderCellOwner({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <ListItemText
        disableTypography
        primary={params.row?.ownerDetails && params.row?.ownerDetails[0]?.name}
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

export function RenderCellStrategy({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <ListItemText
        disableTypography
        primary={params.row?.strategyDetails && params.row?.strategyDetails[0]?.name}
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
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
