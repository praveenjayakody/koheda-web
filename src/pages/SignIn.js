import React, { useEffect, useState} from "react";
import { Grid, Container, CssBaseline, Button, TextField } from '@material-ui/core';


import { makeStyles } from '@material-ui/core/styles';

import { XStorage as xsto } from '../util/XStorage.js'
import { Auth } from '../util/Api/Auth.js'

import Navigation from "../components/Navigation";

import { GoogleLogin } from 'react-google-login';

import { useTranslation } from "react-i18next";

import { languages } from "../locales/list"

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
	}
  }));

export default function SignIn() {
	const styles = useStyles();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

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
				window.location.href="";
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
				window.location.href="";
			}
		});
	};


	return (
		<Grid container spacing={2}>
			<Grid item lg={4} xs={1}></Grid>
			<Grid item lg={4} xs={10}>
				<Grid container spacing={2}>
					<Grid item container lg={12} xs={12} justifyContent="center">
						{
							languages.map((l, i) => <Button key={i} color="primary" onClick={() => setLanguage(l.code)}>{l.label}</Button>)
						}
					</Grid>
					<Grid item lg={12} xs={12}>
						<TextField
							label={t('email')}
							id="outlined-margin-none"
							variant="outlined"
							className={styles.fullWidth}
							value={email} onChange={(e)=>{ setEmail(e.target.value); }} 
						/>
					</Grid>
					<Grid item lg={12} xs={12}>
						<TextField
							label={t('password')}
							id="outlined-margin-none"
							variant="outlined"
							className={styles.fullWidth}
							type="password"
							value={password} onChange={(e)=>{ setPassword(e.target.value); }} 
						/>
					</Grid>
					<Grid item lg={12} xs={12}>
						<Button variant="contained" color="primary" className={styles.fullWidth} onClick={_signIn}>{t("login")}</Button>
					</Grid>
					<Grid item lg={12} xs={12}>
						<Grid container spacing={2}>
							<Grid item lg={4} xs={12}></Grid>
							<Grid item lg={4} xs={12}>
								<GoogleLogin
									clientId={process.env.REACT_APP_GCLIENT_ID}
									buttonText="Sign in with Google"
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
							<Grid item lg={4} xs={12}></Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item lg={4} xs={1}></Grid>
		</Grid>
	);
}
