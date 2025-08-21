# OpenAI Integration Setup Guide

## Overview
This project now includes AI-powered question generation using OpenAI's GPT-4 model. Users can automatically generate relevant behavioral assessment questions based on their test description.

## Features
- **AI Question Generation**: Automatically generates 10-50 behavioral questions
- **Smart Categorization**: AI assigns relevant tags/categories to questions
- **Scoring System**: Automatically generates 4 answer options with appropriate scoring
- **Context-Aware**: Questions are tailored to the specific test name and behaviors

## Setup Instructions

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the API key (keep it secure!)

### 2. Configure Environment Variables
Create a `.env.local` file in your project root:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_actual_api_key_here

# Optional: Model configuration
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
```

**Important**: Never commit your `.env.local` file to version control!

### 3. Install Dependencies
```bash
npm install
```

### 4. Restart Development Server
```bash
npm run dev
```

## How It Works

### User Flow
1. User creates test name and describes behaviors
2. User clicks "Generate Questions with AI" button
3. User selects number of questions (10-50)
4. AI generates relevant questions with:
   - Appropriate categories/tags
   - 4 answer options per question
   - Scoring system (10, 7, 4, 1)
   - Behavioral descriptions

### AI Prompt Structure
The AI receives a structured prompt including:
- Test name and purpose
- Specific behaviors to assess
- Required question format
- Scoring guidelines

### Generated Question Format
```json
{
  "tag": "Leadership",
  "question": "How do you handle team conflicts?",
  "options": [
    {
      "text": "Address immediately and facilitate discussion",
      "score": 10,
      "description": "Proactive conflict resolution"
    },
    {
      "text": "Wait for team to resolve themselves",
      "score": 7,
      "description": "Team autonomy approach"
    }
  ]
}
```

## API Endpoints

### POST /api/generate-questions
**Request Body:**
```json
{
  "testName": "Leadership Assessment",
  "behaviors": "Team collaboration, conflict resolution, decision making",
  "questionCount": 15
}
```

**Response:**
```json
{
  "success": true,
  "questions": [...],
  "count": 15
}
```

## Cost Considerations

### OpenAI Pricing (as of 2024)
- **GPT-4**: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- **Typical Cost**: ~$0.10-0.30 per question generation request
- **Cost Control**: Implement rate limiting and user quotas if needed

### Optimization Tips
1. Use specific, concise behavior descriptions
2. Limit question count to reasonable numbers (10-30)
3. Consider caching generated questions for similar tests

## Security Considerations

### API Key Protection
- ✅ Store API key in environment variables
- ✅ Never expose API key in client-side code
- ✅ Use server-side API routes for all OpenAI calls
- ❌ Don't commit API keys to version control

### Rate Limiting
Consider implementing rate limiting to prevent abuse:
- Per-user limits
- Per-IP limits
- Daily/monthly quotas

## Troubleshooting

### Common Issues

**"OpenAI API key not configured"**
- Check `.env.local` file exists
- Verify API key is correct
- Restart development server

**"Failed to generate questions"**
- Check OpenAI API status
- Verify API key has sufficient credits
- Check network connectivity

**"No valid JSON found in response"**
- AI response format issue
- Check OpenAI API response
- Verify prompt structure

### Debug Mode
Enable debug logging by checking browser console for detailed error messages.

## Future Enhancements

### Potential Features
1. **Question Templates**: Pre-built question sets for common roles
2. **Custom Scoring**: User-defined scoring systems
3. **Question Editing**: AI-assisted question refinement
4. **Bulk Generation**: Generate multiple test variations
5. **Quality Scoring**: AI evaluation of question quality

### Integration Options
1. **Multiple AI Models**: Support for different OpenAI models
2. **Alternative Providers**: Claude, Gemini, etc.
3. **Local Models**: On-premise AI models for privacy

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Verify OpenAI API key and credits
4. Check network connectivity
5. Review environment variable configuration
