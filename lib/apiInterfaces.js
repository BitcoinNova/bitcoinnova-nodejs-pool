/**
 * Cryptonote Node.JS Pool
 * https://github.com/dvandal/cryptonote-nodejs-pool
 *
 * Handle communications to APIs
 **/

// Load required modules
var http = require('http');
var https = require('https');
let logSystem = 'apiInterfacesc';

function jsonHttpRequest(host, port, data, callback, path) {
    config.restfulApiDaemonAndWallet = config.restfulApiDaemonAndWallet || false
    config.restfulApiWallet = config.restfulApiWallet	|| false
    if (
        (config.restfulApiDaemonAndWallet == true || (config.restfulApiWallet == true && port == config.wallet.port))
        && (host == config.daemon.host || host == config.wallet.host)
        && (port == config.daemon.port || port == config.wallet.port)
    ) {
        let address = '';
        let jsonData = JSON.parse(data);
        let methodSend = 'GET';
        let resultFormat = '';
        switch (jsonData.method) {
            case 'getblockcount':
                address += '/block/count';
                resultFormat = JSON.parse(JSON.stringify(
                    {
                        jsonrpc: '2.0',
                        result: {
                            count: 0,
                            status: 'OK'
                        }
                    }
                ));
                break;
            case 'getBalance':
                address += '/balance';
                resultFormat = JSON.parse(JSON.stringify(
                    {
                        id: 1,
                        jsonrpc: '2.0',
                        result: {
                            availableBalance: 0,
                            lockedAmount: 0
                        }
                    }
                ));
                break;
            case 'getblock':
                address += '/block/' + jsonData.params.hash;
                resultFormat = JSON.parse(JSON.stringify(
                    {
                        jsonrpc: '2.0',
                        result: {
                            block: {
                                alreadyGeneratedCoins: '',
                                alreadyGeneratedTransactions: 0,
                                baseReward: 0,
                                blockSize: 0,
                                depth: 0,
                                difficulty: 0,
                                effectiveSizeMedian: 0,
                                hash: '',
                                height: 0,
                                major_version: 0,
                                minor_version: 0,
                                nonce: 0,
                                orphan_status: false,
                                penalty: 0.0,
                                prev_hash: '',
                                reward: 0,
                                sizeMedian: 0,
                                timestamp: 0,
                                totalFeeAmount: 0,
                                transactions: [
                                    {
                                        amount_out: 0,
                                        fee: 0,
                                        hash: '',
                                        size: 0
                                    }
                                ],
                                transactionsCumulativeSize: 0
                            },
                            status: 'OK'
                        }
                    }
                ));
                break;
            case 'getlastblockheader':
                address += '/block/last';
                resultFormat = JSON.parse(JSON.stringify(
                    {
                        jsonrpc: '2.0',
                        result: {
                            block_header: {
                                block_size: 0,
                                depth: 0,
                                difficulty: 0,
                                hash: '',
                                height: 0,
                                major_version: 0,
                                minor_version: 0,
                                nonce: 0,
                                num_txes: 0,
                                orphan_status: false,
                                prev_hash: '',
                                reward: 0,
                                timestamp: 0
                            },
                            status: 'OK'
                        }
                    }
                ));
                break;

            case 'getblockheaderbyheight':
                address += '/block/' + jsonData.params.height;
                resultFormat = JSON.parse(JSON.stringify(
                    {
                        jsonrpc: '2.0',
                        result: {
                            block_header: {
                                block_size: 0,
                                depth: 0,
                                difficulty: 0,
                                hash: '',
                                height: 0,
                                major_version: 0,
                                minor_version: 0,
                                nonce: 0,
                                num_txes: 0,
                                orphan_status: false,
                                prev_hash: '',
                                reward: 0,
                                timestamp: 0
                            },
                            status: 'OK'
                        }
                    }
                ));
                break;

            case 'get_info':
                address += '/info';
                resultFormat = JSON.parse(JSON.stringify(
                    {
                        alt_blocks_count: 0,
                        difficulty: 0,
                        grey_peerlist_size: 0,
                        hashrate: 0,
                        height: 0,
                        incoming_connections_count: 0,
                        last_known_block_index: 0,
                        major_version: 0,
                        minor_version: 0,
                        network_height: 0,
                        outgoing_connections_count: 0,
                        start_time: 0,
                        status: 'OK',
                        supported_height: 0,
                        synced: true,
                        testnet: false,
                        tx_count: 0,
                        tx_pool_size: 0,
                        upgrade_heights: [],
                        version: '0',
                        white_peerlist_size: 0
                    }
                ));
                break;
            case 'getblocktemplate':
                address += '/block/template';
                methodSend = 'POST';
                resultFormat = JSON.parse(JSON.stringify(
                    {
                        jsonrpc: '2.0',
                        result: {
                            blocktemplate_blob: '',
                            difficulty: 0,
                            height: 0,
                            reserved_offset: 0,
                            status: 'OK'
                        }
                    }
                ));
                break;
            case 'sendTransaction':
                address += '/transactions/send/advanced';
                methodSend = 'POST';
                resultFormat = JSON.parse(JSON.stringify(
                    {
                        id: 1,
                        jsonrpc: '2.0',
                        result: {
                            transactionHash: '',
                            fee: 0
                        }
                    }
                ));
                break;
            case 'submitblock':
                address += '/block';
                methodSend = 'POST';
                resultFormat = JSON.parse(JSON.stringify(
                    {
                        jsonrpc: '2.0',
                        result: {
                            status: 'OK'
                        }
                    }
                ));
                break;
            default:
                log('error', logSystem, 'host: %j, port: %j, method: %j, params: %j, callback: %s', [host, port, jsonDataLog.method, jsonDataLog.params, callback]);
                break;
        }
        if (methodSend == 'POST') {
            switch (jsonData.method) {
                case "getblocktemplate":
                    data = JSON.stringify({
                        address: jsonData.params.wallet_address,
                        reserveSize: jsonData.params.reserve_size
                    });
                    break;
                case "sendTransaction":
                    var arrayObj = [];
                    for (let i = 0; i < jsonData.params.transfers.length; i++) {
                        var objPay = { address: '', amount: 0 };
                        objPay.address = jsonData.params.transfers[i].address;
                        objPay.amount = jsonData.params.transfers[i].amount;
                        arrayObj.push(objPay);
                    }
                    let dataTemp = {
                        mixin: jsonData.params.anonymity,
                        unlockTime: jsonData.params.unlockTime,
                        destinations: arrayObj
                    };
                    if (jsonData.params.changeAddress) {
                        dataTemp.changeAddress = jsonData.params.changeAddress;
                    }
                    if (jsonData.params.paymentId) {
                        dataTemp.paymentId = jsonData.params.paymentId;
                    }
                    data = JSON.stringify(dataTemp)

                    break;
                case "submitblock":
                    data = jsonData.params[0];
                    break;
                default:
                    break;
            }
            path = address;
            callback = callback || function () { };


            var options = {
                hostname: host,
                port: port,
                path: path,
                method: 'POST',
                headers: {
                    'Content-Length': data.length,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-API-KEY': config.wallet.password
                }
            };

            var req = (port === 443 ? https : http)
                .request(options, function (res) {
                    var replyData = '';
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        replyData += chunk;
                    });
                    res.on('end', function () {
                        var replyJson;
                        var tempReply;
                        try {
                            replyJson = replyData ? JSON.parse(replyData) : {};
                            tempReply = resultFormat;
                            switch (jsonData.method) {
                                case 'getblocktemplate':
                                    if (replyJson.error != null) {
                                        replyJson = replyJson
                                    } else {
                                        tempReply.result.blocktemplate_blob = replyJson.blob;
                                        tempReply.result.difficulty = replyJson.difficulty;
                                        tempReply.result.height = replyJson.height;
                                        tempReply.result.reserved_offset = replyJson.reservedOffset;
                                        replyJson = tempReply;
                                    }
                                    break;
                                case 'sendTransaction':
                                    if (replyJson.error != null) {
                                        replyJson = replyJson
                                    } else {
                                        tempReply.result.transactionHash = replyJson.transactionHash;
                                        tempReply.result.fee = replyJson.fee;
                                        replyJson = tempReply;
                                    }
                                    break;
                                case 'submitblock':
                                    if (replyJson.error != null) {
                                        replyJson = replyJson
                                    } else {
                                        replyJson = tempReply;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        } catch (e) {
                            callback(e, {});
                            return;
                        }
                        callback(null, replyJson);
                    });
                });

            req.on('error', function (e) {
                callback(e, {});
            });
            req.end(data);
        } else {
            options = {
                hostname: host,
                port: port,
                path: address,
                headers: {
                    'X-API-KEY': config.wallet.password,
                    'Accept': 'application/json'
                }
            };
            var req = (port === 443 ? https : http)
                .get(options, function (res) {
                    var replyData = '';
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        replyData += chunk;
                    });
                    res.on('end', function () {
                        var replyJson;
                        var tempReply;
                        try {
                            replyJson = replyData ? JSON.parse(replyData) : {};
                            tempReply = resultFormat;
                            switch (jsonData.method) {
                                case 'getlastblockheader':
                                    if (replyJson.error != null) {
                                        replyJson = replyJson
                                    } else {
                                        tempReply.result.block_header.block_size = replyJson.size;
                                        tempReply.result.block_header.depth = replyJson.depth;
                                        tempReply.result.block_header.difficulty = replyJson.difficulty;
                                        tempReply.result.block_header.hash = replyJson.hash;
                                        tempReply.result.block_header.height = replyJson.height;
                                        tempReply.result.block_header.major_version = replyJson.majorVersion;
                                        tempReply.result.block_header.minor_version = replyJson.minorVersion;
                                        tempReply.result.block_header.nonce = replyJson.nonce;
                                        tempReply.result.block_header.num_txes = replyJson.transactionCount;
                                        tempReply.result.block_header.orphan_status = replyJson.orphan;
                                        tempReply.result.block_header.prev_hash = replyJson.prevHash;
                                        tempReply.result.block_header.reward = replyJson.reward;
                                        tempReply.result.block_header.timestamp = replyJson.timestamp;
                                        replyJson = tempReply;
                                    }
                                    break;
                                case 'getBalance':
                                    if (replyJson.error != null) {
                                        replyJson = replyJson
                                    } else {
                                          tempReply.result.availableBalance = replyJson.unlocked / config.coinUnits;
                                          tempReply.result.lockedAmount = replyJson.locked / config.coinUnits;
                                          replyJson = tempReply;
                                    }
                                    break;
                                case 'getblockheaderbyheight':
                                    if (replyJson.error != null) {
                                        replyJson = replyJson
                                    } else {
                                        tempReply.result.block_header.block_size = replyJson.size;
                                        tempReply.result.block_header.depth = replyJson.depth;
                                        tempReply.result.block_header.difficulty = replyJson.difficulty;
                                        tempReply.result.block_header.hash = replyJson.hash;
                                        tempReply.result.block_header.height = replyJson.height;
                                        tempReply.result.block_header.major_version = replyJson.majorVersion;
                                        tempReply.result.block_header.minor_version = replyJson.minorVersion;
                                        tempReply.result.block_header.nonce = replyJson.nonce;
                                        tempReply.result.block_header.num_txes = replyJson.transactionCount;
                                        tempReply.result.block_header.orphan_status = replyJson.orphan;
                                        tempReply.result.block_header.prev_hash = replyJson.prevHash;
                                        tempReply.result.block_header.reward = replyJson.reward;
                                        tempReply.result.block_header.timestamp = replyJson.timestamp;
                                        replyJson = tempReply;
                                    }
                                    break;
                                case 'getblockcount':
                                    if (replyJson.error != null) {
                                        replyJson = replyJson
                                    } else {
                                        tempReply.result.count = replyJson;
                                        replyJson = tempReply;
                                    }
                                    break;
                                case 'get_info':
                                    if (replyJson.error != null) {
                                        replyJson = replyJson
                                    } else {
                                        tempReply.alt_blocks_count = replyJson.alternateBlockCount
                                        tempReply.result.difficulty = replyJson.difficulty
                                        tempReply.result.grey_peerlist_size = replyJson.greyPeerlistSize
                                        tempReply.result.hashrate = replyJson.hashrate
                                        tempReply.result.height = replyJson.height
                                        tempReply.result.incoming_connections_count = replyJson.incomingConnections
                                        tempReply.result.last_known_block_index = replyJson.lastBlockIndex
                                        tempReply.result.major_version = replyJson.majorVersion
                                        tempReply.result.minor_version = replyJson.minorVersion
                                        tempReply.result.network_height = replyJson.networkHeight
                                        tempReply.result.outgoing_connections_count = replyJson.outgoingConnections
                                        tempReply.result.start_time = replyJson.startTime
                                        tempReply.result.supported_height = replyJson.supportedHeight
                                        tempReply.result.synced = replyJson.synced
                                        tempReply.result.tx_count = replyJson.transactionsSize
                                        tempReply.result.tx_pool_size = replyJson.transactionsPoolSize
                                        tempReply.result.upgrade_heights = replyJson.upgradeHeights
                                        tempReply.result.version = replyJson.version
                                        tempReply.result.white_peerlist_size = replyJson.whitePeerlistSize
                                        replyJson = tempReply;
                                    }
                                    break;
                                case 'getblock':
                                    if (replyJson.error != null) {
                                        replyJson = replyJson
                                    } else {
                                        tempReply.result.block.alreadyGeneratedCoins = replyJson.alreadyGeneratedCoins;
                                        tempReply.result.block.alreadyGeneratedTransactions = replyJson.alreadyGeneratedTransactions;
                                        tempReply.result.block.baseReward = replyJson.baseReward;
                                        tempReply.result.block.blockSize = replyJson.size;
                                        tempReply.result.block.depth = replyJson.depth;
                                        tempReply.result.block.difficulty = replyJson.difficulty;
                                        tempReply.result.block.effectiveSizeMedian = 100000;
                                        tempReply.result.block.hash = replyJson.hash;
                                        tempReply.result.block.height = replyJson.height;
                                        tempReply.result.block.major_version = replyJson.majorVersion;
                                        tempReply.result.block.minor_version = replyJson.minorVersion;
                                        tempReply.result.block.nonce = replyJson.nonce;
                                        tempReply.result.block.orphan_status = replyJson.orphan;
                                        tempReply.result.block.penalty = replyJson.penalty;
                                        tempReply.result.block.prev_hash = replyJson.prevHash;
                                        tempReply.result.block.reward = replyJson.reward;
                                        tempReply.result.block.sizeMedian = replyJson.sizeMedian;
                                        tempReply.result.block.timestamp = replyJson.timestamp;
                                        tempReply.result.block.totalFeeAmount = replyJson.totalFeeAmount;
                                        tempReply.result.block.transactionsCumulativeSize = replyJson.transactionsCumulativeSize;
                                        if (replyJson.transactions != null) {
                                            if (replyJson.transactions.count > 0) {
                                                for (let i = 0; i < replyJson.transactions.count; i++) {
                                                    replyJson.transactions[i].amount_out = replyJson.transactions[i].amountOut;
                                                }

                                            }
                                        }
                                        tempReply.result.block.transactions = replyJson.transactions;
                                        replyJson = tempReply;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        } catch (e) {
                            callback(e, {});
                            return;
                        }
                        callback(null, replyJson);
                    });
                });

            req.on('error', function (e) {
                callback(e, {});
            });
            req.end(data);
        }



    }
    else {
        path = path || '/json_rpc';
        callback = callback || function () { };
        var options = {
            hostname: host,
            port: port,
            path: path,
            method: data ? 'POST' : 'GET',
            headers: {
                'Content-Length': data.length,
                'Content-Type': 'application/json',
		'password': config.wallet.password,
                'Accept': 'application/json'
            }
        };
        var req = (port === 443 ? https : http)
            .request(options, function (res) {
                var replyData = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    replyData += chunk;
                });
                res.on('end', function () {
                    var replyJson;
                    try {
                        replyJson = replyData ? JSON.parse(replyData) : {};
                    } catch (e) {
                        callback(e, {});
                        return;
                    }
                    callback(null, replyJson);
                });
            });

        req.on('error', function (e) {
            callback(e, {});
        });
        req.end(data);
    }

}

/**
 * Send RPC request
 **/
function rpc(host, port, method, params, callback) {

    var request = {
        id: "0",
        jsonrpc: "2.0",
        password: config.wallet.password,
        method: method,
        params: params
    };
    var data = JSON.stringify(request);

    jsonHttpRequest(host, port, data, function (error, replyJson) {
        if (error) {
            callback(error, {});
            return;
        }
        callback(replyJson.error, replyJson.result);
    });

}

/**
 * Send RPC requests in batch mode
 **/
function batchRpc(host, port, array, callback) {
    var rpcArray = [];
    for (var i = 0; i < array.length; i++) {
        rpcArray.push({
            id: i.toString(),
            jsonrpc: "2.0",
	    password: config.wallet.password,
            method: array[i][0],
            params: array[i][1]
        });
    }
    var data = JSON.stringify(rpcArray);
    jsonHttpRequest(host, port, data, callback);
}

/**
 * Send RPC request to pool API
 **/
function poolRpc(host, port, path, callback) {
    jsonHttpRequest(host, port, '', callback, path);
}

/**
 * Exports API interfaces functions
 **/
module.exports = function (daemonConfig, walletConfig, poolApiConfig) {
    return {
        batchRpcDaemon: function (batchArray, callback) {
            batchRpc(daemonConfig.host, daemonConfig.port, batchArray, callback);
        },
        rpcDaemon: function (method, params, callback, serverConfig) {
            if (serverConfig) {
                rpc(serverConfig.host, serverConfig.port, method, params, callback);
            } else {
                rpc(daemonConfig.host, daemonConfig.port, method, params, callback);
            }
        },
        rpcWallet: function (method, params, callback) {
            rpc(walletConfig.host, walletConfig.port, method, params, callback);
        },
        pool: function (path, callback) {
            var bindIp = config.api.bindIp ? config.api.bindIp : "0.0.0.0";
            var poolApi = (bindIp !== "0.0.0.0" ? poolApiConfig.bindIp : "127.0.0.1");
            poolRpc(poolApi, poolApiConfig.port, path, callback);
        },
        jsonHttpRequest: jsonHttpRequest
    }
};
