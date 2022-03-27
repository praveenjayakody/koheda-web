import React, { useEffect, useState } from "react";


import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Rating from '@material-ui/lab/Rating';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Call from '@material-ui/icons/Call';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';

import { useTranslation } from "react-i18next";
import { Place } from "../util/Api/Place";

import {
  useParams
} from "react-router-dom";
import { Wrapper } from "@googlemaps/react-wrapper";

import { GMap, Marker } from "../components/Maps";

import fuelStation from "../images/pins/fuel-station.png";
import { DialogActions, DialogContent, DialogContentText } from "@material-ui/core";

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

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

export default function Geo() {
  const classes = useStyles();

  const { t, i18n } = useTranslation(['geo']);

  const { itemId, geoLocation } = useParams();

  const _mapRender = (status) => {
    return <h1>{status}</h1>;
  };

  const [clicks, setClicks] = React.useState([]);
  const [zoom, setZoom] = React.useState(8); // initial zoom
  const [center, setCenter] = React.useState({
    lat: 7.765676800293702,
    lng: 80.76784081246987,
  });

  // places
  const [places, setPlaces] = useState([]);
  useEffect(() => {( async () => {
    setPlaces(await Place.list({ facility: itemId }));
  })()}, []);
  useEffect(() => {
    console.log(places);
  }, [places]);

  // set location and zoom on it if present
  useEffect(() => {
    let thisLocation = undefined;
    if (typeof geoLocation !== "undefined" && geoLocation !== "") {
      thisLocation = geoLocation.split(",");
      thisLocation = {
        lat: parseFloat(thisLocation[0]),
        lng: parseFloat(thisLocation[1])
      }
    } else if (places.length > 0) {
      thisLocation = {
        lat: parseFloat(places[0].location.coordinates[1]),
        lng: parseFloat(places[0].location.coordinates[0])
      }
    }
    if (typeof thisLocation !== "undefined") {
      setCenter(thisLocation);
      setZoom(12);
    }
  }, [places]);

  // marker selection
  const [selectedPlace, setSelectedMarker] = useState({});

  return (<div className={classes.root}>
		<CssBaseline />
    <main className={classes.content}>
      <Dialog onClose={() => setSelectedMarker({})} open={typeof selectedPlace.id !== "undefined"}>
        <DialogTitle>{selectedPlace.name}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{textAlign: "center"}}>
            {
              typeof selectedPlace.updated_at != "undefined" ?
              t("last_updated", { date: (new Date(selectedPlace.updated_at)).toLocaleString() })
              : ""
            }
          </DialogContentText>
          <Grid container justifyContent="center">
            <Grid item>
              <Rating 
                value={(() => {
                  let rating = typeof selectedPlace.facilities !== "undefined" ?
                  selectedPlace.facilities.find(e => e.facility == itemId).quality/2
                  :0;
                  if (rating == 0) rating = 1;
                  return rating;
                })()}
                IconContainerComponent={IconContainer}
                readOnly
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {typeof selectedPlace.mobile === "undefined" || selectedPlace.mobile === null ? null:
            <Button fullWidth endIcon={<Call />} onClick={() => window.open("tel:" + selectedPlace.mobile)}>
              {t("call")}
            </Button>
          }
          <Button fullWidth endIcon={<ArrowForwardIcon />} onClick={() => {
            let url = "";
            url = "https://www.google.com/maps/dir/?api=1&destination=" + selectedPlace.location.coordinates[1] +"," + selectedPlace.location.coordinates[0];
            window.open(url);
          }}>{t("navigate")}</Button>
        </DialogActions>
      </Dialog>
      <Wrapper apiKey={process.env.REACT_APP_GAPI_KEY} render={_mapRender}>
        <GMap
          center={center}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
          {places.map((p, i) =>(
            <Marker
              key={i}
              optimized={false}
              onClick={(e) => {
                setSelectedMarker(p);
              }}
              title={p.name}
              icon={fuelStation}
              position={{ lat: p.location.coordinates[1], lng: p.location.coordinates[0] }}
            />
          ))}
        </GMap>
      </Wrapper>
    </main>
  </div>);
}
