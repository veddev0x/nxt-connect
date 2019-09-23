const cloudflareDetect = require('cloudflare-detect');
const cloudscraper = require('cloudscraper');
const _ = require('lodash');

const {host, platform, indexPeers} = require('../config/config');

const data = {
    platform,
    peers: [],
};

const assets = [];

const connectPeer = () => {
    return new Promise((async (resolve, reject) => {
        if (!host || !platform) {
            return reject(new Error('Please input missing config value'))
        } else if (!indexPeers) {
            // Regex for removing http/https://, www, and the trailing /
            data.peers.push(host.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]);

            console.info(`Connected to http://${host.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]}/${platform}`);
            return resolve()
        } else {
            try {
                // Regex for removing http/https://, www, and the trailing /
                const BASE_URL = `http://${host.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]}/${platform}?requestType=getPeers&state=CONNECTED&active=true`;

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
                    data.peers.push(host);
                    console.info(`Connected to default http://${peer.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]}/${platform}`)
                } else {
                    data.peers.forEach(peer => console.info(`Connected to http://${peer.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]}/${platform}`))
                }

                return resolve()
            } catch (e) {
                return reject(new Error(e.message))
            }
        }
    }))
};

const getAssetsList = async () => {
    return new Promise((async (resolve, reject) => {
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

            return resolve()
        } catch (e) {
            return reject(new Error(e.message))
        }
    }))
};

const initiate = async () => {
    try {
        await connectPeer();
        await getAssetsList()
    } catch (e) {
        console.error(e.message)
    }
};

module.exports = {
    initiate,
    connectPeer,
    data,
    assets
};