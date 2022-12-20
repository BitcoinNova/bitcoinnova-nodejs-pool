/**
 * Cryptonote Node.JS Pool
 * https://github.com/dvandal/cryptonote-nodejs-pool
 *
 * Configuration Reader
 **/

// Load required modules
let fs = require('fs');

// Set pool software version
global.version = "v2.1.5";

/**
 * Load pool configuration
 **/

// Get configuration file path
let configFile = (function () {
	for (let i = 0; i < process.argv.length; i++) {
		if (process.argv[i].indexOf('-config=') === 0)
			return process.argv[i].split('=')[1];
	}
	return 'config.json';
})();

// Read configuration file data
try {
	global.config = JSON.parse(fs.readFileSync(configFile));
} catch (e) {
	console.error('Failed to read config file ' + configFile + '\n\n' + e);
	return;
}

/**
 * Developper donation addresses -- thanks for supporting my works!
 **/

let donationAddresses = {
	BTC: '17qFGHhPWLQrGsd9k8BUGNdFerJKijaJCa',
	BCH: 'qq7jengltv0f3rg9qg6llyr2pf4373449ccfgvk33d',
	DASH: 'XmVmSDjFcW3oLwr84vRWJ7aLxCcmZQmATv',
	ETH: '0x5b36048661E96BB53959D65c98459F47263Cd7E3',
	LTC: 'LUF4yJuyBumxraM4xLQybZvh23o7oyK39b',
	BAT: '0x5b36048661E96BB53959D65c98459F47263Cd7E3',
	BTN: 'ECVVceHwZQaNg7BNuAjJXhbQFJnLcmxyxJ7CXNBnb2M5YUsVMKaAD8ceNHiGSqdS7hJWKLEC38kFeWU6F5dVpLm2QPcLWdj',
	CIRQ: 'cirqgBwr2odjCpFpRtxeoq2Ze8eAcghdMa3z6Adr3bxXMbmghyikrajGy2L8iF4LkQJkLKhkgHA2oH6xm2YQ2cak7MmdiTYrKyc',
	GNS: 'gnsm2mqhwK69bMLnTZYDiTereTETBUbNuGEoY7rguPrfAQvjM7ddpDbMGHDZm3FUia1KXV77rMRPaUuPeCBFPbw314JmS11SEt',
	INF: 'inf8RHyNSL4283w14VB4XfaqsqDaZPrfNHYVjGwSNL9NXkEFxtxJ4kLdXt8SazvcqpKjvsaEvRfKEXSHBotq2pRvATJ7otPSyG',
	ZTC: 'Ze4tc4mTG137cG3i5oa8yLAW4iZvPoRVsEx5dGRhiEcoEWEVCBvc4hB6fcDyqE2FoWPpLWnGGswq19yqsFi1bhDd1XnDmtD6T',
	WXTC: 'WcBawbuLjCDBYZJC473GTtXkzgyEfNAyJTeugBpowcz7fN1ZHeUxfAf8nqVhjiAN9iATfzKhhPpeXfMp5iJwN3j221ubCgxxz',
	SCSX: 'Sdj7SuGLYZwfspdSs2BtsUfShoVYczXHX6XWugrH9KuwAFyMqcgGU6cJ4eRKxXsT9dSR8FJ1YVz1BBtJkQWZ7RG42oQd3o1hH',
	QWC: 'QWC1XeuQUHv5rWqZ7cqMzbLSUFJSxbnib4tLJXmYNtXNg8cRSSEEpkE7Ea6CA73Gxz7UXT6sb2Vd42HsMCpXGmbC75n386hgqN',
	NACA: 'NaCaT1sh8fVL1KtkcUxutqN9CTHEzqiBuR4NLNRi8Zb27DfwT6HAwn93WrRpJKUFSfMi6ymPLWyrZLZiN28cVbAw92y7FnAsG1',
	ARMS: 'gunsHizFC6rGUPb8haA3qhJbDy6WY5vhrLkAVnZRM29SQRTzVQ3m21FesvWWKtE7NhJiwJiMLkbMxi7bPu2ydiJf2JHv8E3A6W',
	ZUM: 'Zum1yikawsGL3bmxh8AzFYHcq6myxSq4wZ9C84FomBQwLfFymWK7ih4L99eTsdTHEXPmUJ7EcetBf3Ad2k2Zzer22ijZnc8BVnD',
	XMR: '442uRjHUQp66Q2xqXzqfPVdy8qxrQ56aoCJXH7T5D43DUPybhVKTSTpaQiDvrBkd778dik1aRPNkBH79xi5HbTQL8MVfRT7'

};

global.donations = {};

global.devFee = config.blockUnlocker.devDonation || 0.5;
if (config.blockUnlocker.devDonation === 0){
	global.devFee = 0.0;
}

let wallet = donationAddresses[config.symbol.toUpperCase()];
if (devFee && wallet){
	global.donations[wallet] = devFee;
}
