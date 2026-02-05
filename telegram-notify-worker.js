/**
 * Telegram Visitor Notification Worker
 * Sends detailed visitor info to Telegram when someone visits your portfolio
 * 
 * Deploy: wrangler deploy telegram-notify-worker.js --name telegram-notify
 * 
 * Set secrets:
 * wrangler secret put TELEGRAM_BOT_TOKEN
 * wrangler secret put TELEGRAM_CHAT_ID
 */

export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }

        // Only allow POST requests
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
                status: 405,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        try {
            const data = await request.json();
            const cfData = request.cf || {};

            // Build detailed message
            const timestamp = new Date().toLocaleString('en-US', {
                timeZone: 'Asia/Tashkent',
                dateStyle: 'medium',
                timeStyle: 'short',
            });

            // Get location info from Cloudflare
            const city = cfData.city || 'Unknown';
            const country = cfData.country || 'Unknown';
            const region = cfData.region || '';
            const timezone = cfData.timezone || 'Unknown';

            // Build the message
            let message = `🚀 *New Visitor on boboxon.uz!*\n\n`;
            message += `📍 *Location:* ${city}${region ? ', ' + region : ''}, ${country}\n`;
            message += `🌐 *Page:* ${data.page || 'Home'}\n`;
            message += `📱 *Device:* ${data.device || 'Unknown'}\n`;
            message += `🖥️ *Browser:* ${data.browser || 'Unknown'}\n`;
            message += `📐 *Screen:* ${data.screen || 'Unknown'}\n`;
            message += `🔗 *Referrer:* ${data.referrer || 'Direct'}\n`;
            message += `🕐 *Time:* ${timestamp} (UZT)\n`;

            // Optional: Add language preference
            if (data.language) {
                message += `🌍 *Language:* ${data.language}\n`;
            }

            // Send to Telegram
            const telegramUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;

            const telegramResponse = await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: env.TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown',
                }),
            });

            if (!telegramResponse.ok) {
                throw new Error('Telegram API error');
            }

            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Failed to send notification' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }
    },
};
