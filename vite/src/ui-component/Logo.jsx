// material-ui
import { useTheme } from '@mui/material/styles';

import logoPath from 'assets/images/JobPal_logo.svg'
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme();

  return (
    <img src={logoPath}
    alt="JobPal Logo"
    style={{ 
      width: '100px', 
      // height: '50px',
      objectFit: 'contain'  // 保持圖片的原始比例
    }}
    />
  );
};

export default Logo;
