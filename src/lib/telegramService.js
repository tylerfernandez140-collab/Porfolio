class TelegramService {
    botToken;
    chatId;
    constructor() {
        // Use import.meta.env for Vite (client-side) and process.env for Node.js (server-side)
        this.botToken = import.meta.env?.VITE_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '';
        this.chatId = import.meta.env?.VITE_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID || '';
    }
    // Send message to Telegram
    async sendToTelegram(userMessage) {
        console.log('Telegram Service - Bot Token:', this.botToken ? 'Set' : 'Not set');
        console.log('Telegram Service - Chat ID:', this.chatId ? 'Set' : 'Not set');
        console.log('Telegram Service - Message:', userMessage);
        if (!this.botToken || !this.chatId) {
            console.warn('Telegram not configured - missing token or chat ID');
            return;
        }
        try {
            const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text: `📩 New message from your portfolio chat:\n\n"${userMessage}"\n\nReply to this message to respond directly to the visitor!`,
                    parse_mode: "HTML"
                }),
            });
            if (!response.ok) {
                console.error('Telegram API Error:', response.status, response.statusText);
                const errorData = await response.text();
                console.error('Error details:', errorData);
                throw new Error('Failed to send message to Telegram');
            }
            const data = await response.json();
            console.log('Message sent to Telegram successfully:', data);
        }
        catch (error) {
            console.error('Error sending to Telegram:', error);
        }
    }
    // Set up webhook to receive messages from Telegram
    async setWebhook(webhookUrl) {
        if (!this.botToken) {
            console.warn('Telegram bot token not configured');
            return;
        }
        try {
            const response = await fetch(`https://api.telegram.org/bot${this.botToken}/setWebhook`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: webhookUrl,
                    allowed_updates: ["message", "callback_query"]
                }),
            });
            const data = await response.json();
            console.log('Webhook set:', data);
        }
        catch (error) {
            console.error('Error setting webhook:', error);
        }
    }
    // Handle incoming webhook from Telegram
    async handleWebhook(body) {
        if (body.message) {
            const message = body.message;
            const senderId = message.from.id;
            const messageText = message.text;
            console.log(`Received Telegram message from ${senderId}: ${messageText}`);
            // The serverless function will now handle storing the reply in Firebase.
            // This client-side handleWebhook is primarily for local testing or
            // if you were to implement a different client-side processing logic.
            return 'ok';
        }
        return 'ok';
    }
    // Get bot info
    async getBotInfo() {
        if (!this.botToken)
            return null;
        try {
            const response = await fetch(`https://api.telegram.org/bot${this.botToken}/getMe`);
            return await response.json();
        }
        catch (error) {
            console.error('Error getting bot info:', error);
            return null;
        }
    }
}
export default TelegramService;
