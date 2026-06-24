import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { AnalysisResult, DicomMetadata } from "../types";

// Initialize AI once (better performance)
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_API_KEY || ""
});

// Model API configuration
const MODEL_API_URL = import.meta.env.VITE_MODEL_API || "http://localhost:5000";

// ------------------- MODEL PREDICTION -------------------
export const predictWithModel = async (base64Image: string): Promise<{
  predictions: Array<{ label: string; confidence: number }>;
  top_prediction: { label: string; confidence: number };
  is_diseased: boolean;
  all_scores: Record<string, number>;
}> => {
  try {
    const response = await fetch(`${MODEL_API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });

    if (!response.ok) {
      throw new Error(`Model API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Model prediction error:", error);
    throw new Error("Failed to analyze with local model");
  }
};

// ------------------- ANALYZE XRAY (HYBRID: Model + Gemini) -------------------
export const analyzeXray = async (
  base64Image: string,
  _metadata?: DicomMetadata,
  patientData?: Record<string, unknown>
): Promise<AnalysisResult> => {

  try {
    // Step 1: Get predictions from local model
    let modelPredictions = null;
    try {
      modelPredictions = await predictWithModel(base64Image);
      console.log("Model predictions:", modelPredictions);
    } catch (modelError) {
      console.warn("Local model prediction failed, falling back to Gemini:", modelError);
      // Fall back to Gemini-only analysis if model is unavailable
    }

    // Step 2: Use Gemini for detailed analysis and severity assessment
    const prompt = `
    ${modelPredictions ? `
    The following diseases were detected by our diagnostic model with these confidence scores:
    ${modelPredictions.predictions.map(p => `- ${p.label}: ${(p.confidence * 100).toFixed(1)}%`).join('\n')}
    
    Top prediction: ${modelPredictions.top_prediction.label} (${(modelPredictions.top_prediction.confidence * 100).toFixed(1)}% confidence)
    Disease present: ${modelPredictions.is_diseased ? 'YES' : 'NO'}
    ` : 'Analyze this chest X-ray for disease detection:'}
    
    Please provide:
    1. SEVERITY ASSESSMENT: Classify as MILD, MODERATE, or SEVERE (based on the disease detected and patient data)
    2. CLINICAL REASONING: Explain the findings, risk factors, and recommendations
    3. CONFIDENCE LEVEL: Rate your confidence in these findings
    ${patientData ? `4. PATIENT CONTEXT: Consider this patient data in your assessment: ${JSON.stringify(patientData)}` : ''}

    Return STRICT JSON format with keys: severity, reasoning, confidence (0-1), recommendations (array).
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1] || base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["severity", "reasoning", "confidence"]
        }
      }
    });

    let geminiAnalysis;
    try {
      geminiAnalysis = JSON.parse(response.text || "{}");
    } catch {
      console.error("Invalid JSON from Gemini:", response.text);
      geminiAnalysis = {
        severity: "MODERATE",
        reasoning: "Analysis in progress",
        confidence: 0.5
      };
    }

    // Step 3: Combine model predictions with Gemini analysis
    const finalResult: AnalysisResult = {
      predictions: modelPredictions?.predictions || [],
      severity: geminiAnalysis.severity as any,
      reasoning: geminiAnalysis.reasoning || "Analysis complete",
      riskProbability: geminiAnalysis.confidence || 0.5,
      detectedLobe: undefined
    };

    return finalResult;

  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Failed to analyze X-ray");
  }

};

// ------------------- CHAT ASSISTANT -------------------
export const chatAssistant = async (
  question: string,
  context: AnalysisResult,
  imageBase64: string
): Promise<string> => {

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64.split(",")[1] || imageBase64
            }
          },
          {
            text: `
              CONTEXT: ${JSON.stringify(context)}
              USER QUESTION: ${question}
              
              Answer like a medical assistant with clear explanation.
            `
          }
        ]
      }
    });

    return response.text || "Assistant unavailable.";

  } catch (error) {
    console.error("Chat Assistant Error:", error);
    return "Error fetching response.";
  }
};