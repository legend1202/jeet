import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';
// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellProduct({ params }: ParamsProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 1, width: 1 }}>
      <Avatar
        alt={params.row.name}
        src={params.row.coverUrl}
        variant="rounded"
        sx={{ width: 24, height: 24, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={params.row.name}
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
