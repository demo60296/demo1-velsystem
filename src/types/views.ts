export interface MonthSummaryItem {
  expense: number;
  income: number;
  day: number;
}

export interface MonthSummaryResponse {
  message: string;
  data: MonthSummaryItem[];
}
