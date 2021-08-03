# Simple File Directory Page

Showing new files shortly after they arrive in the directory.

This React app lives in a subdirectory, 
e.g. ``./apk`` on the webserver \
and shows only the files with the `.apk` extension.

## Scripts

In the project directory, you can run:

### `yarn start`

to run the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn test`

will launche the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` directory.\

These files need to then be all copied to the destination ``./apk``
directory on the webserver.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Server-side `Apache`

### CGI script

Will be called via URL ``./index.cgi?listing`` from the React app.

This is a very simple bash script to generate file listing JSON
or redirect to ``index.html``. 

```bash
#!/usr/bin/env bash

if [[ "$QUERY_STRING" == "listing" ]]; then
  echo "Access-Control-Allow-Origin: *"
  echo "Content-Type: application/json"
  echo
  echo -n "["
  started=""
  for i in *.apk; do
    [ -z $started ] && started=1 || echo ','
    echo -n '{"file":"'$i'",'
    echo -n '"ts":'$(stat -c%Y $i)
    echo -n "}"
  done
  echo "]"
  exit 0
fi

echo "Location: ./index.html"
echo
exit 0
```

To handle generation of JSON directory listing and redirection.

### Apache `vhost` configuration

In the ``<VirtualHost *:443>`` stanza of the `Apache` configuration:

```
<Location "/apk">
    DirectoryIndex index.html
    Options ExecCGI
</Location>
```

## Other stuff

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
