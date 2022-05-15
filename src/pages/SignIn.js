import React, { useEffect, useState} from "react";
import { Grid, Container, CssBaseline, Button, TextField, Box, Typography, Link } from '@material-ui/core';


import { makeStyles } from '@material-ui/core/styles';

import { XStorage as xsto } from '../util/XStorage.js'
import { Auth } from '../util/Api/Auth.js'

import Navigation from "../components/Navigation";

import { GoogleLogin } from 'react-google-login';

import { useTranslation, Trans } from "react-i18next";
import {
	useHistory
} from "react-router-dom";

import { languages } from "../locales/list"
import "./SignIn.css"

const useStyles = makeStyles((theme) => ({
	root: {
	  /*display: 'flex',
	  flexWrap: 'wrap',*/
	  flexGrow: 1,
	},
	textField: {
	  marginLeft: theme.spacing(1),
	  marginRight: theme.spacing(1),
	  width: '25ch',
	},
	wrapper: {
		marginTop: '20px'
	},
	red: {
		backgroundColor: 'red'
	},
	fullWidth: {
		width: '100%'
	},
	logo: {
		boxShadow: "rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px"
	}
  }));

export default function SignIn() {
	const styles = useStyles();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const browserHistory = useHistory();

	const { t, i18n } = useTranslation(['home']);
	const [language, setLanguage] = useState('en');
	useEffect(() => {
		setLanguage(xsto.load("lang") ?? "en");
		console.log(i18n.languages);
	}, []);
	useEffect(() => {
		i18n.changeLanguage(language);
		xsto.set("lang", language);
	}, [language]);

	const _signIn = () => {
		Auth.authenticate(email, password).then((result)=>{
			console.log(result);
			if (typeof result.errors !== "undefined") {
				//an error has ocurred
				alert("Invalid user details");
			} else {
				xsto.set("token", result.token);
				browserHistory.replace("");
			}
		}).catch(e => {
			console.log(e);
			alert("Connection error");
		})
	};
	const _gSignIn = (email, idToken) => {
		Auth.gauthenticate(email, idToken).then((result)=>{
			console.log(result);
			if (typeof result.error !== "undefined") {
				//an error has ocurred
				alert("Invalid user details");
			} else {
				xsto.set("token", result.token);
				browserHistory.replace("");
			}
		});
	};

	// if true, that means loaded through Facebook's in-app browser
	const isFb = navigator.userAgent.indexOf("FBAN") != -1 || navigator.userAgent.indexOf("FBAV") != -1;

	return (
		<Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
			<Grid item container justifyContent="center">

				<Grid item container justifyContent="center">
					<Grid item container justifyContent="center">
						<img src={process.env.PUBLIC_URL + '/logo192.png'} className={"logo"}/>
					</Grid>
					<Grid item container lg={12} xs={12} justifyContent="center" style={{margin: 10}}>
						{
							languages.map((l, i) => <Button key={i} color="primary" onClick={() => setLanguage(l.code)}>{l.label}</Button>)
						}
					</Grid>
					<Grid item container justifyContent="center" style={{marginBottom: 5}}>
						<Typography variant="subtitle1">
							<Trans i18nKey={"home:tagline"}>Find <strong>essentials</strong> with where.lk</Trans>
						</Typography>
					</Grid>
					{isFb ? <Grid item container justifyContent="center" style={{padding: 20}} md={3}>
						<Typography className="attention" variant="caption" style={{textAlign: "center"}}>
							If the Google Login does not work, please open the app on the web browser. Facebook browser prevents logging in via Google. <br />
							Google Login ක්‍රියා නොකරන්නේ නම්, කරුණාකර වෙබ් බ්‍රවුසරයේ වෙබ් අඩවිය විවෘත කරන්න. ෆේස්බුක් බ්‍රව්සරය ගූගල් හරහා ලොග් වීම වළක්වයි
						</Typography>
					</Grid>: null}
					<Grid item container justifyContent="center">
						<GoogleLogin
							clientId={process.env.REACT_APP_GCLIENT_ID}
							buttonText={t("signin_google")}
							onSuccess={(e) => { _gSignIn(e.profileObj.email, e.tokenId); }}
							onFailure={(e) => {
								console.log(e);
								if (
									e.error != "idpiframe_initialization_failed" &&
									e.error != "popup_closed_by_user"
								) {
									alert("Unexpected error occured!");
								}
							}}
						/>
					</Grid>
					<Grid item container justifyContent="center" style={{marginTop: 30}} md={3}>
						<Typography variant="caption" color="textSecondary" style={{textAlign: "center"}}>
							<Trans i18nKey={"home:signin_policy"}>
								text <Link href={process.env.PUBLIC_URL + "/tac.html"}>link</Link> j <Link href={process.env.PUBLIC_URL + "/pp.html"}>kk</Link>
							</Trans>
						</Typography>
					</Grid>
					<Grid item container justifyContent="center">
						<Typography variant="caption">{}</Typography>
					</Grid>
					<Grid item>
						<Typography variant="caption" color="textPrimary">v{process.env.REACT_APP_VERSION}</Typography>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
