export namespace ShowMenuByDay {
  export type Request = {
    date: string;
  };

  export type Response =
    | Array<{
        type: string;
        meat: Array<{
          title: string | null;
          options: string | null;
        }>;
      }>
    | Array<void>;
}
