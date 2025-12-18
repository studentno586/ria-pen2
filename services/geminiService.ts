import { GoogleGenAI, Type } from "@google/genai";
import { GenerationRequest } from "../types";
import { PERSONA_PROMPTS } from "../constants";

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateReactionPaper = async (request: GenerationRequest): Promise<string[]> => {
  // Always use process.env.API_KEY directly as per guidelines.
  const ai = new GoogleGenAI({ apiKey: "AIzaSyCmwYocNydllpnQ3Uu940uPoJL7EFEZH2k" })

  
  // Use the model ID provided in the request
  const { file, sourceText, notes, settings, modelId } = request;
  
  const personaInstruction = settings.customCharacterDescription || PERSONA_PROMPTS[settings.character];

  const systemPrompt = `
    あなたは「大学の授業の感想文（リアクションペーパー）作成アシスタント」です。
    提供された【資料】をもとに、指定された【条件】に従ってリアクションペーパーを【3パターン】作成してください。

    ■ 指定条件
    - 文字数: ${settings.length} (※各パターンこの文字数を厳守)
    - キャラクター設定: ${personaInstruction}
    - 口調: ${settings.tone}

    ■ 執筆ガイドライン（最優先事項）
    1. 【疑問・問いの必須化】講義内容を単に肯定・要約するのではなく、**必ず1つ以上の「疑問点」「違和感」「新たな問い」を含めてください。**
       - 良い例: 「先生は〇〇とおっしゃいましたが、現代の〜という状況には当てはまらないのではないかと疑問に思いました。」
       - 良い例: 「〇〇という理論は理解できましたが、もし〜という前提が崩れた場合どうなるのか気になりました。」
    2. 【事務連絡の除外】試験日程などの事務連絡は一切含めないでください。
    3. 【括弧禁止】「」や（）などの括弧記号は使用しないでください。
    4. 【脱・定型文】「大変勉強になりました」などの定型的な締めくくりは禁止です。
    5. 【3つのバリエーション】
       - パターン1: スタンダード（講義の核心的なトピックに対する感想と疑問）
       - パターン2: 別のトピック（パターン1とは違う箇所に着目した感想と疑問）
       - パターン3: 独自の視点（個人の経験や他の知識と結びつけた感想と疑問）

    ■ 出力形式
    JSON配列（Array<string>）形式で3つの感想文を出力してください。
  `;

  const parts: any[] = [];

  // Add text prompts
  let userMessage = "以下の資料をもとに、異なる視点の感想文を3つ書いてください。";
  
  if (sourceText) {
    userMessage += `\n\n【資料テキスト】\n${sourceText}`;
  }

  if (notes) {
    userMessage += `\n\n【追加メモ・キーワード】\n${notes}`;
  }
  
  parts.push({ text: userMessage });

  // Add file content if exists
  if (file) {
    try {
      const filePart = await fileToGenerativePart(file);
      parts.push(filePart);
    } catch (error) {
      console.error("Error processing file:", error);
      throw new Error("ファイルの読み込みに失敗しました。");
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8, // Increase creativity for variety
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    if (response.text) {
       const parsed = JSON.parse(response.text);
       if (Array.isArray(parsed)) {
         return parsed.map(s => s.trim());
       }
    }
    return ["生成に失敗しました。もう一度お試しください。"];
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error && error.message.includes("404")) {
       throw new Error("選択されたモデルが見つかりません。APIキーの設定やモデルの可用性を確認してください。");
    }
    throw new Error("AIによる生成中にエラーが発生しました。しばらく待ってから再試行してください。");
  }
};

export const refineReactionPaper = async (
  originalText: string, 
  instruction: string, 
  modelId: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemPrompt = `
    あなたは「文章修正アシスタント」です。
    ユーザーから提供された「元の文章」を、指定された「修正指示」に従って書き直してください。
    
    ■ 制約事項
    - 修正指示に忠実に従ってください（例: 長くする、短くする、トーンを変える、特定の内容を追加する）。
    - 元の文章の文脈や重要なポイントは維持しつつ、自然な日本語で出力してください。
    - 出力は修正後の文章のみを返してください。解説や前置きは不要です。
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        {
          role: 'user',
          parts: [
            { text: `【元の文章】\n${originalText}` },
            { text: `【修正指示】\n${instruction}` }
          ]
        }
      ],
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "修正に失敗しました。";
  } catch (error) {
    console.error("Refine Error:", error);
    throw new Error("修正中にエラーが発生しました。");
  }
};
