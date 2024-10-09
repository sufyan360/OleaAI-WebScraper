// src/services/gptService.js
const axios = require('axios');
require('dotenv').config(); 

const checkStatementWithGPT = async (statement, verifiedData) => {
  try {
    const systemPrompt = `
        You are an AI system designed to verify statements against trusted sources like the CDC, WHO, and scholarly databases. Your task is to assess the accuracy of the given statement and provide structured feedback in JSON format.
        You will mostly deal with statements regarding Mpox which may show up in various forms such as #mpox.
        Mpox can also be known as Monkeypox. Do not forget to refer to the sources before making an analysis and providing an answer. 
        The JSON structure should look like this:
        {
          "isMisinformation": true,  // Set to true if misinformation is detected; false if the information is correct.
          "reasoning": "Provide a detailed explanation of why the statement is flagged as misinformation, including references to the verified data.",
          "verifiedInfo": "Summarize the correct information from trusted sources."
        }

        Regardless of the assessment, always respond using the above structure.
        Do not include any additional statement, explanation, or comments outside of the JSON object. 

        For example, for the statement "Mpox can be spread through casual contact.", your response should be:
          {
            "isMisinformation": true,
            "reasoning": "Mpox primarily spreads through direct contact with bodily fluids, lesions, or respiratory droplets, not casual contact.",
            "verifiedInfo": "According to the CDC, Mpox transmission occurs mainly through close, sustained contact with an infected person."
          }
        For example, for the statement "Mpox transmission occurs through direct contact with an infected person.", your response should be:
          {
            "isMisinformation": false,
            "reasoning": "The statement accurately reflects how Mpox is transmitted.",
            "verifiedInfo": "According to the CDC, Mpox transmission occurs through direct contact with an infected person."
          }

        For other statements, perform a general comparison and indicate if any inaccuracies exist. Structure your response clearly, focusing on factual analysis.
    `; 

    const userPrompt = `
    Now, verify the following statement:
    "${statement}"
    Verified Data: ${verifiedData}
  `;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'gpt-3.5-turbo', 
      stream: true
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPEN_ROUTER_KEY}`,
      },
      responseType: 'text'
    });
    return processResponse(response.data);
  } catch (error) {
    console.error('Error calling GPT API:', error);
    throw error;
  }
};

// Process the raw response data
const processResponse = (data) => {
  const lines = data.split('\n');
  let completeResponse = '';

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const jsonData = line.replace('data: ', '').trim();
      if (jsonData === '[DONE]') continue; // Ignore end signal

      try {
        const json = JSON.parse(jsonData);
        if (json.choices && json.choices[0].delta) {
          const deltaContent = json.choices[0].delta.content;
          if (deltaContent) {
            completeResponse += deltaContent; // Collect the complete response
          }
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  }

  return completeResponse; // Return the complete response
};


module.exports = { checkStatementWithGPT };
