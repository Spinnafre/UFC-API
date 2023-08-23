export namespace ShowMenuByDay {
  export type Request = {
    day: string;
  };

  export type Response =
    | {
        type: string;
        meat: Array<{
          title: string | null;
          options: string | null;
        }>;
      }
    | [];
}
