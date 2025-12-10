
import { GoogleGenAI, Type } from "@google/genai";
import type { EbookContent } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ebookContentSchema = {
  type: Type.OBJECT,
  properties: {
    titulo_chamativo: {
      type: Type.STRING,
      description: "Um título de e-book extremamente atraente e voltado para vendas."
    },
    descricao_venda: {
      type: Type.STRING,
      description: "Uma descrição de venda persuasiva para a página do produto, destacando os benefícios e a transformação para o leitor."
    },
    capitulos: {
      type: Type.ARRAY,
      description: "Uma lista de exatamente 10 capítulos para o e-book.",
      items: {
        type: Type.OBJECT,
        properties: {
          titulo: {
            type: Type.STRING,
            description: "O título do capítulo."
          },
          conteudo: {
            type: Type.STRING,
            description: "O conteúdo completo e detalhado para este capítulo."
          },
        },
        required: ["titulo", "conteudo"],
      },
    },
  },
  required: ["titulo_chamativo", "descricao_venda", "capitulos"],
};

export async function generateEbookContent(theme: string): Promise<EbookContent> {
  const prompt = `Aja como um especialista em marketing digital e criação de infoprodutos. Crie um e-book completo e pronto para venda sobre o tema "${theme}". O e-book deve ter exatamente 10 capítulos. O conteúdo deve ser prático, acionável e de alto valor. Gere a resposta estritamente no formato JSON solicitado.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ebookContentSchema,
        temperature: 0.8,
      },
    });

    if (!response.text) {
        throw new Error("A API não retornou conteúdo de texto.");
    }

    const parsedJson = JSON.parse(response.text);

    return {
        titulo: parsedJson.titulo_chamativo,
        descricao: parsedJson.descricao_venda,
        capitulos: parsedJson.capitulos,
    };
  } catch (error) {
    console.error("Erro ao gerar conteúdo do e-book:", error);
    throw new Error("Não foi possível gerar o conteúdo do e-book. Verifique o console para mais detalhes.");
  }
}

export async function generateEbookCover(title: string, theme: string): Promise<string> {
    const prompt = `Crie uma capa de e-book profissional e atraente. O título do e-book é "${title}". O tema é "${theme}". A capa deve ser minimalista, moderna e visualmente impactante. Use uma paleta de cores que transmita confiança e profissionalismo. Inclua elementos gráficos abstratos relacionados ao tema. O título deve ser o foco principal, com uma tipografia elegante e legível. Não inclua nenhum outro texto além do título.`;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4"
          },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
        }
      }
      throw new Error("Nenhuma imagem foi gerada pela API.");

    } catch (error) {
      console.error("Erro ao gerar a capa do e-book:", error);
      throw new Error("Não foi possível gerar a capa do e-book.");
    }
}
