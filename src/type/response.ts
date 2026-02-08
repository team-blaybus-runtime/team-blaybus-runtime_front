export type APIResponse<T, P = any> = {
  success?: boolean;
  data?: T;
  message?: string;
  code?: number | string;
  meta?: P;
};

export type DefaultMeta = {
  pagination?: Pagination;
};

export type Pagination = {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
};

export type PaginationProps = {
  currentPage: number;
  lastPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};
