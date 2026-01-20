<h1 align="center">ASM Graphics</h1>
<div align="center"><img src="docs/img/ASM-Graphics-Hero.png?raw=true" alt="ASM-Graphics Logo"></div>
<p align="center">
  <strong>The on-stream graphics used during AusSpeedruns's marathon events.</strong>
</p>

<div align="center">

![GitHub](https://img.shields.io/github/license/AusSpeedruns/asm-graphics?style=for-the-badge)
![Events Used In](https://img.shields.io/badge/Events_Used_In-11-c72?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAUCAMAAABRYFY8AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURf///wAAAFXC034AAAACdFJOU/8A5bcwSgAAAAlwSFlzAAALEwAACxMBAJqcGAAAAF1JREFUKFN1jsERACEIA6X/pg9ICDiH+5CwguOxHflzECmqBEwoOOVVq5nQsxukz6pLRPfdJNe+Gu4nLkHd43z6meY7Tk/UyuM/9D/Gez6oNa/MsAFyHzebCrePmn3lDgD7ObFjrgAAAABJRU5ErkJggg==)
![Twitch Status](https://img.shields.io/twitch/status/ausspeedruns?style=for-the-badge&logo=twitch&logoColor=white)
![Twitter Follow](https://img.shields.io/twitter/follow/ausspeedruns?style=for-the-badge&logo=twitter&logoColor=white&color=1DA1F2)

</div>

## Before using

This is only intended to be used as an *education tool*. Please learn from the code to be able to create your own layouts. **Do not download and use as is!**

## Table of Contents

- [Before using](#before-using)
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
    - [Config Schema](#config-schema)
- [Events used in](#events-used-in)
- [License](#license)
- [Authors](#authors)
- [Contributing](#contributing)
- [Credits](#credits)

## Features

- Ticker/Omnibar system
- Support for 12 different game layouts
    - Widescreen / 16:9
    - Widescreen 2p / 16:9
    - Widescreen 3p / 16:9
    - Standard / 4:3
    - Standard 2p / 4:3
    - Standard Portrait / 3:4
    - Nintendo GameBoy & GameBoy Color
    - Nintendo GameBoy & GameBoy Color 2p
    - Nintendo GameBoy Advance
    - Nintendo GameBoy Advance 2p
    - Nintendo DS
    - Nintendo DS 2p
    - Nintendo 3DS
    - Nintendo 3DS 2p
    - 1:1
- Race and Co-op
- Couch and Host names
- Audio indicators
- Intermission screen
- Custom host dashboard
- Automatic incentive data
- Custom nodecg-speedcontrol schedule import
- Runner tablet
- X32 Connectivity

## Requirements

- [NodeCG](https://www.nodecg.dev/): 2.6.4
- [nodecg-speedcontrol](https://github.com/speedcontrol): 2.6.0

To use the OBS audio indicators you must have [OBS-WebSocket](https://github.com/obsproject/obs-websocket) version 5.0.0. This plugin comes by default in OBS v28.

## Installation

1. Clone this repository
2. Run `cd bundles`
3. Clone the [nodecg-speedcontrol](https://github.com/speedcontrol) repository
4. Run `pnpm install`
5. Run `pnpm run build`
6. Go back up to the asm-graphics folder `cd ../..`
7. Run `pnpm run build`
8. Run `pnpm start`

## Usage

### Config Schema

The config schema is used to define URLs, API keys and to enable/disable certain features.

If you have [nodecg-cli](https://github.com/nodecg/nodecg-cli) installed just run the `nodecg defaultconfig` command to generate the config file to then edit, else create a config file in `cfg/asm-graphics.json`.

| Name | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| **obs** | Object |    | OBS-WebSocket configuration |
| ├─ enabled | Boolean  | true | Enables OBS-WebSocket support |
| ├─ port | Number  | 4455 | Port for OBS-WebSocket connection |
| ├─ ip | String |  localhost | IP address for OBS-WebSocket connection |
| └─ password | String  | mypassword | Password for OBS-WebSocket connection |
| **tiltify** | Object  |  | Tiltify configuration |
| ├─ enabled | Boolean  | true | Enables Tiltify integration |
| ├─ key | String  | myapikey | Tiltify API key |
| └─ campaign | String  | 123456 | Tiltify campaign ID |
| **graphql** | Object  |  | Used for getting incentives and runner information from the [ausspeedruns.com](https://ausspeedruns.com/) website |
| ├─ url | String  | https://ausspeedruns.com/graphql | URL for GraphQL server |
| └─ event | String  | ASM2025 | | Event's short name to filter results from the graphql server |
| **x32** | Object  || Behringer X32 configuration |
| ├─ enabled | Boolean  | true | Enables X32 integration |
| └─ ip | String | 192.168.1.100 | | X32 IP Address (Use X32 Edit to find) |

### Setup

1. Go to Settings
2. Scroll down to "Schedule Importer"
3. Press the "Import <EVENT> Schedule" button
4. Check for any games without a year and set them accordingly (also add them to the list if missing)
5. In the "Host Reads" panel, press "Add Defaults" (if applicable)
6. Upload sponsor logos in Assets > Sponsors
7. Upload intermission videos in Assets > Intermission Videos
8. In Settings, adjust the settings of the Intermission Videos as needed

### OBS Setup

1. Go to Settings
2. In the OBS panel, set the number of gameplay and camera captures and generate the scene file
3. In OBS import the scene file
4. In the "Gameplay Capture" and "Camera Capture" sources, set the video capture devices accordingly
5. In the "Intermission" scene, open the Filters of the "Intermission Browser Source" and set the Audio Monitor filter output
6. In the "Intermission" scene, open the Filters of the "Transition Browser Source" and set the Audio Monitor filter output

### Doing a Run

This is purely about the dashboard usage

1. Make sure all the couch commentators and runners are in the correct order in the "Stage View" panel
2. Click "Open Game Crop" and assign the relevant game capture sources to the section and crop the gameplay accordingly

## Events used in

- ASO2026
- ASAP2025
- ASM2025
- ASAP2024
- ASM2024
- ASDH2024
- ASGX2024
- PAX2023
- ASM2023
- ASGX2023
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
- Graphics Designer [Synrey](https://bsky.app/profile/kaeruscene.bsky.social)
- Tester [nei\_](https://github.com/neiunderscore)

## Contributing

Thank you for your interest in contributing to this project. While we welcome any issues or pull requests that you may have, please be aware that we may not be able to address them or provide a response. If you would like to help with the development of this project, we recommend reaching out to us directly via the AusSpeedruns [Discord](http://discord.ausspeedruns.com/) or [Twitter](http://twitter.ausspeedruns.com/). This will allow us to discuss potential contributions and determine the best way for you to get involved.

## Credits

- [fit-text.tsx](https://github.com/ausspeedruns/asm-graphics/blob/main/src/graphics/elements/fit-text.tsx) Modified from a version originally written by [Hoishin](https://github.com/Hoishin), [Original Source](https://github.com/JapaneseRestream/jr-layouts/blob/master/src/browser/graphics/components/fit-text.tsx).
- [obs.ts](https://github.com/ausspeedruns/asm-graphics/blob/main/src/extensions/util/obs.ts) Modified from a version originally written by [zoton2](https://github.com/zoton2), [Original Source](https://github.com/esamarathon/esa-layouts/blob/master/src/extension/util/obs.ts).
- [Tiltify Utils](https://github.com/ausspeedruns/asm-graphics/tree/main/src/extensions/donations/util) Modified from a version originally written by [daniellockard](https://github.com/daniellockard), [Original Source](https://github.com/daniellockard/tiltify-api-client).
