const cloudflareDetect = require('cloudflare-detect');
const cloudscraper = require('cloudscraper');
const _ = require('lodash');

const {host, platform, indexPeers} = require('../config/config');

const data = {
    platform,
    peers: [],
};

const assets = [];

const connectPeer = async () => {
    if (!host || !platform) {
        console.error('Please input missing config value')
    } else if (!indexPeers) {
        data.peers.push(host);
        console.info(`Connected to ${data.peers.length} peer(s)`)
    } else {
        try {
            const BASE_URL = `http://${host}/${platform}?requestType=getPeers&state=CONNECTED&active=true`;

            const peersData = await cloudscraper.get({
                url: BASE_URL,
                json: true,
                gzip: true,
                simple: true
            });

            for (let peer of peersData.peers) {
                const cloudflare = await cloudflareDetect(peer);
                // Detect Cloudflare and IPv6
                if (!cloudflare && !peer.includes('[')) {
                    try {
                        // Check if peer is online and active
                        const peerStatus = await cloudscraper.get({
                            url: `http://${peer}/${platform}?requestType=getPeers&state=CONNECTED`,
                            json: true,
                            gzip: true,
                            timeout: 3000
                        });

                        if (peerStatus.peers) {
                            data.peers.push(peer);
                        }
                    } catch (e) {

                    }

                }
            }

            if (data.peers.length === 0) {
                console.error('It seems that the master host does not have any compatible working peers, please try again later')
            } else {
                console.info(`Connected to ${data.peers.length} peer(s)`)
            }
        } catch (e) {
            console.error(e.message)
        }
    }
};

const getAssets = async () => {
    try {
        const BASE_URL = `http://${_.sample(data.peers)}/${data.platform}?requestType=getAllAssets`;

        const assetsData = await cloudscraper.get({
            url: BASE_URL,
            json: true,
            simple: true,
            gzip: true
        });

        assetsData.assets.forEach((assetObject) => {
            assets.push({
                slug: assetObject.name,
                description: assetObject.description,
                id: assetObject.asset,
                decimals: Math.pow(10, assetObject.decimals)
            })
        });
    } catch (e) {
        return new Error(e.message)
    }
};

const initiate = () => {
    connectPeer();
    getAssets()
};

module.exports = {
    initiate,
    connectPeer,
    data,
    assets
};