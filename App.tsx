
import React, { useState, useCallback } from 'react';
import type { Ebook } from './types';
import { generateEbookContent, generateEbookCover } from './services/geminiService';
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
      setLoadingMessage('Criando o conteúdo do e-book... Isso pode levar um momento.');
      const content = await generateEbookContent(theme);
      
      setLoadingMessage('Gerando uma capa incrível para seu e-book...');
      const coverImageUrl = await generateEbookCover(content.titulo, theme);

      setEbook({ ...content, coverImageUrl });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
      setError(`Falha ao gerar o e-book. Detalhes: ${errorMessage}`);
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
