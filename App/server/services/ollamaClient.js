const axios = require('axios');

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

async function generateWithDeepSeek(prompt) {
    const { data } = await axios.post(`${OLLAMA_HOST}/api/generate`, {
        model: 'deepseek-r1',
        prompt,
        stream: false
    });
    return data.response;
}

module.exports = { generateWithDeepSeek };


