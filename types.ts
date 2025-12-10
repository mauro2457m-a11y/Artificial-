
export interface Chapter {
  titulo: string;
  conteudo: string;
}

export interface EbookContent {
  titulo: string;
  descricao: string;
  capitulos: Chapter[];
}

export interface Ebook extends EbookContent {
  coverImageUrl: string;
}
