export type FeedInfoUIProps = {
  feed: {
    total: number;
    totalToday: number;
    [key: string]: unknown;
  };
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
