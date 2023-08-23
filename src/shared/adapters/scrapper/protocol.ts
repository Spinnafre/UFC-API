export interface Scrapper {
  launch<R>(launchOption: R): Promise<void>;
  openNewTab(bypass?: boolean): Promise<void>;
  closeBrowser(): Promise<void>;
  closePage(): Promise<void>;
  getElementHandler(selector: string): Promise<any | null>;
  // pageEvaluate(params: any, command: (params: any) => any): Promise<any>;
  elementEvaluate(
    selector: string,
    command: (params: any) => any
  ): Promise<void>;
  navigateToUrl(url: string, timeout: number): Promise<void>;
  getJSONResponseFromRequest<R>(url: string, method: string): Promise<R>;
  selectInputValue(selector: string, value: string): Promise<void>;
  // waitForElement(selector: string, timeout?: number): Promise<void>;
  waitForNavigation(options?: any): Promise<void>;
  setPageWindowViewPort(width: number, height: number): Promise<void>;
}
