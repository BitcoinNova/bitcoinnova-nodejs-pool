    /**
		 * Pool statistics
		 **/

		// Get stats from pool API
		function getPoolStats (poolID, poolURL) {
			let apiURL = poolURL + '/stats';
			$.get(apiURL, function (data) {
				if (!data) return;

				let poolHashrate = 'N/A';
				let poolMiners = 'N/A';
				let poolWorkers = 'N/A';
				if (data.pool) {
					poolHashrate = getReadableHashRate(data.pool.hashrate);
					poolMiners = data.pool.miners || 0;
					poolWorkers = data.pool.workers || 0;
				}

				let networkHashrate = 'N/A';
				let networkDiff = 'N/A';
				if (data.network) {
					networkHashrate = getReadableHashRate(data.network.difficulty / data.config.coinDifficultyTarget);
					networkDiff = data.network.difficulty;
				}

				let hashPower = 'N/A';
				if (data.pool && data.network) {
					hashPower = data.pool.hashrate / (data.network.difficulty / data.config.coinDifficultyTarget) * 100;
					hashPower = hashPower.toFixed(2) + '%';
				}

				let blocksFound = data.pool.totalBlocks.toString();

				let cnAlgorithm = data.config.cnAlgorithm || "cryptonight";
				let cnVariant = data.config.cnVariant || 0;

				if (cnAlgorithm == "argon2") {
						if (cnVariant === 1)
								algorithm = 'Argon2id WRKZ';
						else
								algorithm = 'Argon2id Chukwa';
				} else if (cnAlgorithm == "randomx") {
						if (cnVariant === 1)
								algorithm = 'CryptoNight DefyX';
						else if (cnVariant === 2)
								algorithm = 'RandomARQ';
						else if (cnVariant === 17) {
								algorithm = 'RandomWOW';
								xmrstakAlgo = 'randomX_wow';
						} else if (cnVariant === 18) {
								algorithm = 'RandomXL';
								xmrstakAlgo = 'randomX_loki';
						} else {
								algorithm = 'RandomX';
								xmrstakAlgo = 'randomX';
						}
				} else if (cnAlgorithm == "cryptonight_light") {
						if (cnVariant === 1) {
								algorithm = 'CryptoNight Lite v7';
								xmrstakAlgo = 'cryptonight_lite_v7';
						} else {
								algorithm = 'CryptoNight Lite';
								xmrstakAlgo = 'cryptonight_lite';
						}
				} else if (cnAlgorithm == "cryptonight_pico") {
						algorithm = 'CryptoNight Turtle';
						xmrstakAlgo = 'cryptonight_turtle';
				} else if (cnAlgorithm == "cryptonight_heavy") {
						if (cnVariant === 1) {
								algorithm = 'CryptoNight Haven';
								xmrstakAlgo = 'cryptonight_haven';
						} else if (cnVariant === 2) {
								algorithm = 'CryptoNight Saber';
								xmrstakAlgo = 'cryptonight_bittube2';
						} else {
								algorithm = 'CryptoNight Heavy';
								xmrstakAlgo = 'cryptonight_heavy';
						}
				} else {
						if (cnVariant === 1) {
								algorithm = 'CryptoNight v7';
								xmrstakAlgo = 'cryptonight_v7';
						} else if (cnVariant === 4) {
								algorithm = 'CryptoNight Fast';
								xmrstakAlgo = 'cryptonight_masari';
						} else if (cnVariant === 6) {
								algorithm = 'CryptoNight Alloy';
								xmrstakAlgo = 'cryptonight_alloy';
						} else if (cnVariant === 7) {
								algorithm = 'CryptoNight Arto';
								xmrstakAlgo = 'cryptonight_arto';
						} else if (cnVariant === 8) {
								algorithm = 'CryptoNight v8';
								xmrstakAlgo = 'cryptonight_v8';
						} else if (cnVariant === 9) {
								algorithm = 'CryptoNight v8 Half';
								xmrstakAlgo = 'cryptonight_v8_half';
						} else if (cnVariant === 11) {
								algorithm = 'CryptoNight GPU';
								xmrstakAlgo = 'cryptonight_gpu';
						} else if (cnVariant === 13) {
								algorithm = 'CryptoNight R';
								xmrstakAlgo = 'cryptonight_r';
						} else if (cnVariant === 14) {
								algorithm = 'CryptoNight v8 ReverseWaltz';
								xmrstakAlgo = 'cryptonight_v8_reversewaltz';
						} else if (cnVariant === 15) {
								algorithm = 'CryptoNight Zelerius';
								xmrstakAlgo = 'cryptonight_v8_zelerius';
						} else if (cnVariant === 16) {
								algorithm = 'CryptoNight v8 Double';
								xmrstakAlgo = 'cryptonight_v8_double';
						} else {
								algorithm = 'CryptoNight';
								xmrstakAlgo = 'cryptonight';
						}
				}

				updateText(poolID + '_poolHashrate', poolHashrate);
				updateText(poolID + '_poolMiners', poolMiners);
				updateText(poolID + '_networkHashrate', networkHashrate);
				updateText(poolID + '_hashPower', hashPower);
				updateText(poolID + '_blocksFound', blocksFound);
				updateText(poolID + '_algorithm', algorithm);
			});
		}

		// Update pools
		function updatePools () {
			getPoolStats('zentcash', 'https://superblockchain.con-ip.com:8135');
			getPoolStats('cirquity', 'https://api-pool.cirquity.com');
			getPoolStats('bitcoinnova', 'https://superblockchain.con-ip.com:8132');
		}

		// Initialize
		$(function () {
			setInterval(updatePools, (30 * 1000));
			updatePools();
		});

		/**
		 * Strings
		 **/

		// Update Text content
		function updateText (elementId, text) {
			let el = document.getElementById(elementId);
			if (el && el.textContent !== text) {
				el.textContent = text;
			}
			return el;
		}

		// Get readable hashrate
		function getReadableHashRate (hashrate) {
			let i = 0;
			let byteUnits = [' H', ' KH', ' MH', ' GH', ' TH', ' PH'];
			while (hashrate > 1000) {
				hashrate = hashrate / 1000;
				i++;
			}
			return hashrate.toFixed(2) + byteUnits[i] + '/s';
		}