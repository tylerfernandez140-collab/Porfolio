import express from 'express';
const app = express();

app.use(express.json());

// Webhook endpoint
app.get('/webhook', (req, res) => {
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
});

app.post('/webhook', (req, res) => {
  console.log('Received webhook:', JSON.stringify(req.body, null, 2));
  
  if (req.body.object === 'instagram') {
    for (const entry of req.body.entry) {
      if (entry.messaging) {
        const webhookEvent = entry.messaging[0];
        const senderId = webhookEvent.sender.id;
        
        if (webhookEvent.message) {
          const messageText = webhookEvent.message.text;
          console.log(`Received Instagram DM from ${senderId}: ${messageText}`);
        }
      }
    }
    return res.status(200).send('EVENT_RECEIVED');
  }
  
  return res.status(404).send('Not found');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
});
