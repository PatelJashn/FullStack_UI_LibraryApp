import dotenv from 'dotenv';

dotenv.config();

// Test Hugging Face API for code generation
const testHuggingFace = async () => {
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  
  if (!HF_API_KEY) {
    console.log('❌ HUGGINGFACE_API_KEY not found in environment variables');
    return;
  }

  const sampleHTML = `<button class="btn">Click me</button>`;
  const sampleCSS = `.btn { background: blue; color: white; padding: 10px; }`;
  const userPrompt = "Make the button rounded with a blue gradient";

  const prompt = `You are a web developer assistant. I have an HTML and CSS component, and I want you to modify it based on my request.

Original HTML:
${sampleHTML}

Original CSS:
${sampleCSS}

User Request: ${userPrompt}

Please provide the modified HTML and CSS code. Return ONLY the code in this exact format:
HTML:
[modified HTML code here]

CSS:
[modified CSS code here]

Do not include any explanations, just the code.`;

  try {
    console.log('🔗 Testing Hugging Face API...');
    
    // Using a code generation model like CodeLlama or similar
    const response = await fetch(
      "https://api-inference.huggingface.co/models/codellama/CodeLlama-7b-Instruct-hf",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.3,
            do_sample: true
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Hugging Face API Error:', error);
      return;
    }

    const result = await response.json();
    console.log('✅ Hugging Face Response:', result);
    
  } catch (error) {
    console.error('❌ Error testing Hugging Face:', error);
  }
};

testHuggingFace();
