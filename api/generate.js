import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mood, personality } = req.body;

  if (!mood) {
    return res.status(400).json({ error: '기분을 입력해주세요.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
사용자의 현재 기분: "${mood}"
사용자의 성격/취향: "${personality || '특별히 언급 없음'}"

위 정보를 바탕으로 어울리는 음식 메뉴 2~3가지를 추천해주고, 그 이유를 친근하고 위트 있게 설명해줘.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
    });

    return res.status(200).json({ result: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: '메뉴 추천을 가져오는 중 오류가 발생했습니다.' });
  }
}
