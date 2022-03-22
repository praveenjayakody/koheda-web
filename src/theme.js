import { createTheme } from '@material-ui/core/styles';
import { yellow, green } from '@material-ui/core/colors';

const theme = createTheme({
  palette: {
    primary: green,
    secondary: yellow,
  },
});

export default theme;