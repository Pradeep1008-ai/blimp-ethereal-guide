import {onCall, HttpsError} from "firebase-functions/v2/https";
import {GoogleGenerativeAI} from "@google/generative-ai";

// Initialize the Gemini client with the secret API key.
// Firebase automatically and securely loads this from the secrets you set.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * A callable function that takes a prompt and gets a response from the Gemini API.
 */
export const callGemini = onCall(async (request) => {
  // Get the prompt text from the data sent by the frontend app
  const {prompt} = request.data;

  // Validate that a prompt was actually sent
  if (!prompt) {
    throw new HttpsError(
      "invalid-argument",
      "The function must be called with a 'prompt' argument."
    );
  }

  try {
    // Get the Gemini model
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
    
    // Generate content based on the prompt
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    // Return the generated text to the frontend
    return {result: response.text()};
  } catch (error) {
    // Log any errors to the Firebase console for debugging
    console.error("Error calling Gemini API:", error);
    throw new HttpsError("internal", "Failed to call the Gemini API.");
  }
});