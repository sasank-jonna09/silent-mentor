import { GoogleGenerativeAI } from '@google/generative-ai';
import * as vscode from 'vscode';

export class MentorAI {
    public static async generateSummary(sessionData: any): Promise<string> {
        try {
            // 1. Grab the API key (using the format from your extension.ts)
            const config = vscode.workspace.getConfiguration('silentMentor');
            const apiKey = config.get<string>('apiKey');

            if (!apiKey || apiKey.trim() === "") {
                throw new Error("API Key is missing or empty.");
            }

            // 2. Initialize Gemini (Using the Free Tier)
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            // 3. Convert the summary into a string so it is NEVER undefined
            const dataString = typeof sessionData === 'string' ? sessionData : JSON.stringify(sessionData);

            // 4. Build the Elite Mentor Prompt
            const prompt = `You are an elite, highly observant Senior Software Engineer mentoring a developer named Sasi. 
            Analyze this coding session data:
            
            ${dataString}
            
            Based on this specific data, write a short, punchy 3-sentence end-of-day review. 
            Do not be generic. If errors are high, give advice on debugging. If file switches are high, advise on focus. Be professional but warm.`;

            // 5. Send it to Google
            console.log("Sending data to Gemini:", dataString);
            const result = await model.generateContent(prompt);
            return result.response.text();

        } catch (error: any) {
            console.error("🚨 GEMINI API ERROR DETAILS:", error);
            return `AI call failed. Look at the Debug Console for details!`;
        }
    }
}