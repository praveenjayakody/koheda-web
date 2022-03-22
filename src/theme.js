import { createTheme } from '@material-ui/core/styles';
import { yellow, orange } from '@material-ui/core/colors';

const theme = createTheme({
  palette: {
    primary: orange,
    secondary: yellow,
  },
});

export default theme;