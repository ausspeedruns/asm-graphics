# asm-layouts

> The on-stream graphics used during AusSpeedruns's "marathon" events.

This is a [NodeCG](https://www.nodecg.dev/) v1.9.0 bundle. You must have NodeCG installed for this to run.

## Before using

This is only intended to be used as an education tool. Please learn from the code to be able to create your own layouts. **Do not download and use as is!**

## Requirements

- [NodeCG](https://www.nodecg.dev/): 1.9.0
- [nodecg-speedcontrol](https://github.com/speedcontrol): 2.4.0

To use the audio indicators you must have [OBS-WebSocket](https://github.com/obsproject/obs-websocket) version 5.0.0. This plugin comes by default in OBS v28.

## Installation

Currently no automated builds are active. You must install and build this manually.

- [NodeCG installation](https://www.nodecg.dev/docs/installing)
- [nodecg-speedcontrol installation](https://github.com/speedcontrol/nodecg-speedcontrol#installation)

Starting from the *root* NodeCG folder

```bash
cd bundles
git clone https://github.com/ausspeedruns/asm-graphics.git
cd asm-graphics
npm i
npm run build
npm run start
```

## Usage

### Config Schema

The config schema is used to define URLs, API keys and to enable/disable certain features.

If you have [nodecg-cli](https://github.com/nodecg/nodecg-cli) installed just run the `nodecg defaultconfig` command to generate the config file to then edit, else create a config file in `nodecg/cfg/asm-graphics.json`.

- `obs`
  - Enables the use of OBS-WebSocket in the bundle, currently used for audio indicators but previously used to remotely change scenes during online events.
  - `enabled`: Boolean
  - `port`: Number
  - `ip`: String
  - `password`: String
- `twitch`
  - `parents`: String[]
    - [Twitch embed parameter](https://dev.twitch.tv/docs/embed/everything#embed-parameters)
- `twitter`
  - Get tweets about the event to display on stream
  - `enabled`: Boolean
  - `key`: String
    - Twitter API key
  - `secret`: String
    - Twitter API secret key
  - `bearer`: String
    - Twitter API bearer key
  - `rules`: Object[]
    - Twitter API rules on what to search for
    - *Currently unused*
- `hostname`: String
  - Used when hosting NodeCG on an external server with a domain name
  - Only used to configure a URL for online mode
- `tilitfy`
  - `enabled`: Boolean
  - `key`: String
    - Tiltify API key
  - `campaign`: String
    - Tiltify campaign ID
- `graphql`
  - Used for getting incentives and runner information from the [ausspeedruns.com](https://ausspeedruns.com/) website
  - `url`: String
    - URL for GraphQL server
  - `event`: String
    - Event's short name to filter results from the graphql server

## Events used in

- ASAP2022
- ASM2022
- PAX2021
- ASM2021
- FAST2020
- PAX Online 2020
- ASM2020

## License

asm-graphics is provided under the Mozilla Public License v2.0, which is available to read in the LICENSE file.

## Authors

- Lead developer and designer [Ewan "Clubwho" Lyon](https://github.com/EwanLyon)
- Tester [nei\_](https://github.com/neiunderscore)

## Credits

- [fit-text.tsx](https://github.com/ausspeedruns/asm-graphics/blob/main/src/graphics/elements/fit-text.tsx). modified from a version originally written by [Hoishin](https://github.com/Hoishin), [Original Source](https://github.com/JapaneseRestream/jr-layouts/blob/master/src/browser/graphics/components/fit-text.tsx).
- [obs.ts](https://github.com/ausspeedruns/asm-graphics/blob/main/src/extensions/util/obs.ts), modified from a version originally written by [zoton2](https://github.com/zoton2), [Original Source](https://github.com/esamarathon/esa-layouts/blob/master/src/extension/util/obs.ts).
