import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transcript, customPrompt } = req.body;

    if (!transcript || !customPrompt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const completion = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are an expert meeting summarizer. Create clear, well-structured, and actionable summaries based on user instructions. Format your response with appropriate headings and bullet points when helpful.'
        },
        {
          role: 'user',
          content: `Please summarize the following meeting transcript according to these specific instructions: "${customPrompt}"\n\nMeeting Transcript:\n${transcript}`
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const summary = completion.choices[0].message.content;

    res.status(200).json({ summary });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate summary' 
    });
  }
}