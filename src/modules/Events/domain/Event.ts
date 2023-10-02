export type EventEntity = {
  pageUrl: string | null;
  imageUrl: string | null;
  date: string | null;
  title: string | null;
  cost: string | null;
  address: {
    locality: string | null;
    street: string | null;
    mapUrl: string | null;
    name?: string | null;
    country?: string | null;
    postalCode?: string | null;
    pageUrl?: string | null;
    venueName?: string | null;
  };
  schedule: {
    start: string | null;
    end: string | null;
    time: string | null;
  } | null;
};
