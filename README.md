# la-react
* A React frontend for la-server

## Google Sign In
* When inlcuding authorized javascript origins when creating the client ID, make sure to include URIs with the www prefix as well as without
    + Seemingly, Google considers __www.example.com__ and __example.com__ as two different origins
* Refer the homepage __.htaccess__ file for more info on how to structure HTTPS redirection without disrupting Google Sign In

## Environment files

* .env.development sets the environment variables for `yarn start`
* .env.production sets the environment variables for `yarn run build`

### Variables

* `REACT_APP_API_URL` - API endpoint without the protocol section ex: _://orpheus.digital/grocer/server/_
* `REACT_APP_BASENAME` - base route name ex: _/grocer/app_

## Translation
> `npm install react-i18next i18next --save`

## Terms and Conditions and Privacy Policy
* Generated using https://policymaker.io/terms-conditions-ready/ and https://policymaker.io/privacy-policy-ready/