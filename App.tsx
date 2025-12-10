
import React, { useState, useCallback } from 'react';
import type { Ebook, EbookContent } from './types';
import Header from './components/Header';
import ThemeInput from './components/ThemeInput';
import EbookDisplay from './components/EbookDisplay';
import LoadingSpinner from './components/LoadingSpinner';

export default function App(): React.ReactElement {
  const [theme, setTheme] = useState<string>('');
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateEbook = useCallback(async () => {
    if (!theme.trim()) {
      setError('Por favor, insira um tema para o e-book.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEbook(null);

    try {
      const { GoogleGenAI, Type } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // 1. Gerar conteúdo do E-book
      setLoadingMessage('Criando o conteúdo do e-book... Isso pode levar um momento.');
      
      const ebookContentSchema = {
        type: Type.OBJECT,
        properties: {
          titulo_chamativo: { type: Type.STRING, description: "Um título de e-book extremamente atraente e voltado para vendas." },
          descricao_venda: { type: Type.STRING, description: "Uma descrição de venda persuasiva para a página do produto, destacando os benefícios." },
          capitulos: {
            type: Type.ARRAY,
            description: "Uma lista de exatamente 10 capítulos para o e-book.",
            items: {
              type: Type.OBJECT,
              properties: {
                titulo: { type: Type.STRING, description: "O título do capítulo." },
                conteudo: { type: Type.STRING, description: "O conteúdo completo e detalhado para este capítulo." },
              },
              required: ["titulo", "conteudo"],
            },
          },
        },
        required: ["titulo_chamativo", "descricao_venda", "capitulos"],
      };

      const contentPrompt = `Aja como um especialista em marketing digital e criação de infoprodutos. Crie um e-book completo e pronto para venda sobre o tema "${theme}". O e-book deve ter exatamente 10 capítulos. O conteúdo deve ser prático, acionável e de alto valor. Gere a resposta estritamente no formato JSON solicitado.`;
      
      const contentResult = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contentPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: ebookContentSchema,
          temperature: 0.8,
        },
      });

      if (!contentResult.text) {
        throw new Error("A API de conteúdo não retornou texto.");
      }
      const parsedJson = JSON.parse(contentResult.text);
      const content: EbookContent = {
        titulo: parsedJson.titulo_chamativo,
        descricao: parsedJson.descricao_venda,
        capitulos: parsedJson.capitulos,
      };

      // 2. Gerar a capa do E-book
      setLoadingMessage('Gerando uma capa incrível para seu e-book...');

      const coverPrompt = `Crie uma capa de e-book profissional e atraente. O título do e-book é "${content.titulo}". O tema é "${theme}". A capa deve ser minimalista, moderna e visualmente impactante. Use uma paleta de cores que transmita confiança e profissionalismo. Inclua elementos gráficos abstratos relacionados ao tema. O título deve ser o foco principal, com uma tipografia elegante e legível. Não inclua nenhum outro texto além do título.`;

      const imageResult = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: coverPrompt }] },
        config: { imageConfig: { aspectRatio: "3:4" } },
      });

      const candidate = imageResult.candidates?.[0];
      if (!candidate) throw new Error("Nenhuma resposta válida foi retornada pela API de imagem.");

      let coverImageUrl: string | null = null;
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          coverImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
      if (!coverImageUrl) throw new Error("Nenhuma imagem foi gerada pela API.");

      // 3. Combinar e definir o estado
      setEbook({ ...content, coverImageUrl });

    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
      setError(`Falha ao gerar o e-book. Pode haver um problema com a configuração da API. Detalhes: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-8">
          <ThemeInput
            theme={theme}
            setTheme={setTheme}
            onSubmit={handleGenerateEbook}
            isLoading={isLoading}
          />

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
              <strong className="font-bold">Erro: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading && <LoadingSpinner message={loadingMessage} />}

          {ebook && !isLoading && <EbookDisplay ebook={ebook} />}

          {!isLoading && !ebook && (
             <div className="text-center text-gray-500 pt-16">
                <h2 className="text-2xl font-semibold mb-2">Pronto para criar seu best-seller?</h2>
                <p>Insira um tema acima e deixe a IA fazer a mágica acontecer.</p>
             </div>
          )}
        </div>
      </main>
      <footer className="text-center p-4 text-gray-600 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
}
