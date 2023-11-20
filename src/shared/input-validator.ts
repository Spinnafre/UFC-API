export interface validateInput<P, R> {
  validate(request: P): R;
}
