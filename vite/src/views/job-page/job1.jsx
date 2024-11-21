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

const Job1 = () => {
  return (
    <div>
      <h1>Job 1 Page</h1>
      <p>This is the Job 1 page.</p>
    </div>
  );
};

export default Job1;