// Simple webhook handler for Instagram DMs
// This is for testing purposes - for production, use a proper backend

const webhookHandler = (req, res) => {
  // Handle webhook verification
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('Webhook verification attempt:', { mode, token });

    if (mode && token) {
      if (mode === 'subscribe' && token === 'aybantyler25') {
        console.log('WEBHOOK_VERIFIED');
        return res.status(200).send(challenge);
      } else {
        console.log('Webhook verification failed');
        return res.status(403).send('Forbidden');
      }
    }
  }

  // Handle webhook events
  if (req.method === 'POST') {
    const body = req.body;
    console.log('Received webhook:', JSON.stringify(body, null, 2));

    if (body.object === 'instagram') {
      for (const entry of body.entry) {
        if (entry.messaging) {
          const webhookEvent = entry.messaging[0];
          const senderId = webhookEvent.sender.id;
          
          if (webhookEvent.message) {
            const messageText = webhookEvent.message.text;
            console.log(`Received Instagram DM from ${senderId}: ${messageText}`);
            
            // For testing, just log the message
            // In production, you'd forward this to your chat interface
          }
        } else if (entry.standby) {
          // Handle standby messages
          const webhookEvent = entry.standby[0];
          const senderId = webhookEvent.sender.id;
          
          if (webhookEvent.message) {
            const messageText = webhookEvent.message.text;
            console.log(`Received standby message from ${senderId}: ${messageText}`);
          }
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    } else {
      console.log('Unknown webhook object:', body.object);
      return res.status(404).send('Not found');
    }
  }

  return res.status(405).send('Method not allowed');
};

// For Node.js server
if (typeof module !== 'undefined' && module.exports) {
  module.exports = webhookHandler;
}

// For testing in browser console
if (typeof window !== 'undefined') {
  window.webhookHandler = webhookHandler;
}
