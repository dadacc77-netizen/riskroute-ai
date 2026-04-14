export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { decision, reason } = req.body;

  const prompt = `
你是一個風險導航助手。

系統判斷：${decision}
原因：${reason}

請用一句自然語言說明給使用者，語氣自然、簡短、有判斷感。
`;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDSnGlSJTrBzFlrvZW00oxxf31-ZoPAWxI",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "目前無法取得分析結果";

  return res.status(200).json({ text });
}
