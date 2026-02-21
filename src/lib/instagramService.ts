interface InstagramMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: any;
  instagramId?: string;
}

class InstagramService {
  private accessToken: string;
  private verifyToken: string;

  constructor() {
    // These should be stored in environment variables
    this.accessToken = process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN || '';
    this.verifyToken = process.env.REACT_APP_INSTAGRAM_VERIFY_TOKEN || '';
  }

  // Send message to Instagram DM
  async sendToInstagram(userMessage: string, instagramUserId: string): Promise<void> {
    if (!this.accessToken) {
      console.warn('Instagram not configured');
      return;
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/me/messages?access_token=${this.accessToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipient: {
              id: instagramUserId,
              user_ref: instagramUserId
            },
            message: {
              text: `📩 New message from your portfolio chat:\n\n"${userMessage}"\n\nReply to this message to respond directly to the visitor!`
            },
            messaging_type: "RESPONSE"
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message to Instagram');
      }
    } catch (error) {
      console.error('Error sending to Instagram:', error);
    }
  }

  // Handle incoming webhook from Instagram
  async handleWebhook(body: any): Promise<any> {
    if (body.object === 'instagram') {
      for (const entry of body.entry) {
        if (entry.messaging) {
          const webhookEvent = entry.messaging[0];
          const senderId = webhookEvent.sender.id;
          
          if (webhookEvent.message) {
            const messageText = webhookEvent.message.text;
            
            // Store the reply for the chat interface
            this.storeInstagramReply(senderId, messageText);
          }
        } else if (entry.standby) {
          // Handle standby messages (for Instagram)
          const webhookEvent = entry.standby[0];
          const senderId = webhookEvent.sender.id;
          
          if (webhookEvent.message) {
            const messageText = webhookEvent.message.text;
            this.storeInstagramReply(senderId, messageText);
          }
        }
      }
      return 'EVENT_RECEIVED';
    }
  }

  // Store Instagram reply
  private storeInstagramReply(senderId: string, message: string): void {
    const instagramReply = {
      id: Date.now().toString(),
      text: message,
      sender: "bot" as const,
      timestamp: new Date(),
      instagramId: senderId,
    };

    // Emit event for real-time updates
    this.emitInstagramReply(instagramReply);
  }

  // Emit Instagram reply to chat interface
  private emitInstagramReply(reply: InstagramMessage): void {
    // Store in localStorage for simple solution
    localStorage.setItem('instagramReply', JSON.stringify(reply));
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('instagramReply', { detail: reply }));
  }

  // Get Instagram user info
  async getUserInfo(instagramUserId: string): Promise<any> {
    if (!this.accessToken) return null;

    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${instagramUserId}?fields=username,account_type&access_token=${this.accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error getting Instagram user info:', error);
      return null;
    }
  }

  // Get Instagram Business Account ID
  async getInstagramBusinessAccount(): Promise<string | null> {
    if (!this.accessToken) return null;

    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/me?fields=instagram_business_account&access_token=${this.accessToken}`
      );
      const data = await response.json();
      return data.instagram_business_account?.id || null;
    } catch (error) {
      console.error('Error getting Instagram business account:', error);
      return null;
    }
  }
}

export default InstagramService;
