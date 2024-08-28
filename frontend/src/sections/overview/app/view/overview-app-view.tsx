'use client';

import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useGetOnwers } from 'src/api/owner';
import { useGetStrategy } from 'src/api/strategy';
import { useGetTwitterAccount } from 'src/api/twitterAccount';

import { useSettingsContext } from 'src/components/settings';

import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const theme = useTheme();

  const { strategies } = useGetStrategy();
  const { owners } = useGetOnwers();
  const { twitterAccounts } = useGetTwitterAccount();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Owners"
            percent={2.6}
            total={owners ? owners.length : 0}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Strategies"
            percent={0.2}
            total={strategies ? strategies.length : 0}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Twitter Account"
            percent={-0.1}
            total={twitterAccounts ? twitterAccounts.length : 0}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
