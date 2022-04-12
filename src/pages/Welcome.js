import React, { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';

import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';

import { XStorage as xsto } from '../util/XStorage.js'

import { useTranslation } from "react-i18next";
import { Auth } from "../util/Api/Auth";

import { languages } from "../locales/list"

import BigButton from "../components/BigButton"

const itemList = require("../util/Items");

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    background: "#fef49e"
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  hiMessage: {
    marginBottom: 0,
    color: "rgba(0, 0, 0, 0.5)",
    fontWeight: 500,
    fontSize: "45px"
  },
  whereBranding: {
    margin: 0,
    color: "#000",
    opacity: 0.9,
    fontFamily: "Montserrat",
    fontWeight: 500,
    fontSize: "75px"
  },
  whereDropdown: {
    fontFamily: "Montserrat",
    fontWeight: 500,
    fontSize: "75px",
    color: "red"
  }
}));

export default function Welcome() {
  const classes = useStyles();

  const { t, i18n } = useTranslation(['title', 'welcome']);
	const [language, setLanguage] = useState('en');
	useEffect(() => {
		setLanguage(xsto.load("lang") ?? "en");
	}, []);
	useEffect(() => {
		i18n.changeLanguage(language);
		xsto.set("lang", language);
	}, [language]);

  const [snackbar, setSnackbar] = useState(null);

  const [mode, setMode] = useState("search");

  const [items, setItems] = useState(itemList);
  useEffect(() => {
  }, []);

  const _signOut = async () => {
    await Auth.logOut();
    xsto.clear();
    window.location.reload();
  }

  return (<div className={classes.root}>
		<CssBaseline />
    <main className={classes.content}>
      <Snackbar open={snackbar !== null} autoHideDuration={6000} onClose={() => setSnackbar(null)} message={snackbar} />
      <Container maxWidth="xl" className={classes.container}>
        <Grid container>
          <Grid item container lg={12} xs={12} justifyContent="space-between">
            <Button onClick={_signOut}>Logout</Button>
            <ButtonGroup variant="text" color="default" disableElevation>
              {
                languages.map((l, i) => <Button key={i} onClick={() => setLanguage(l.code)}>{l.label}</Button>)
              }
            </ButtonGroup>
				  </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container direction="column">

          {/* {Auth.userInfo.permissions.indexOf("add locations") > -1 ?
            <Grid item container justifyContent="center">
              <ButtonGroup variant="outlined" color="default" disableElevation>
                <Button onClick={() => setMode("search")}>{t("welcome:search_locations")}</Button>
                <Button onClick={() => setMode("add")}>{t("welcome:add_locations")}</Button>
              </ButtonGroup>
            </Grid>
          : null} */}
          <Grid item>
            <p className={classes.hiMessage}>{t("welcome:hi", {name: Auth.userInfo.name.split(" ")[0]})}</p>
          </Grid>
          <Grid container item>
            <Grid item style={{marginRight: 20}}>
              <p className={classes.whereBranding}>{t("welcome:tagline"+ "_" + mode)}</p>
            </Grid>
            <Grid item container xs={12} spacing={1}>
              {items.map((o, i) => (
                <Grow
                  key={i}
                  in={true}
                  style={{ transformOrigin: '0 0 0' }}
                  timeout={1000 * i * 0.5}
                >
                  <Grid item xs={12} lg={3}>
                    <BigButton onClick={() => {
                      let url = mode + "/" + o;

                      window.location.href = url;
                    }}>{o}</BigButton>
                  </Grid>
                </Grow>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </main>
  </div>);
}
