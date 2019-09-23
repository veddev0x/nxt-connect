const cloudscraper = require('cloudscraper');
const _ = require('lodash');

const {data, assets} = require('../utils/core');

const transferAsset = ({secret, recipient, pubKey, asset, quantity, fee}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const assetId = getAssetIdBySlug(asset);
            quantity = quantity * getAssetDenominatorByAsset(asset);
            fee = fee * 100000000;

            const BASE_URL = `http://${_.sample(data.peers)}/${data.platform}?requestType=transferAsset&secretPhrase=${secret}&recipient=${recipient}&asset=${assetId}&quantityQNT=${quantity}&feeNQT=${fee}&deadline=1440&message=${pubKey}`;

            const assetData = await cloudscraper.post({
                url: BASE_URL,
                json: true
            });

            if (assetData.errorCode) {
                return reject(new Error(assetData.errorDescription))
            }

            resolve()
        } catch (e) {
            reject(new Error(e.message))
        }
    })
};

const getAssetSlugById = (id) => {
    const asset = assets.find(asset => asset.id === id);

    return asset ? asset.slug : new Error('Please provide a valid asset id!')
};

const getAssetIdBySlug = (slug) => {
    const asset = assets.find(asset => asset.slug === slug);

    return asset ? asset.id : new Error('Please provide a valid asset slug!')
};

const getAssetDenominatorByAsset = (identifier) => {
    const asset = assets.find(asset => asset.slug === identifier || asset.id === identifier || asset.description === identifier);

    return asset ? asset.decimals : new Error('Please provide a valid asset!')
};

const getAssetDescriptionByAsset = (identifier) => {
    const asset = assets.find(asset => asset.slug === identifier || asset.id === identifier || asset.description === identifier);

    return asset ? asset.description : new Error('Please provide a valid asset!')
};

module.exports = {
    transferAsset,
    getAssetSlugById,
    getAssetIdBySlug,
    getAssetDenominatorByAsset,
    getAssetDescriptionByAsset
};