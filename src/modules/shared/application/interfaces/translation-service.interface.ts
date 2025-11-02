export interface ITranslationService {
  translate(key: string, args?: Record<string, any>, lang?: string): string;
}