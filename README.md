# bodymovin-extension

Bodymovin UI extension panel

## Development

1. Setup AE for debugging extensions ([guide](https://github.com/Adobe-CEP/CEP-Resources/blob/master/CEP_9.x/Documentation/CEP%209.0%20HTML%20Extension%20Cookbook.md#debugging-unsigned-extensions))
2. Install the [CEF client](https://github.com/Adobe-CEP/CEP-Resources/tree/master/CEP_9.x) you'll need for remote debugging
3. Install extension dependencies (`npm i`)
4. Install server dependencies (`cd bundle/server && npm i`)
5. Run `npm run start-dev`
6. Open the CEF client and navigate to `http://localhost:8092`

The extension window will now hot-reload and you can use the devtools in the CEF client.
