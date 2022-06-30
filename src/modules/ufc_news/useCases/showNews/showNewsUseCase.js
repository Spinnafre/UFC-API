const puppeteer = require('puppeteer');


class ShowNewsUseCase {
    async execute(pageNumber=10) {
        try {
            const browser = await puppeteer.launch({args:['--no-sandbox']});
            const page = await browser.newPage();
            await page.goto(`https://www.ufc.br/noticias?start=${pageNumber}`);
            page.once('load', () => console.log('Página de notícias carregada'));

            //evaluateHandle => Melhor forma e mais segura de recuperar elementos da DOM
            await page.waitForSelector("#limit")

            const listras = await page.$(".listras")
            if(!listras){
                throw "Não foi possível carregar notícias"
            }

            const links = await listras.$$eval('tr', async (rows) => {

                const result = []
                for (const row of rows) {
                    const newsAnchor=row.querySelector(".list-title").querySelector("a")
                    const link=newsAnchor.href
                    const text=newsAnchor.textContent.trim()

                    const date=row.querySelector(".list-date").textContent.trim()

                    result.push({
                        text,
                        link,
                        date
                    })
                }
                return result
            })
            await browser.close();
            return links
        } catch (error) {
            if (error instanceof puppeteer.errors.TimeoutError) {
                throw new Error("[TIMEOUT] - ",error)
            }
            throw new Error(error)
        }
    }
}

module.exports = {
    ShowNewsUseCase
}

