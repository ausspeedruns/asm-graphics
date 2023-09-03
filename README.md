<h1 align="center">ASM Graphics</h1>
<div align="center"><img src="docs/img/ASM-Graphics-Hero.png?raw=true" alt="ASM-Graphics Logo"></div>
<p align="center">
  <strong>The on-stream graphics used during AusSpeedruns's marathon events.</strong>
</p>

<div align="center">

![GitHub](https://img.shields.io/github/license/AusSpeedruns/asm-graphics?style=for-the-badge)
![Events Used In](https://img.shields.io/badge/Events_Used_In-7-c72?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAUCAMAAABRYFY8AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURf///wAAAFXC034AAAACdFJOU/8A5bcwSgAAAAlwSFlzAAALEwAACxMBAJqcGAAAAF1JREFUKFN1jsERACEIA6X/pg9ICDiH+5CwguOxHflzECmqBEwoOOVVq5nQsxukz6pLRPfdJNe+Gu4nLkHd43z6meY7Tk/UyuM/9D/Gez6oNa/MsAFyHzebCrePmn3lDgD7ObFjrgAAAABJRU5ErkJggg==)
![Twitch Status](https://img.shields.io/twitch/status/ausspeedruns?style=for-the-badge&logo=twitch&logoColor=white)
![Twitter Follow](https://img.shields.io/twitter/follow/ausspeedruns?style=for-the-badge&logo=twitter&logoColor=white&color=1DA1F2)

</div>

## Before using

This is only intended to be used as an _education tool_. Please learn from the code to be able to create your own layouts. **Do not download and use as is!**

## Table of Contents

-   [Before using](#before-using)
-   [Table of Contents](#table-of-contents)
-   [Features](#features)
-   [Requirements](#requirements)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Config Schema](#config-schema)
-   [Events used in](#events-used-in)
-   [License](#license)
-   [Authors](#authors)
-   [Contributing](#contributing)
-   [Credits](#credits)

## Features

-   Ticker/Omnibar system
-   Support for 12 different game layouts
-   Race and Co-op
-   Couch and Host names
-   Audio indicators
-   Intermission screen
-   Online functionality with OBS support
-   Custom host dashboard
-   Automatic incentive data
-   Storybook testing
-   Read twitter hashtags
-   Custom nodecg-speedcontrol schedule import
-   Runner tablet (In development!)
-   X32 Connectivity (Coming soon!)

## Requirements

-   [NodeCG](https://www.nodecg.dev/): 1.9.0
-   [nodecg-speedcontrol](https://github.com/speedcontrol): 2.4.0

To use the OBS audio indicators you must have [OBS-WebSocket](https://github.com/obsproject/obs-websocket) version 5.0.0. This plugin comes by default in OBS v28.

## Installation

Currently no automated builds are active. You must install and build this manually.

1. Install [NodeCG](https://www.nodecg.dev/docs/installing)
2. Install [nodecg-speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol#installation)
3. Starting from the _root_ NodeCG folder

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

-   `obs`
    -   Enables the use of OBS-WebSocket in the bundle, currently used for audio indicators but previously used to remotely change scenes during online events.
    -   `enabled`: Boolean
    -   `port`: Number
    -   `ip`: String
    -   `password`: String
-   `twitch`
    -   `parents`: String[]
        -   [Twitch embed parameter](https://dev.twitch.tv/docs/embed/everything#embed-parameters)
-   `twitter`
    -   Get tweets about the event to display on stream. _Will work for ~30 mins and then break._
    -   `enabled`: Boolean
    -   `key`: String
        -   Twitter API key
    -   `secret`: String
        -   Twitter API secret key
    -   `bearer`: String
        -   Twitter API bearer key
    -   `rules`: Object[]
        -   Twitter API rules on what to search for
        -   _Currently unused_
-   `hostname`: String
    -   Used when hosting NodeCG on an external server with a domain name
    -   Only used to configure a URL for online mode
-   `tilitfy`
    -   `enabled`: Boolean
    -   `key`: String
        -   Tiltify API key
    -   `campaign`: String
        -   Tiltify campaign ID
-   `graphql`
    -   Used for getting incentives and runner information from the [ausspeedruns.com](https://ausspeedruns.com/) website
    -   `url`: String
        -   URL for GraphQL server
    -   `event`: String
        -   Event's short name to filter results from the graphql server

## Events used in

-   ASGX2023
-   ASAP2022
-   ASM2022
-   PAX2021
-   ASM2021
-   FAST2020
-   PAX Online 2020
-   ASM2020

## License

asm-graphics is provided under the Mozilla Public License v2.0, which is available to read in the LICENSE file.

## Authors

-   Lead developer and designer [Ewan "Clubwho" Lyon](https://github.com/EwanLyon)
-   Tester [nei\_](https://github.com/neiunderscore)

## Contributing

Thank you for your interest in contributing to this project. While we welcome any issues or pull requests that you may have, please be aware that we may not be able to address them or provide a response. If you would like to help with the development of this project, we recommend reaching out to us directly via the AusSpeedruns [Discord](http://discord.ausspeedruns.com/) or [Twitter](http://twitter.ausspeedruns.com/). This will allow us to discuss potential contributions and determine the best way for you to get involved.

## Credits

-   [fit-text.tsx](https://github.com/ausspeedruns/asm-graphics/blob/main/src/graphics/elements/fit-text.tsx) Modified from a version originally written by [Hoishin](https://github.com/Hoishin), [Original Source](https://github.com/JapaneseRestream/jr-layouts/blob/master/src/browser/graphics/components/fit-text.tsx).
-   [obs.ts](https://github.com/ausspeedruns/asm-graphics/blob/main/src/extensions/util/obs.ts) Modified from a version originally written by [zoton2](https://github.com/zoton2), [Original Source](https://github.com/esamarathon/esa-layouts/blob/master/src/extension/util/obs.ts).
-   [Tiltify Utils](https://github.com/ausspeedruns/asm-graphics/tree/main/src/extensions/donations/util) Modified from a version originally written by [daniellockard](https://github.com/daniellockard), [Original Source](https://github.com/daniellockard/tiltify-api-client).
