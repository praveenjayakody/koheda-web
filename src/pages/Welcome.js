import React, { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Snackbar from '@material-ui/core/Snackbar';

import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';

import { XStorage as xsto } from '../util/XStorage.js'
import { XPush as xpush } from '../util/XPush.js'

import { useTranslation } from "react-i18next";
import { Auth } from "../util/Api/Auth";

import { languages } from "../locales/list"

import BigButton from "../components/BigButton"

import {
  useHistory
} from "react-router-dom";

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
    fontSize: "45px",
    '@media (max-width: 768px)': {
      fontSize: 25,
    }
  },
  whereBranding: {
    margin: 0,
    color: "#000",
    opacity: 0.9,
    fontFamily: "Montserrat",
    fontWeight: 500,
    fontSize: "75px",
    '@media (max-width: 768px)': {
      fontSize: 35
    }
  },
  whereDropdown: {
    fontFamily: "Montserrat",
    fontWeight: 500,
    fontSize: "75px",
    color: "red"
  },
  notifyContainer: {
    background: '#e6dd8f',
    padding: "10px 10px 10px 20px",
    borderRadius: 10
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

  const [notify, setNotify] = useState(false);
  useEffect(() => {
    (async () => {
      const s = await xpush.getStatus();
      setNotify(({
        "granted": true,
        "denied": null,
        "prompt": false
      })[s]);
    })();
  }, []);
  const _changeNotify = async () => {
    if (!notify) {
      // flow to turn notifications on
      try {
        const pushSub = await xpush.subscribe();
        console.log(pushSub);
      } catch (e) {
        console.log(e);
        setNotify(null);
      }
    } else {
      // flow to turn notifications off
      // TODO: no point of unregistering here as it will be registerd on ext window load
      console.log("Unregistered");
      setNotify(false);
    }
  }

  const _signOut = async () => {
    await Auth.logOut();
    xsto.clear();
    window.location.reload();
  }

  const browserHistory = useHistory();

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
        <Grid container direction="column" alignItems="center">

          {/* {Auth.userInfo.permissions.indexOf("add locations") > -1 ?
            <Grid item container justifyContent="center">
              <ButtonGroup variant="outlined" color="default" disableElevation>
                <Button onClick={() => setMode("search")}>{t("welcome:search_locations")}</Button>
                <Button onClick={() => setMode("add")}>{t("welcome:add_locations")}</Button>
              </ButtonGroup>
            </Grid>
          : null} */}
          <Grid item className={classes.notifyContainer} lg={6}>
            <FormControlLabel
              disabled={notify === null}
              control={
                <Switch
                  checked={Boolean(notify)}
                  onChange={_changeNotify}
                  color="primary"
                />
              }
              label={t("welcome:notify")}
            />
          </Grid>
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
                  <Grid item xs={6} lg={3}>
                    <BigButton onClick={() => {
                      let url = mode + "/" + o;

                      browserHistory.push(url);
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
