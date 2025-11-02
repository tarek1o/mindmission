export abstract class SlugifyHelper {
  
  static slugify(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '');;
  }
}