import { createMuiTheme } from '@material-ui/core/styles';
import { yellow, orange } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: yellow,
  },
});

export default theme;