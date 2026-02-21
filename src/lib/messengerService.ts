interface MessengerMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: any;
  messengerId?: string;
}

class MessengerService {
  private pageAccessToken: string;
  private verifyToken: string;

  constructor() {
    // These should be stored in environment variables
    this.pageAccessToken = process.env.REACT_APP_FACEBOOK_PAGE_ACCESS_TOKEN || '';
    this.verifyToken = process.env.REACT_APP_FACEBOOK_VERIFY_TOKEN || '';
  }

  // Send message to Facebook Messenger
  async sendToMessenger(userMessage: string, senderPsid: string): Promise<void> {
    if (!this.pageAccessToken) {
      console.warn('Facebook Messenger not configured');
      return;
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/me/messages?access_token=${this.pageAccessToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipient: { id: senderPsid },
            message: {
              text: `📩 New message from your portfolio chat:\n\n"${userMessage}"\n\nReply to this message to respond directly to the visitor!`
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message to Messenger');
      }
    } catch (error) {
      console.error('Error sending to Messenger:', error);
    }
  }

  // Handle incoming webhook from Facebook
  async handleWebhook(body: any): Promise<any> {
    if (body.object === 'page') {
      for (const entry of body.entry) {
        const webhookEvent = entry.messaging[0];
        const senderPsid = webhookEvent.sender.id;
        
        if (webhookEvent.message) {
          const messageText = webhookEvent.message.text;
          
          // This would be handled by your backend
          // For now, we'll store it locally
          this.storeMessengerReply(senderPsid, messageText);
        }
      }
      return 'EVENT_RECEIVED';
    }
  }

  // Store messenger reply (this would typically go to your backend)
  private storeMessengerReply(senderPsid: string, message: string): void {
    // Store the reply for the chat interface
    const messengerReply = {
      id: Date.now().toString(),
      text: message,
      sender: "bot" as const,
      timestamp: new Date(),
      messengerId: senderPsid,
    };

    // Emit event or update state to show in chat
    this.emitMessengerReply(messengerReply);
  }

  // Emit messenger reply to chat interface
  private emitMessengerReply(reply: MessengerMessage): void {
    // This would typically use a websocket or event emitter
    // For now, we'll use localStorage as a simple solution
    localStorage.setItem('messengerReply', JSON.stringify(reply));
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('messengerReply', { detail: reply }));
  }

  // Get Facebook user info (optional, for personalization)
  async getUserInfo(senderPsid: string): Promise<any> {
    if (!this.pageAccessToken) return null;

    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${senderPsid}?fields=first_name,last_name,profile_pic&access_token=${this.pageAccessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }
}

export default MessengerService;
