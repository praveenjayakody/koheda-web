import React, { useEffect } from "react";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
    errorText: {
        color: "red",
        fontWeight: 700,
        letterSpacing: "0.03333em",
        fontSize: "0.75rem"
    }
}));


export default function Navigation(props) {
  const classes = useStyles();

  const { t, i18n } = useTranslation(['title']);

  return (
    <Typography variant="subtitle1"  className={clsx(classes.errorText)}>{props.caption}</Typography>
  );
}
