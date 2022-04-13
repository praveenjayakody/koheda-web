import React, { useEffect, useState } from "react";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import LinearProgress from '@material-ui/core/LinearProgress';

import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';

import Slider from '@material-ui/core/Slider';

import { XStorage as xsto } from '../util/XStorage.js'
import {
  useParams
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Xui as $x } from "../util/Xui"
import { Typography } from "@material-ui/core";

import RemoveIcon from '@material-ui/icons/Clear';

import { Place } from "../util/Api/Place";
import { Finding } from "../util/Api/Finding";
import Celebration from "../components/Celebration.js";

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
    // background: "#4caf50"
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  }
}));

const FacilitySlider  =  ({ name, onChange, onDelete, value }) => (
  <Grid container spacing={2} alignItems="center">
    <Grid item style={{marginBottom: 10}} xs={3}>
      <Typography variant="body2">{name}</Typography>
    </Grid>
    <Grid item xs={7}>
      <Slider
        value={value}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={0}
        max={10}
        style={{width: "100%"}}
        onChange={(e, v) => onChange(v)}
      />
    </Grid>
    <Grid item style={{marginBottom: 10}} xs={2}>
      <IconButton color="primary" aria-label="upload picture" component="span" onClick={onDelete}>
        <RemoveIcon />
      </IconButton>
    </Grid>
  </Grid>
);

export default function AddPlace() {
  const classes = useStyles();

  const { t, i18n } = useTranslation(['addPlace']);
  useEffect(() => {
		i18n.changeLanguage(xsto.load("lang") ?? "en");
	}, []);

  const { itemId, position } = useParams();

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  const [facilityList, setFacilityList] = useState((() => {
    let ox = {};
    itemList.forEach((it) => { ox[it] = 0 });
    return ox;
  })());


  const [celebration, setCelebration] = useState(false);
  const _addPlace = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    const values = $x.parseForm(e);
    console.log(values);

    try {
      const thisPlace = await Place.store(values);
      if (typeof thisPlace.errors !== "undefined") {
        setErrors(thisPlace.errors);
      } else {
        const theseFacilities = Object.keys(facilityList);

        for (let i = 0; i < theseFacilities.length; i++) {
          if (facilityList[theseFacilities[i]] !== null) {
            await Finding.store({
              facility: theseFacilities[i],
              place_id: thisPlace.id,
              rating: parseInt(facilityList[theseFacilities[i]])
            });
          }
        }

        // window.location.href = process.env.REACT_APP_BASENAME + "/create/";
        // window.history.back();
        setCelebration(true);
      }
    } catch (e) {
      setSnackbar(t("general:network_error"));
      setTimeout(() => window.history.back(), 1000);
      console.log(e);
    }

    setLoading(false);
  }

  return (<div className={classes.root}>
		<CssBaseline />
    <main className={classes.content}>
      {loading ? <LinearProgress color="secondary" style={{ position: "absolute", width: "80%" }} />: null}
      <Snackbar open={snackbar !== null} autoHideDuration={6000} onClose={() => setSnackbar(null)} message={snackbar} />
      <Celebration open={celebration} mainText={t("thank_you")} subText={t("processing_msg")} onClose={() => window.history.back()} />
      <Container maxWidth="lg" className={classes.container}>
        <Grid container direction="column">
          <Grid item>
            <form onSubmit={_addPlace}><fieldset disabled={loading}>
              <CardHeader title={t("add_place")} subheader={t("add_place_desc")}/>
              <CardContent>
                {/* {errors.map((e, i) => <ErrorLabel key={i} caption={e} />)} */}
                <TextField
                  autoFocus={typeof position === "undefined"}
                  defaultValue={position ?? ""}
                  name="position"
                  type="text"
                  variant="outlined"
                  fullWidth
                  label={t("coordinates")}
                  style={{ marginBottom: "5px" }}
                  error={typeof errors['position'] !== "undefined"}
                  helperText={typeof errors['position'] !== "undefined" ? errors["position"][0]: ""}
                />
                <TextField
                  autoFocus={typeof position !== "undefined"}
                  name="name"
                  type="text"
                  variant="outlined"
                  fullWidth
                  label={t("general:name")}
                  style={{ margin: "5px 0 10px 0" }}
                  error={typeof errors['name'] !== "undefined"}
                  helperText={typeof errors['name'] !== "undefined" ? errors["name"][0]: ""}
                />
                <TextField
                  name="mobile"
                  type="number"
                  variant="outlined"
                  fullWidth
                  label={t("general:mobile")}
                  style={{ margin: "5px 0 10px 0" }}
                  error={typeof errors['mobile'] !== "undefined"}
                  helperText={typeof errors['mobile'] !== "undefined" ? errors["mobile"][0]: ""}
                />
                <Typography variant="h6">{t("facilities")}</Typography>
                <Grid container>
                  {Object.keys(facilityList).map((f, i) => (facilityList[f] !== null ?
                    <Grid item xs={12} lg={12} key={i}>
                      <FacilitySlider
                        name={t("general:item." + f)}
                        value={facilityList[f]}
                        onChange={(v) => setFacilityList({...facilityList, [f]: v})}
                        onDelete={() => {
                          if (Object.values(facilityList).filter((o) => o === null).length < Object.values(facilityList).length - 1) {
                            setFacilityList({...facilityList, [f]: null})
                          } else {
                            setSnackbar(t("errors.atleastOneFacility"));
                          }
                        }}
                      />
                    </Grid>: null
                  ))}
                </Grid>

                <Button fullWidth type="submit" variant="contained" disableElevation>{t("general:submit")}</Button>
              </CardContent>
            </fieldset></form>
          </Grid>
        </Grid>
      </Container>
    </main>
  </div>);
}
