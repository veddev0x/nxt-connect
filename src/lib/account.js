const cloudscraper = require('cloudscraper');
const _ = require('lodash');

const {getAssetSlugById, getAssetDenominatorByAsset, getAssetDescriptionByAsset} = require('./asset');
const {data} = require('../utils/core');

const getAccount = (address) => {
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

module.exports = {
    getAccount,
};