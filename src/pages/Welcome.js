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

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    background: "#4caf50"
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
    color: "#fff176"
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

  // get geolocation
  const [location, setLocation] = useState(undefined);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => {
          let geoObject = {};
          geoObject = {
            lat: p.coords.latitude,
            long: p.coords.longitude
          };
          setLocation(geoObject);
        },
        error => {
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setSnackbar(t("welcome:location_errors.denied"));
              break;
            case error.POSITION_UNAVAILABLE:
              setSnackbar(t("welcome:location_errors.unavailable"));
              break;
            case error.TIMEOUT:
              setSnackbar(t("welcome:location_errors.timeout"));
              break;
            case error.UNKNOWN_ERROR:
              setSnackbar(t("welcome:location_errors.unknown"));
              break;
          }
        }
      );
    }
  }, []);

  const [mode, setMode] = useState("search");

  const [items, setItems] = useState([
    "petrol-92",
    "petrol-95"
  ]);
  useEffect(() => {
  }, []);

  return (<div className={classes.root}>
		<CssBaseline />
    <main className={classes.content}>
      <Snackbar open={snackbar !== null} autoHideDuration={6000} onClose={() => setSnackbar(null)} message={snackbar} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container direction="column">
          <Grid item container lg={12} xs={12} justifyContent="center">
            <ButtonGroup variant="text" color="secondary" disableElevation>
              {
                languages.map((l, i) => <Button key={i} onClick={() => setLanguage(l.code)}>{l.label}</Button>)
              }
            </ButtonGroup>
					</Grid>
          {Auth.userInfo.permissions.indexOf("add locations") > -1 ?
            <Grid item container justifyContent="center">
              <Select
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value);
                }}
                color="secondary"
                style={{marginTop: 10}}
              >
                <MenuItem value={"add"}>{t("welcome:add_locations")}</MenuItem>
                <MenuItem value={"search"}>{t("welcome:search_locations")}</MenuItem>
              </Select>
            </Grid>
          : null}
          <Grid item>
            <Grow in={true} style={{ transformOrigin: '0 0 0' }}>
              <p className={classes.hiMessage}>{t("welcome:hi", {name: Auth.userInfo.name.split(" ")[0]})}</p>
            </Grow>
          </Grid>
          <Grid container item>
            <Grid item style={{marginRight: 20}}>
              <Grow
                in={true}
                style={{ transformOrigin: '0 0 0' }}
                {...(true ? { timeout: 1000 } : {})}
              >
                <p className={classes.whereBranding}>{t("welcome:tagline"+ "_" + mode)}</p>
              </Grow>
            </Grid>
            <Grid item xs={12}>
              <Slide
                in={true}
                direction="up"
                {...(true ? { timeout: 1000 } : {})}
              >
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  defaultValue={"none"}
                  onChange={(e) => {
                    window.location.href = mode + "/" + e.target.value;
                  }}
                  className={classes.whereDropdown}
                  fullWidth
                  color="secondary"
                >
                  {items.map((o, i) => <MenuItem key={i} value={o} style={{fontSize: "60px"}}>{t("welcome:item." + o)}</MenuItem>)}
                  <MenuItem value={"none"} style={{fontSize: "60px"}}>{t("welcome:placeholder")}</MenuItem>
                </Select>
              </Slide>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </main>
  </div>);
}
