# Din-O
`WIP` Experimental video conference app
This app explores new ways of building webapp using state of the art technologies.

- Deno : a new runtime for executing Javascript / Typescript / WASM outside of the web browser. It is made  by Ryan Dahl author of Node.js
https://deno.land/v1

- WebRtc : This open-source project is now deeply used by video conferencing app. But could we push it a bit further ? (AV1 codec, QUiC, encryption, AI, ...) 
https://webrtc.org/

- ES Modules : bundlerless frontend development. How to stay/improve coding productivity and reduce javascript fatigue.

- Rust : Deno is made using this language. Using WASM we could create powerfull code to handle WebRtc communication as fast as possible.

- CI : Github actions is a powerfulll CI tool to help us deploy seamless to Heroku / Dokku / AWS Elastic Beanstalk


## Contents

- [Roadmap](#roadmap)
- [Requirements](#requirements)
- [Contribute](#contribute)
- [License](#license)


## Roadmap

### Version 0.1 - [Current version]

#### Server

- WIP - Signaling server : room management, user management
- TODO - Tests / coverage
- TODO - Migrate to Typescript

#### Client

- WIP - React interface
- TODO - Tests
- TODO - SDP parser

#### CI

- WIP - Deploy to Heroku
- TODO - Tests
- TODO - Deploy to Dokku
- TODO - Deploy to AWS

### Next versions [TBP]

- Rust SDP parser
- More to come

## Requirements

### Server side

- Deno latest version : https://github.com/denoland/deno_install

### Client side

- a browser compatible with ESM: https://caniuse.com/#search=modules

## Contribute

Contributions welcome! Read the [contribution guidelines](CONTRIBUTING.md) first.


## License

Released under MIT License
