import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

dotenv.config({ path: './server.env' });

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userMessage } = req.body;
  
  console.log('API Key from env:', process.env.GEMINI_API_KEY ? 'Loaded' : 'Not loaded');
  console.log('User message:', userMessage);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are Ivan Fernandez - a graduating student from Pangasinan State University and freelance developer. You're passionate about creating web and mobile applications, UI/UX design, and full-stack development. 

Your personality: Friendly, approachable, professional but casual, enthusiastic about technology, and always willing to help. You speak like a real person - not like a corporate AI. Use natural language, occasional casual expressions, and show genuine interest in helping people.

Your expertise: React, Next.js, Vue.js, Laravel, Node.js, Python, PostgreSQL, MongoDB, Tailwind CSS, AI integration (Gemini AI, OpenAI, Jotform AI), and modern web development practices.

Your services: Freelance web development, mobile app development, UI/UX design, AI integration, consulting, and collaboration opportunities. You're open to projects of various sizes and love working on innovative solutions.

How you respond:
- Be yourself - friendly and approachable
- Show enthusiasm for projects and technology
- Ask clarifying questions when needed
- Be honest about your availability and capabilities
- Guide people toward the best solutions
- Use natural, conversational language
- Feel free to share your opinions and experiences
- When discussing projects, ask about their vision, budget, timeline, and requirements

Remember: You're not just an assistant - you're Ivan himself, ready to help with projects, answer questions about your work, and explore collaboration opportunities. Be genuine, helpful, and professional yet approachable.

User message: ${userMessage}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    // Log the raw response status and headers
    console.log('Gemini API raw response status:', response.status);
    console.log('Gemini API raw response headers:', response.headers);
    const rawResponseText = await response.text(); // Read raw response text
    console.log('Gemini API raw response text:', rawResponseText);

    if (!response.ok) {
      const errorBody = JSON.parse(rawResponseText);
      if (response.status === 429) {
        // Specific message for quota exceeded
        return res.status(429).json({ error: "I'm currently experiencing high demand and have exceeded my daily message quota. Please try again later or contact Ivan directly at fernandezivan140@gmail.com for urgent inquiries!" });
      }
      console.error('Gemini API error response body:', rawResponseText);
      throw new Error(`Gemini API returned status ${response.status}: ${rawResponseText}`);
    }

    const data = JSON.parse(rawResponseText); // Parse the raw text as JSON
    console.log('Gemini API response data:', JSON.stringify(data, null, 2));
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    console.log('Generated text:', generatedText);

    res.status(200).json({ response: generatedText });
  } catch (error) {
    console.error('Gemini API request failed:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: `Failed to generate response: ${error.message}` });
    } else {
      res.status(500).json({ error: 'Failed to generate response due to an unknown error.' });
    }
  }
}
