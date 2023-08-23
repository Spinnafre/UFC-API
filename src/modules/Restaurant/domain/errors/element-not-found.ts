export class ElementNotFoundError extends Error {
  constructor(element: string) {
    super(`Element ${element} not found.`);
    this.name = "ElementNotFoundError";
  }
}
