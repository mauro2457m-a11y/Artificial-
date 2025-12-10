
import React, { useState } from 'react';
import { SparklesIcon, KeyIcon } from './icons';

interface ThemeInputProps {
  theme: string;
  setTheme: (theme: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function ThemeInput({ theme, setTheme, apiKey, setApiKey, onSubmit, isLoading }: ThemeInputProps): React.ReactElement {
  const [showKey, setShowKey] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 space-y-6">
      
      {/* Seção da API Key */}
      <div className="space-y-2">
        <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-400">
          Chave de API do Google Gemini
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            id="api-key-input"
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Cole sua chave aqui (Ex: AIzaSy...)"
            className="block w-full pl-10 pr-12 bg-gray-900 border border-gray-600 rounded-md py-2 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition duration-200 placeholder-gray-600"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showKey ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        <p className="text-xs text-gray-600">
          Sua chave será salva no navegador para uso futuro.
        </p>
      </div>

      <hr className="border-gray-700" />

      {/* Seção do Tema */}
      <div className="space-y-2">
        <label htmlFor="theme-input" className="block text-lg font-medium text-gray-300">
          Qual o tema do seu próximo e-book de sucesso?
        </label>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            id="theme-input"
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: 'Investimentos para iniciantes em 2024'"
            className="flex-grow bg-gray-900 border border-gray-600 rounded-md py-3 px-4 text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            onClick={onSubmit}
            disabled={isLoading || !theme.trim() || !apiKey.trim()}
            className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 whitespace-nowrap"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            {isLoading ? 'Gerando...' : 'Criar E-book'}
          </button>
        </div>
      </div>
    </div>
  );
}
