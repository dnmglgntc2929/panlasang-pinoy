  import axios from "axios";

import env from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";





const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envFile = resolve(__dirname, "env", ".env");

env.config({ path: envFile });

export const gpt4 = async (message) => {
    const options = {
      method: 'POST',
      url: 'https://chatgpt-42.p.rapidapi.com/conversationgpt4-2',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      data: {
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        system_prompt: '',
        temperature: 0.9,
        top_k: 5,
        top_p: 0.9,
        max_tokens: 256,
        web_access: false,
      },
    };
  
    try {
      const response = await axios.request(options);
      return response.data.result; // Return only the result property
    } catch (error) {
      console.error('Error fetching from GPT-4 API:', error);
      return 'Sorry, something went wrong.';
    }
  };

export default gpt4;