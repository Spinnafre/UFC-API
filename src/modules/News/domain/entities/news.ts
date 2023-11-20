export interface NewsEntity {
  title: string;
  url: string;
  date: string | null;
  publishLink?: string;
  publishedFrom?: string;
  content?: string;
}
