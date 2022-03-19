import React, { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import Navigation from "../components/Navigation";

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { ButtonGroup } from '@material-ui/core';
import { XStorage as xsto } from "../util/XStorage";
import { Auth } from "../util/Api/Auth";
import { Profile } from "../util/Api/Profile";

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';

import { useTranslation } from "react-i18next";

import { languages } from "../locales/list"

import { Xui as $x } from "../util/Xui"
import { AirplanemodeActive } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default function Account() {
  const classes = useStyles();

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

	const { t, i18n } = useTranslation(['account']);
	const [language, setLanguage] = useState('en');
	useEffect(() => {
		setLanguage(xsto.load("lang") ?? "en");
	}, []);
	useEffect(() => {
		i18n.changeLanguage(language);
		xsto.set("lang", language);
	}, [language]);

  const _signOut = async () => {
    await Auth.logOut();
    xsto.clear();
    window.location.reload();
  }

  const _changePassword = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const values = $x.parseForm(e);

    let resp = await Profile.update(values);
    if (typeof resp.errors !== "undefined") {
      setErrors(resp.errors);
    } else {
      setSnackbar(t("passwordChanged"));
      setTimeout(() => window.location.reload(), 3000); // can't clear the form so reload instead
    }

    setLoading(false);
  }

  return (<div className={classes.root}>
		<CssBaseline />
		<Navigation title={t("title:account")} />
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      {loading ? <LinearProgress color="secondary" style={{ position: "absolute", width: "80%" }} />: null}
      <Snackbar open={snackbar !== null} autoHideDuration={6000} onClose={() => setSnackbar(null)} message={snackbar} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid container item spacing={1} justifyContent="space-between">
            <Grid item>
              <ButtonGroup variant="contained" color="secondary" disableElevation>
                {
                  languages.map((l, i) => <Button key={i} onClick={() => setLanguage(l.code)}>{l.label}</Button>)
                }
              </ButtonGroup>
            </Grid>
            <Grid item>
              <Button disableElevation variant="contained" color="primary" onClick={_signOut}>{t("logout")}</Button>
            </Grid>
          </Grid>
          <Grid container item lg={6} md={12}>
            <Card variant="outlined" style={{width: "100%"}}>
              <form onSubmit={_changePassword}><fieldset disabled={loading}>
                <CardHeader title={t("changePassword")} subheader={t("changePasswordSubheading")}/>
                <CardContent>
                  {/* {errors.map((e, i) => <ErrorLabel key={i} caption={e} />)} */}
                  <TextField
                    name="currentPassword"
                    type="password"
                    variant="outlined"
                    fullWidth
                    label={t("currentPassword")}
                    style={{ marginBottom: "5px" }}

                    error={typeof errors['currentPassword'] !== "undefined"}
                    helperText={typeof errors['currentPassword'] !== "undefined" ? errors["currentPassword"][0]: ""}
                  />
                  <TextField
                    name="newPassword"
                    type="password"
                    variant="outlined"
                    fullWidth
                    label={t("newPassword")}
                    style={{ margin: "5px 0 10px 0" }}

                    error={typeof errors['newPassword'] !== "undefined"}
                    helperText={typeof errors['newPassword'] !== "undefined" ? errors["newPassword"][0]: ""}
                  />
                  <Button type="submit" variant="contained" disableElevation>{t("general:submit")}</Button>
                </CardContent>
              </fieldset></form>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </main>
  </div>);
}
