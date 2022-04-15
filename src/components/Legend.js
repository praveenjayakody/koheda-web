import React, { useEffect, useState } from "react";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import { useTranslation } from "react-i18next";
import { Button } from "@material-ui/core";
import Popover from '@material-ui/core/Popover';
import MapIcon from '@material-ui/icons/Map';

import ratingThumbnail from "../images/legend/1.png"
import fadedThumbnail from "../images/legend/2.png"

const useStyles = makeStyles((theme) => ({
    fab: {
        position: "absolute",
        top: 8,
        right:10,
        zIndex: 2000
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    popContainer: {
        padding: 10,
        zIndex: 9000,
        width: 350,
        overflow: "hidden"
    },
}));

export default function Legend({ children, onClick }) {
    const classes = useStyles();
    const { t, i18n } = useTranslation(['genral', 'geo']);

    const [anchorEl, setAnchorEl] = useState(null);

    const legendItems = [
        {
            image: ratingThumbnail,
            text: t("geo:legend:rating")
        },
        {
            image: fadedThumbnail,
            text: t("geo:legend:faded")
        }
    ]

    return (<>
        <Popover
            id={"popLegend"}
            open={anchorEl !== null}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            PaperProps={{ style: { marginTop: 10 } }}
        >
            <Grid container className={classes.popContainer}>
                {
                    legendItems.map((l, i) => (
                        <Grid item container key={i} direction="row" justifyContent="flex-start" alignItems="center" xs={12} style={{ marginBottom: 10 }}>
                            <Grid item xs={3}>
                                <img src={l.image} height={50} />
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant="body1">{l.text}</Typography>
                            </Grid>
                        </Grid>
                    ))
                }
                <Grid item xs={12}>
                    <Button variant="outlined" style={{ width: "100%" }} onClick={() => setAnchorEl(null)}>Close</Button>
                </Grid>
            </Grid>
        </Popover>

        <Fab variant="extended" color="secondary" className={classes.fab} aria-describedby={"popLegend"} onClick={(e) => setAnchorEl(anchorEl === null ? e.currentTarget: null)}>
            <MapIcon className={classes.extendedIcon} />
            {t("legend")}
        </Fab>
    </>)
}
