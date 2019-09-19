# nxt-connect

[![Build Status](https://travis-ci.com/veddev0x/nxt-connect.svg?branch=v1)](https://travis-ci.com/veddev0x/nxt-connect)
[![Dependencies](https://david-dm.org/veddev0x/nxt-connect/status.svg)](https://david-dm.org/veddev0x/nxt-connect)
[![License](https://img.shields.io/github/license/veddev0x/nxt-connect.svg)](LICENSE)

nxt-connect is a REST API client that wrapped NXT Client's Web API for simple access, it has a built-in blockchain peers indexer option to ensure your requests will never be slow if the client has massive traffic. 
We officially support [NXT Wallet](https://demo.nxtplatform.org/index.html) from the official [NXT Platform](https://nxtplatform.org/),  [WCG Wallet](https://wcgacc.com/) from three blockchain cryptocurrency exchange([EUNEX](https://eunex.co/), [MBAEX](https://mbaex.com/#/index), [WCEEX](https://www.wceex.com/)), and any existing blockchain wallets uses [NXT Client](https://nxtplatform.org/download/).

## Installation
### Requirements

- macOS 10.9+ / Linux / Windows
- [Node.js](https://nodejs.org/) `>=8` (6.x and 7.x may work but is no longer tested, please upgrade)

1. Create a folder to hold your installation: `mkdir nxt-connect`
2. FTP/Copy the contents of the zip to your newly created folder
3. Enter folder: `cd nxt-connect`
4. Install dependencies: `npm install`
5. Start application: `npm start --production`
6. Visit [http://127.0.0.1:8080](http://127.0.0.1:8080) in your browser

Keeping nxt-connect running after closing the terminal can be done in a few ways but we recommend using the `PM2` package. To set this up:

1. Install PM2: `npm install pm2 -g`
2. Add nxt-connect to PM2: `NODE_ENV=production pm2 start src/app.js --name "nxt-connect"`
3. Check PM2 has our app: `pm2 list`
4. Save the PM2 config: `pm2 save`
5. To start/stop: `pm2 start nxt-connect` / `pm2 stop nxt-connect`

> Note: Node.js version 7.x or greater is needed.

## API Documentation

**Example Response**
```bash
curl -X GET https://nxt.imvictor.me/account/WCG-83F6-KTWP-EWUK-96HNS
```

```json
{
  "accountRS": "WCG-83F6-KTWP-EWUK-96HNS",
  "accountNo": "8958192434388600228",
  "publicKey": "661759bc9541e476ffadda54fd1337edced5ab61f57884d8ab9b01f2275fee65",
  "balance": "347.981 WCG",
  "assets": [
    {
      "balance": 5000000,
      "slug": "BTC",
      "description": "BTC"
    },
    {
      "balance": 5000000,
      "slug": "ETH",
      "description": "ETH"
    },
    {
      "balance": 10000000000,
      "slug": "USD",
      "description": "USD"
    },
    {
      "balance": 10000000000,
      "slug": "RMB",
      "description": "RMB"
    },
    {
      "balance": 1776,
      "slug": "MAT",
      "description": "MAT"
    }
  ]
}
```
 
## Credits

Created and maintained by VEDDEV ([@veddev0x](https://github.com/veddev0x)).

## License

`nxt-connect` is available under the MIT license. See the [LICENSE](LICENSE) file for more info.
 
