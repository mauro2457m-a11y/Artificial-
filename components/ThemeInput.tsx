
import React from 'react';
import { SparklesIcon } from './icons';

interface ThemeInputProps {
  theme: string;
  setTheme: (theme: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export default function ThemeInput({ theme, setTheme, onSubmit, isLoading }: ThemeInputProps): React.ReactElement {
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <label htmlFor="theme-input" className="block text-lg font-medium text-gray-300 mb-2">
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
          disabled={isLoading || !theme.trim()}
          className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Gerando...' : 'Criar E-book'}
        </button>
      </div>
       <p className="text-sm text-gray-500 mt-3">
        Dica: Seja específico para obter melhores resultados.
      </p>
    </div>
  );
}
