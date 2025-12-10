
import React, { useState } from 'react';
import type { Ebook, Chapter } from '../types';
import { ChevronDownIcon, ClipboardIcon } from './icons';

const ChapterItem: React.FC<{ chapter: Chapter; index: number }> = ({ chapter, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(chapter.conteudo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-4 bg-gray-800 hover:bg-gray-700/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold text-left">
          <span className="text-indigo-400">Capítulo {index + 1}:</span> {chapter.titulo}
        </h3>
        <ChevronDownIcon
          className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="p-5 bg-gray-900/50">
          <div className="relative">
            <button
              onClick={copyToClipboard}
              className="absolute top-0 right-0 p-2 text-gray-400 hover:text-white bg-gray-700 rounded-md transition-colors"
              title="Copiar conteúdo"
            >
              <ClipboardIcon className="w-5 h-5" />
            </button>
            {copied && <span className="absolute top-1 right-10 text-xs bg-green-500 text-white px-2 py-1 rounded">Copiado!</span>}
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">{chapter.conteudo}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function EbookDisplay({ ebook }: { ebook: Ebook }): React.ReactElement {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-800/50 p-6 rounded-xl border border-gray-700 shadow-2xl">
        <div className="md:col-span-1 flex justify-center items-start">
          <img
            src={ebook.coverImageUrl}
            alt={`Capa do e-book ${ebook.titulo}`}
            className="rounded-lg shadow-lg w-full max-w-xs object-cover aspect-[3/4]"
          />
        </div>
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 leading-tight">
            {ebook.titulo}
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">{ebook.descricao}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-3xl font-bold text-center mb-6">Conteúdo do E-book</h3>
        {ebook.capitulos.map((chapter, index) => (
          <ChapterItem key={index} chapter={chapter} index={index} />
        ))}
      </div>
    </div>
  );
}
