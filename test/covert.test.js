import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';

const API_KEY = '123456';

describe('Convert API Tests', () => {

    it('should return 200 and correct conversion result', async () => {
        const res = await request(app)
            .get('/convert')
            .query({ from: 'BTC', to: 'USDT', amount: 1, api_key: API_KEY });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('from', 'BTC');
        expect(res.body).toHaveProperty('to', 'USDT');
        expect(res.body).toHaveProperty('amount', '1');
        expect(res.body).toHaveProperty('rate');
        expect(res.body).toHaveProperty('result');
        expect(typeof res.body.result).toBe('number');
    });

    it('should return 400 for missing parameters', async () => {
        const res = await request(app)
            .get('/convert')
            .query({ from: 'BTC', api_key: API_KEY });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should return 401 for invalid API key', async () => {
        const res = await request(app)
            .get('/convert')
            .query({ from: 'BTC', to: 'USDT', amount: 1, api_key: 'wrongkey' });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for unsupported coin', async () => {
        const res = await request(app)
            .get('/convert')
            .query({ from: 'ABC', to: 'USDT', amount: 1, api_key: API_KEY });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

});
