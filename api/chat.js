
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "सवाल लिखिए"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          instructions: "आप Manju AI हैं। हिंदी में सरल, उपयोगी और स्पष्ट जवाब दें।",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "AI सर्वर में समस्या है"
      });
    }

    return res.status(200).json({
      reply: data.output_text || "माफ कीजिए, जवाब नहीं मिला।"
    });

  } catch (error) {
    return res.status(500).json({
      error: "सर्वर में समस्या है"
    });
  }
};
