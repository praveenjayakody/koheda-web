import React, { useEffect, useState } from "react";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: 10,
    background: "#ff5722",
    borderRadius: 15,
    width: "100%",
    transition: theme.transitions.create('background'),
    '&:hover': {
      background: "#ff6c34"
    }
  }
}));


export default function BigButton({ children, onClick }) {
  const classes = useStyles();
  const { t, i18n } = useTranslation(['general']);

  const [icon, setIcon] = useState('fuel');
  // let icon = "custom";
  useEffect(() => {
    if (children.indexOf("petrol") > -1 || children.indexOf("diesel") > -1) {
      setIcon("fuel");
    }
  }, [children]);

  return (
    <ButtonBase
      focusRipple
      onClick={onClick}
      className={classes.button}
    >
      <Grid container direction="column">
        <Grid item>
          <img src={require("../images/facilities/" + icon + ".png")} width={50} />
        </Grid>
        <Grid item>
          <Typography variant="h4">{t("item." + children)}</Typography>
        </Grid>
      </Grid>
    </ButtonBase>
  )
}
