import axios from "axios";

const SUPPORTED_PAIRS = [
    { from: "ETH", to: "BTC" },
    { from: "ETH", to: "USDT" },
    { from: "BTC", to: "USDT" },
];

const API_KEY = "123456";
const BASE_URL = "http://localhost:3000/convert";

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    for (const pair of SUPPORTED_PAIRS) {
        console.log(`\n🔹 Rate-limit testi: ${pair.from} → ${pair.to}`);
        for (let i = 1; i <= 70; i++) {
            try {
                const res = await axios.get(BASE_URL, {
                    params: {
                        from: pair.from,
                        to: pair.to,
                        amount: 1,
                        api_key: API_KEY,
                    },
                    validateStatus: () => true
                });

                if (res.status === 200) {
                    console.log(`#${i} 200 OK — result: ${res.data.result}`);
                } else if (res.status === 429) {
                    console.log(`#${i} 429 — Too Many Requests, bekleniyor...`);
                    await wait(500);
                    i--;
                } else {
                    console.log(`#${i} ${res.status} — ${JSON.stringify(res.data)}`);
                }
            } catch (err) {
                console.log(`#${i} ERROR — ${err.message}`);
            }

            await wait(50);
        }
    }

    console.log("\n🔥 Test tamamlandı!");
})();
