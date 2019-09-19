const cloudscraper = require('cloudscraper');
const _ = require('lodash');

const {getAssetIdBySlug, getAssetSlugById, getAssetDenominatorByAsset, getAssetDescriptionByAsset} = require('./asset');
const {data} = require('../utils/core');

const details = (address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const nqtDenominator = 100000000;
            const BASE_URL = `http://${_.sample(data.peers)}/${data.platform}?requestType=getAccount&account=${address}&includeAssets=true&includeCurrencies=true&includeLessors=true&includeEffectiveBalance=true`;

            const accountData = await cloudscraper.get({
                url: BASE_URL,
                simple: true,
                json: true,
                gzip: true
            });

            if (accountData.errorCode) {
                return reject(accountData.errorDescription)
            }

            //Initialise balances object
            const assets = [];

            // Sort assets into an array if it exists
            if (accountData.unconfirmedAssetBalances) {
                for (let i = 0; i < accountData.unconfirmedAssetBalances.length; i++) {
                    assets.push({
                        balance: accountData.unconfirmedAssetBalances[i].unconfirmedBalanceQNT / getAssetDenominatorByAsset(accountData.unconfirmedAssetBalances[i].asset),
                        slug: getAssetSlugById(accountData.unconfirmedAssetBalances[i].asset),
                        description: getAssetDescriptionByAsset(accountData.unconfirmedAssetBalances[i].asset),
                        //id: accountData.unconfirmedAssetBalances[i].asset
                    })
                }
            }

            resolve({
                accountRS: address,
                accountNo: accountData.account,
                publicKey: accountData.publicKey,
                balance: `${accountData.guaranteedBalanceNQT / nqtDenominator} ${data.platform.toUpperCase()}`,
                assets,
            })
        } catch (e) {
            reject(new Error(e.message))
        }
    })
};

const sendAsset = ({secret, recipient, pubKey, asset, quantity, fee}) => {
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

const sendNQT = () => {

};

module.exports = {
    details,
    sendAsset,
};