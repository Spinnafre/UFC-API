const puppeteer = require('puppeteer');


class ShowNewsUseCase {
    async execute(limit) {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('https://www.ufc.br/noticias');

            //evaluateHandle => Melhor forma e mais segura de recuperar elementos da DOM
            await page.evaluateHandle(() => {
                const elements = document.getElementById("limit")
                elements.value = limit
                elements.dispatchEvent(new Event("change"))
                return elements;
            });
            await page.waitForSelector("#limit")

            const listras = await page.$(".listras")
            if(!listras){
                throw new Error("Não foi possível carregar notícias")
            }

            const links = await listras.$$eval('tr', async (rows) => {
                function removeBlanksLines(text) {
                    const allLines = text.split("\n");
                    const withoutBlankLinesandMarks = allLines.map((line) => {
                        return line.trim()
                    });
                
                    return withoutBlankLinesandMarks.join(" ")
                }
                const result = []
                for (const row of rows) {
                    result.push({
                        text:  removeBlanksLines(row.textContent),
                        link: row.firstElementChild.firstElementChild.href
                    })
                }
                return result
            })
            await browser.close();
            return links
        } catch (error) {
            return new Error('Falha ao buscar notícia do site da UFC ',error.message)
        }
    }
}

module.exports = {
    ShowNewsUseCase
}

