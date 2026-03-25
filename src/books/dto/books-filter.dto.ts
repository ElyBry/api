/** Фильтр для списка книг. Все поля опциональны — можно комбинировать. */
export interface BooksFilterDto {
  isbn?: string;
  title?: string;
  author?: string;
  publication_year?: number;
  /** true — только книги с непустым title */
  onlyWithTitle?: boolean;
}
