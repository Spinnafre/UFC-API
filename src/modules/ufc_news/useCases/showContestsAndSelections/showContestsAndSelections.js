const puppeteer = require('puppeteer');


class ShowContestsAndSelectionsUseCase {
    async execute(pageNumber=10,title=null) {
        try {
            const browser = await puppeteer.launch({args:['--no-sandbox']});
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(30000);
            console.log(`https://www.ufc.br/noticias/noticias-e-editais-de-concursos-e-selecoes?start=${pageNumber}`)
            await page.goto(`https://www.ufc.br/noticias/noticias-e-editais-de-concursos-e-selecoes?start=${pageNumber}`);
            page.once('load', () => console.log('Página de Concursos e seleções carregada'));

            //Se passar title significa que irá pesquisar apenas por título
            //evaluateHandle => Melhor forma e mais segura de recuperar elementos da DOM
            if(title){
                //#limit -> botão select de quantidade de dados que irá ser exibido
                await page.waitForSelector("#adminForm") //Formulário com filtros de título e exibição

                await page.evaluate((text)=>{
                    //Definir o filtro de exibição para TUDO
                    Array.from(document.querySelector("#limit").options).forEach((val,i)=>{
                        if(val.value === "0"){
                            document.querySelector("#limit").selectedIndex=i
                        }
                    })
                    document.querySelector(".filters > .filter-search > #filter-search").value=text
                    //Chama o evento de submit
                    document.adminForm.submit()
                },title)
                //Espera a página recarregar pois ao fazer o submit irá recarregar a página
                await page.waitForNavigation({timeout:10000,waitUntil:['domcontentloaded']})
            }
            

            const listras = await page.$(".listras")
            if(!listras){
                throw "Não foi possível carregar notícias de Editar de Concursos e Seleções"
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
            await page.close()
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
    ShowContestsAndSelectionsUseCase
}

