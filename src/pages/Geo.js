import React, { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Navigation from "../components/Navigation";

import CssBaseline from '@material-ui/core/CssBaseline';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';

import { XStorage as xsto } from '../util/XStorage.js'

import { useTranslation } from "react-i18next";
import { Auth } from "../util/Api/Auth";

import { languages } from "../locales/list"
import {
  useParams
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default function Welcome() {
  const classes = useStyles();

  const { t, i18n } = useTranslation(['geo']);

  const { itemId } = useParams();

  return (<div className={classes.root}>
		<CssBaseline />
    <main className={classes.content}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container direction="column">
          <Grid item>
            <p>{itemId}</p>
          </Grid>
        </Grid>
      </Container>
    </main>
  </div>);
}
