import puppeteer, {
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  ElementHandle,
  LaunchOptions,
  SerializableOrJSHandle,
  WrapElementHandle,
} from "puppeteer";

import { setTimeout } from "node:timers/promises";
import { Scrapper } from "./protocol";

export type launchOptionsParams = LaunchOptions &
  BrowserLaunchArgumentOptions &
  BrowserConnectOptions;

export type ElementHandler = ElementHandle<Element>;

export class PuppeteerAdapter implements Scrapper {
  private pageHandler: puppeteer.Page | null;
  private browserInstance: puppeteer.Browser | null;

  private constructor() {
    this.browserInstance = null;
    this.pageHandler = null;
  }

  static create(): PuppeteerAdapter {
    return new PuppeteerAdapter();
  }

  async launch<launchOptionsParams>(launchOption: launchOptionsParams) {
    console.log("[LOG] Launching browser...");

    // use satisfies here?
    this.browserInstance = await puppeteer.launch(
      launchOption as LaunchOptions
    );

    console.log("[LOG] Success to launch browser :)");
  }

  async click(selector: string): Promise<void> {
    await this.pageHandler?.click(selector);
  }

  async openNewTab(bypass?: boolean) {
    if (IsNull(this.browserInstance)) {
      throw new Error(
        "Não é possível abrir uma nova página pois não há uma instância do navegador criada."
      );
    }

    this.pageHandler = await this.browserInstance.newPage();

    await this.pageHandler.setBypassCSP(bypass || false);

    await setTimeout(300);

    this.pageHandler.on("load", () =>
      console.log("[LOG] Page loaded successfully")
    );

    this.pageHandler.on("error", (err) =>
      console.log("[ERROR] Error in ", err)
    );
  }

  async navigateToUrl(url: string, timeout = 30000) {
    console.log(`[LOG] Navigating to URL ::: ${url}`);

    await this.pageHandler?.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: timeout,
    });

    const pageTitle = await this.pageHandler?.title();

    console.log(`[LOG] Page ${pageTitle} loaded successfully :)`);
  }

  async getJSONResponseFromRequest(
    url: string,
    method: string
  ): Promise<any | null> {
    //Promise para esperar pela a resposta da requisição AJAX
    //Que não seja a requisição do tipo OPTIONS (preflight)
    const xmr = this.pageHandler?.waitForResponse(
      (r) => r.request().url().includes(url) && r.request().method() != method
    );

    //Esperar pela a resposta das requisiçõe ajax específicas
    const ajaxResponse = await xmr;

    const response = ajaxResponse ? await ajaxResponse.json() : null;

    return response;
  }

  async closeBrowser(): Promise<void> {
    await this.closePage();
    console.log("[LOG] Closing browser...");
    await this.browserInstance?.close();
    console.log("[LOG] Bye 😉");
  }

  async closePage(): Promise<void> {
    console.log("[LOG] Closing page...");
    await this.pageHandler?.close();
  }

  async getElementHandler(
    selector: string,
    elementHandler?: ElementHandler
  ): Promise<ElementHandler | null> {
    const element = elementHandler ? elementHandler : this.pageHandler;
    const handler = await element?.$(selector);
    return (handler as ElementHandler) || null;
  }

  async elementEvaluate(
    selector: string,
    command: (element: Element, ...args: unknown[]) => any,
    elementHandler?: any,
    ...args: SerializableOrJSHandle[]
  ): Promise<any> {
    const element = elementHandler ? elementHandler : this.pageHandler;
    return await element?.$eval(selector, command, ...args);
  }

  async pageEvaluateWithSelector<T>(
    pageFunction: (element: Element, ...args: unknown[]) => T | Promise<T>,
    selector: string
  ): Promise<WrapElementHandle<T> | null> {
    const data = await this.pageHandler?.$eval(selector, pageFunction);
    if (data) {
      return data;
    }
    return null;
  }

  async pageEvaluate<T extends puppeteer.EvaluateFn<any>>(
    pageFunction: any,
    ...args: puppeteer.SerializableOrJSHandle[]
  ): Promise<puppeteer.UnwrapPromiseLike<
    puppeteer.EvaluateFnReturnType<T>
  > | null> {
    const data = await this.pageHandler?.evaluate(pageFunction, ...args);
    if (data) {
      return data;
    }
    return null;
  }

  async pageElementEvaluate<T extends puppeteer.EvaluateFn<any>>(
    pageFunction: T,
    elementHandler: any,
    ...args: puppeteer.SerializableOrJSHandle[]
  ): Promise<puppeteer.UnwrapPromiseLike<
    puppeteer.EvaluateFnReturnType<T>
  > | null> {
    const data = await elementHandler?.evaluate(pageFunction, ...args);
    if (data) {
      return data;
    }
    return null;
  }

  async selectInputValue(selector: string, value: string): Promise<void> {
    console.log(`[LOG] Search by element ${selector}`);
    const input = await this.getElementHandler(selector);
    if (input) {
      await input.select(value);
      console.log(`[LOG] Element ${selector} selected`);
      return;
    }
    console.error(`[ERROR] Element ${selector} not found`);
  }

  async waitForElement(
    selector: string,
    elementHandler?: any,
    timeout?: number
  ): Promise<void> {
    const element = elementHandler || this.pageHandler;
    if (timeout) {
      await element?.waitForSelector(selector, {
        timeout,
      });
      return;
    }
    await element?.waitForSelector(selector);
  }

  async resolveContentFrame(
    elementHandler: ElementHandler
  ): Promise<puppeteer.Frame | null> {
    return await elementHandler?.contentFrame();
  }

  async waitForNavigation(options?: any): Promise<void> {
    await this.pageHandler?.waitForNavigation(options);
  }

  async setPageWindowViewPort(width = 300, height = 300): Promise<void> {
    // Not allow set windows view port when headless is enabled
    // if (headless) {
    //   throw new Error(
    //     "Não é possível definir viewport da página quando estiver em modo headless"
    //   );
    // }
    await this.pageHandler?.setViewport({ width, height });
  }
}

function IsNull(b: any): b is null {
  return b == null;
}
