import puppeteer, {
  BrowserConnectOptions,
  BrowserLaunchArgumentOptions,
  ElementHandle,
  LaunchOptions,
  Page,
  Browser,
  EvaluateFunc,
  Frame,
  NodeFor,
} from "puppeteer";

import { setTimeout } from "node:timers/promises";
import { Scrapper } from "./protocol";
import { Logger } from "../../infra/logger/logger";

export type launchOptionsParams = LaunchOptions &
  BrowserLaunchArgumentOptions &
  BrowserConnectOptions;

export type ElementHandler = ElementHandle<Element>;

export class PuppeteerAdapter implements Scrapper {
  private pageHandler: Page | null;
  private browserInstance: Browser | null;

  private constructor() {
    this.browserInstance = null;
    this.pageHandler = null;
  }

  static create(): PuppeteerAdapter {
    return new PuppeteerAdapter();
  }

  async launch<launchOptionsParams>(launchOption: launchOptionsParams) {
    Logger.info("Launching browser...");

    // use satisfies here?
    this.browserInstance = await puppeteer.launch(
      launchOption as LaunchOptions
    );

    Logger.info("Success to launch browser :)");
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

    this.pageHandler.on("load", () => Logger.info("Page loaded successfully"));

    this.pageHandler.on("error", (err) =>
      Logger.error(`[ERROR] Error in ${err}`)
    );
  }

  async navigateToUrl(url: string, timeout = 20000) {
    Logger.info(`Navigating to URL ::: ${url}`);

    await this.pageHandler?.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: timeout,
    });

    const pageTitle = await this.pageHandler?.title();

    Logger.info(`Page ${pageTitle} loaded successfully :)`);
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
    Logger.info("Closing browser...");
    await this.browserInstance?.close();
    Logger.info("Bye 😉");
  }

  async closePage(): Promise<void> {
    Logger.info("Closing page...");
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
    ...args: any[]
  ): Promise<any> {
    const element = elementHandler ? elementHandler : this.pageHandler;
    return await element?.$eval(selector, command, ...args);
  }

  async elementsEvaluate(
    selector: string,
    command: (element: Element[], ...args: unknown[]) => any,
    elementHandler?: any,
    ...args: any[]
  ): Promise<any> {
    const element = elementHandler ? elementHandler : this.pageHandler;
    return await element?.$$eval(selector, command, ...args);
  }

  async querySelectorAll<Selector extends string>(
    selector: Selector
  ): Promise<Array<ElementHandle<NodeFor<Selector>>> | null> {
    const data = await this.pageHandler?.$$(selector);
    return data || null;
  }

  async pageEvaluateWithSelector<T>(
    pageFunction: (element: Element, ...args: unknown[]) => T | Promise<T>,
    selector: string
  ): Promise<any | null> {
    const data = await this.pageHandler?.$eval(selector, pageFunction);
    if (data) {
      return data;
    }
    return null;
  }

  async pageEvaluate(pageFunction: any, ...args: any[]): Promise<any | null> {
    const data = await this.pageHandler?.evaluate(pageFunction, ...args);
    if (data) {
      return data;
    }
    return null;
  }

  async pageElementEvaluate<T extends EvaluateFunc<any>>(
    pageFunction: T,
    elementHandler: any,
    ...args: any[]
  ): Promise<any> {
    const data = await elementHandler?.evaluate(pageFunction, ...args);
    if (data) {
      return data;
    }
    return null;
  }

  async selectInputValue(selector: string, value: string): Promise<void> {
    Logger.info(`Search by element ${selector}`);
    const input = await this.getElementHandler(selector);
    if (input) {
      await input.select(value);
      Logger.info(`Element ${selector} selected`);
      return;
    }
    Logger.warn(`Element ${selector} not found`);
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
  ): Promise<Frame | null> {
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
