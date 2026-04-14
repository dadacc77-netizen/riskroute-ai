import http from "http";

const server = http.createServer(async (req, res) => {

  if (req.method === "POST" && req.url === "/ai") {

    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {

      const { decision, reason } = JSON.parse(body);

      const prompt = `
你是一個風險導航助手。

系統判斷：${decision}
原因：${reason}

請用一句自然語言說明給使用者。
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );

      const data = await response.json();

      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "AI暫時無回應";

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });

      res.end(JSON.stringify({ text }));
    });

  } else {
    res.writeHead(404);
    res.end();
  }

});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
