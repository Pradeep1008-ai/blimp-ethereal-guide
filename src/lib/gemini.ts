// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// IMPORTANT: Paste your Gemini API key here
const API_KEY = "AIzaSyCTValAuQ59Yyp_kIS9-718fiwhNdHddEw";

const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});