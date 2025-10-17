# Crypto Conversion API

Basit bir kripto para dönüştürme API’si. CoinGecko API’si üzerinden güncel fiyatları alır ve belirtilen miktarı dönüştürür.

## Özellikler

- BTC, ETH, USDT, BNB, SOL, DOGE, ADA, XRP, DOT, MATIC, AVAX gibi popüler kripto paralar için dönüşüm
- API key ile güvenlik
- Rate limiting (1 dakika içinde maksimum 60 istek)
- Önbellekleme ile hızlı yanıt (CACHE_TTL: 60 saniye, ayarlanabilir)

## Kurulum

1. Repo’yu klonla:
```bash
git clone <repo-link>
cd crypto-conversion-api
```

2. Bağımlılıkları yükle:
```bash
npm install
```

3. `.env` dosyası oluştur ve API key’i ekle:
```
API_KEY=123456
CACHE_TTL=60000
PORT=3000
```

## Çalıştırma

Geliştirme modunda:
```bash
npm run dev
```

Testleri çalıştırmak için:
```bash
npm test
```

## API Kullanımı

### Endpoint
```
GET /convert
```

### Query Parametreleri
- `from` : Dönüştürülecek kripto (örn. BTC)  
- `to` : Hedef kripto (örn. USDT)  
- `amount` : Miktar (örn. 1)  
- `api_key` : API anahtarı

### Örnek İstek
```
GET http://localhost:3000/convert?from=BTC&to=USDT&amount=1&API_KEY=A3gt!h56th
```

### Örnek Yanıt
```json
{
  "from": "BTC",
  "to": "USDT",
  "amount": "1",
  "rate": 106982.01798201799,
  "result": 106982.01798201799
}
```

### Hata Kodları
- `400` : Eksik parametre veya desteklenmeyen coin
- `401` : Geçersiz API key
- `429` : Too many requests (rate limit)

## Testler

- Jest ve Supertest kullanılarak hazırlanmıştır
- Çalıştırmak için:
```bash
npm test
```

## Önbellek ve Rate Limiting

- CACHE_TTL (`.env` üzerinden) ile önbellek süresi ayarlanabilir
- Rate limiting: 1 dakika içinde maksimum 60 istek

## Geliştirilebilir Alanlar

- Farklı para birimleri (USD, EUR vs.) eklenebilir
- Daha fazla coin eklenebilir
- Kullanıcı başına rate limiting yapılabilir
- Swagger/OpenAPI dokümantasyonu eklenebilir