import { Injectable } from '@angular/core';
import { deburr } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class KeywordService {
  private keywords: { [key: string]: string[] } = {};

  constructor() {}

  addKeywords(route: string, keywords: string[]) {
    this.keywords[route] = keywords;
  }

  getKeywords(route: string): string[] {
    return this.keywords[route] || [];
  }

  searchKeywords(query: string): string[] {
    const normalizedQuery = deburr(query).toLowerCase(); // Elimina acentos y convierte a minúsculas
    const allKeywords = Object.values(this.keywords).flat();
    return allKeywords.filter(keyword =>
      deburr(keyword).toLowerCase().includes(normalizedQuery)
    );
  }

  getRouteByKeyword(keyword: string): string | undefined {
    for (const route in this.keywords) {
      if (this.keywords.hasOwnProperty(route)) {
        if (this.keywords[route].includes(keyword)) {
          return route;
        }
      }
    }
    return undefined;
  }
}
