import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

import { gridSpacing } from 'store/constant';

// ===============================|| SHADOW BOX ||=============================== //

const ShadowBox = ({ shadow }) => {
  return (
    <Card sx={{ mb: 3, boxShadow: shadow }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4.5,
          bgcolor: 'primary.light',
          color: 'grey.800'
        }}
      >
        <Box sx={{ color: 'inherit' }}> boxShadow: {shadow}</Box>
      </Box>
    </Card>
  );
};

ShadowBox.propTypes = {
  shadow: PropTypes.string.isRequired
};

// ===============================|| SHADOW BOX ||=============================== //

const CustomShadowBox = ({ shadow, label, color, link }) => (
  <Card 
    component={link ? RouterLink : 'div'} // 如果有 link，則使用 RouterLink
    to={link} // RouterLink 的目標路徑
    sx={{
      mb: 3,
      boxShadow: shadow,
      textDecoration: 'none', // 移除連結樣式
      cursor: link ? 'pointer' : 'default', 
      display: 'block' // 確保 `RouterLink` 不影響 `Card` 的布局
    }} 
  >
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4.5,
        bgcolor: 'primary.light',
          color: 'grey.800'
      }}
    >
      <Box sx={{ color: 'inherit' }}> Job {shadow}</Box>
      </Box>
  </Card>
);

CustomShadowBox.propTypes = {
  shadow: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired, 
  link: PropTypes.string
};

// ============================|| UTILITIES SHADOW ||============================ //

const UtilitiesShadow = () => {
  const theme = useTheme();

  return (
    <MainCard title="Job List" secondary={<SecondaryAction link="https://next.material-ui.com/system/shadows/" />}>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <SubCard title="In Progress">
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <CustomShadowBox shadow="1" link="/job-page/job1" />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <CustomShadowBox shadow="3" link="/job-page/job3" />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <CustomShadowBox shadow="5" />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <CustomShadowBox shadow="6" />
              </Grid>
            </Grid>
          </SubCard>
          <Box sx={{ mb: 3 }} />
          <SubCard title="Listed">
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <CustomShadowBox shadow="2"/>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <CustomShadowBox shadow="7" />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <CustomShadowBox shadow="8" />
              </Grid>
            </Grid>
          </SubCard>
          <Box sx={{ mb: 3 }} />
          <SubCard title="Closed">
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <CustomShadowBox shadow="4" />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <CustomShadowBox shadow="9" />
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default UtilitiesShadow;

