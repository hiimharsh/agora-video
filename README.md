# Agora Video

### Agora Video uses [Agora](https://agora.io/en/) to broadcast and live stream

<br><br>

## Installation
---
Using NPM
```
$ npm install
```

Using Yarn
```
$ yarn install
```

<br>

## Use your Agora appId
---
- Create .env file in the root path of the project directory
- Copy appId from your Agora project
- Add appId in .env file

```
REACT_APP_AGORA_APP_ID=<agora_app_id>
```

<br>

## Run the application
---
Using NPM
```
$ npm start
```

Using Yarn
```
$ yarn run start
```

<br><br>

## Instructions
---

Live streaming only starts when host starts the video stream then other guests can join.

For Host
- Add ```?host=true``` as query parameters in base URL
- This will start the local stream from the host side 

For Guest
- Wait for host to join, then the stream will be started for the guest

<br><br>

## Libraries used
---
- Chakra UI (UI Library)
- Agora (Live Streaming Platform)