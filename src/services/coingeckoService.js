import axios from 'axios';
import Bottleneck from 'bottleneck';
import { COIN_MAP, SUPPORTED_COINS } from '../config/coins.js';

const cache = new Map();
const CACHE_TTL = parseInt(process.env.CACHE_TTL) || 60000;

const limiter = new Bottleneck({
    minTime: 120,       // Her isteğin en az 120ms aralıkla gönderilmesi
    maxConcurrent: 5    // Aynı anda maksimum 5 istek
});

async function fetchCoinPrice(symbol) {
    const coinId = COIN_MAP[symbol.toUpperCase()];
    if (!coinId) return null;

    const cached = cache.get(symbol);
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_TTL) return cached.price;

    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: { ids: coinId, vs_currencies: 'usd' },
            timeout: 5000
        });

        const price = response.data[coinId]?.usd || null;
        if (price !== null) cache.set(symbol, { price, timestamp: now });
        return price;

    } catch (error) {
        if (error.response?.status === 429) {
            console.warn(`Rate limit geldi: ${symbol}. 1 saniye sonra tekrar denenecek...`);
            await new Promise(r => setTimeout(r, 1000));
            return fetchCoinPrice(symbol);
        } else if (error.response?.status === 404) {
            console.warn(`Coin bulunamadı: ${symbol}`);
            return null;
        } else {
            console.error(`CoinGecko API hatası: ${error.message}`);
            return null;
        }
    }
}

// Rate limit ile sarılmış dışa aktarılan fonksiyon
export const getCoinPrice = (symbol) => limiter.schedule(() => fetchCoinPrice(symbol));

// Tüm desteklenen coinlerin fiyatlarını getiren fonksiyon
export async function getAllSupportedCoinPrices() {
    const prices = {};
    await Promise.all(
        SUPPORTED_COINS.map(async symbol => {
            prices[symbol] = await getCoinPrice(symbol);
        })
    );
    return prices;
}
