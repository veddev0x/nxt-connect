const rq = require('request-promise-native');

const endpoint = require('./endpoint');

const {
    WCG_HOST,
    WCG_ARGUMENT
} = endpoint('wcg');

const details = (address) => {
    return new Promise(async (resolve, reject) => {
        const nqtDenominator = 100000000;
        const qntDenominator = 10000;

        const DETAILS_ENDPOINT = WCG_HOST + WCG_ARGUMENT + 'getAccount&account=' + address + '&includeAssets=true&includeCurrencies=true&includeLessors=true&includeEffectiveBalance=true';

        try {
            const response = await rq.get({
                url: DETAILS_ENDPOINT,
                simple: true,
                json: true,
                gzip: true
            });

            if (response.errorCode) {
                return reject(response.errorDescription)
            }

            //Initialise balances object
            balances = {
                balance: response.guaranteedBalanceNQT / nqtDenominator + ' WCG',
                //confirmedBalance: response.unconfirmedBalanceNQT / nqtDenominator + ' WCG',
                assetBalances: []
            };

            // Sort assets into an array if it exists
            if (response.unconfirmedAssetBalances) {
                for (let i = 0; i < response.unconfirmedAssetBalances.length; i++) {
                    balances.assetBalances.push({
                        balance: response.unconfirmedAssetBalances[i].unconfirmedBalanceQNT / qntDenominator,
                        asset: assetIds(response.unconfirmedAssetBalances[i].asset)
                    })
                }
            }

            resolve({
                accountRS: address,
                accountNo: response.account,
                publicKey: response.publicKey,
                balances,
            })
        } catch (e) {
            reject(Error(e.message))
        }
    })
};

const sendAsset = ({
                       secret,
                       recipient,
                       public,
                       asset,
                       quantity,
                       fee
                   } = {}) => {
    return new Promise(async (resolve, reject) => {
        const BASE_URL = `${WCG_HOST}${WCG_ARGUMENT}transferAsset&secretPhrase=${secret}&recipient=${recipient}&asset=${assetNames(asset)}&quantityQNT=${quantity}&feeNQT=${fee}&deadline=1440&message=${public}`;

        try {
            const response = await rq.post({
                url: BASE_URL,
                json: true
            });

            if (response.errorCode) {
                return reject(Error(response.errorDescription))
            }

            resolve()
        } catch (e) {
            reject(Error(e.message))
        }
    })
};

const assetIds = (id) => {
    switch (id) {
        case '12642904667336691118':
            return 'MTR';

        case '9951652917557839098':
            return 'BTC';

        case '9979029902771422842':
            return 'MLT';

        case '10096949507418071269':
            return 'SMT';

        case '11164589766816208741':
            return 'USDTK';

        case '11835391898538536373':
            return 'GVM';

        case '13251538396235236704':
            return 'GGS';

        case '13287806778762418943':
            return 'GMV';

        case '14166359669915381351':
            return 'AAESP';

        case '14818954199931010951':
            return 'ENX';

        case '15088999170972565956':
            return 'USD';

        case '15869217906426789419':
            return 'AMT';

        case '17636412254730515308':
            return 'RMB';

        case '17662811370611592334':
            return 'EQT';

        case '353104977013770161':
            return 'WHT';

        case '411043316357352222':
            return 'WOS';

        case '2300266805533544530':
            return 'WFTT';

        case '2386943605531855490':
            return 'GBF';

        case '2721668346522778691':
            return 'TLT';

        case '3586167118672230171':
            return 'JEI';

        case '6316460833260624272':
            return 'MAT';

        case '6757590879201185567':
            return 'HTK';

        case '6948104888712810235':
            return 'ETH';

        case '7171868846042689336':
            return 'CTM';

        case '7776054229687920460':
            return 'DRT';

        case '7818032163283026445':
            return 'GFT';

        case '8342642094929787676':
            return 'WEN';

        case '8733765331911043438':
            return 'NRT';

        default:
            return `Asset ${id}does not exist.`
    }
};

const assetNames = (name) => {
    switch (name) {
        case 'MTR':
            return '12642904667336691118';

        case 'BTC':
            return '9951652917557839098';

        case 'MLT':
            return '9979029902771422842';

        case 'SMT':
            return '10096949507418071269';

        case 'USDTK':
            return '11164589766816208741';

        case 'GVM':
            return '11835391898538536373';

        case 'GGS':
            return '13251538396235236704';

        case 'GMV':
            return '13287806778762418943';

        case 'AAESP':
            return '14166359669915381351';

        case 'ENX':
            return '14818954199931010951';

        case 'USD':
            return '15088999170972565956';

        case 'AMT':
            return '15869217906426789419';

        case 'RMB':
            return '17636412254730515308';

        case 'EQT':
            return '17662811370611592334';

        case 'WHT':
            return '353104977013770161';

        case 'WOS':
            return '411043316357352222';

        case 'WFTT':
            return '2300266805533544530';

        case 'GBF':
            return '2386943605531855490';

        case 'TLT':
            return '2721668346522778691';

        case 'JEI':
            return '3586167118672230171';

        case 'MAT':
            return '6316460833260624272';

        case 'HTK':
            return '6757590879201185567';

        case 'ETH':
            return '6948104888712810235';

        case 'CTM':
            return '7171868846042689336';

        case 'DRT':
            return '7776054229687920460';

        case 'GFT':
            return '7818032163283026445';

        case 'WEN':
            return '8342642094929787676';

        case 'NRT':
            return '8733765331911043438';

        default:
            return `Asset ${name} does not exist.`
    }
};

module.exports = {
    details,
    sendAsset
};