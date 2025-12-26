import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { headline, summary, category } = await req.json();

        if (!headline) {
            return NextResponse.json(
                { error: 'Headline is required' },
                { status: 400 }
            );
        }

        const FACT_CHECK_PROMPT = `You are a professional fact-checker and media analyst. Analyze the following news article and provide a comprehensive fact-check.

Article Headline: "${headline}"
Article Summary: "${summary || 'No summary provided'}"
Category: ${category || 'General'}

Provide your analysis in the following JSON format:
{
  "overallVerdict": "verified" | "partially-verified" | "unverified" | "questionable",
  "trustScore": <number 0-100>,
  "analysis": "<2-3 sentence overall assessment>",
  "keyClaims": [
    {
      "claim": "<specific claim from the article>",
      "status": "verified" | "unverified" | "questionable",
      "explanation": "<brief explanation>"
    }
  ],
  "credibleSources": [
    {
      "name": "<source name>",
      "url": "<actual URL to the source - must be real, working URL>",
      "type": "Official" | "News Agency" | "Research" | "Government",
      "relevance": "<why this source is relevant>"
    }
  ],
  "redFlags": ["<any red flags or concerns>"],
  "recommendations": "<what readers should do to verify this>"
}

Guidelines:
- Be objective and balanced
- Identify specific claims that can be verified
- Suggest credible sources (official websites, established news agencies, government sources)
- **IMPORTANT: Provide real, working URLs for each source (e.g., https://www.dawn.com, https://www.bbc.com/news, https://www.pmd.gov.pk)**
- For government sources, use official .gov.pk domains
- For news agencies, use their official websites
- Note any red flags (sensational language, lack of sources, etc.)
- Provide actionable recommendations for readers
- If you cannot verify, say so honestly

Return ONLY valid JSON, no additional text.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional fact-checker. Always respond with valid JSON only.'
                },
                {
                    role: 'user',
                    content: FACT_CHECK_PROMPT
                }
            ],
            temperature: 0.3,
            max_tokens: 1000,
        });

        const responseText = completion.choices[0]?.message?.content || '{}';

        // Parse the JSON response
        let factCheckResult;
        try {
            factCheckResult = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse AI response:', responseText);
            throw new Error('Invalid response format from AI');
        }

        return NextResponse.json({
            success: true,
            result: factCheckResult
        });

    } catch (error: any) {
        console.error('Fact-check API error:', error);

        return NextResponse.json(
            {
                error: 'Failed to perform fact-check',
                message: error.message || 'An unexpected error occurred'
            },
            { status: 500 }
        );
    }
}
