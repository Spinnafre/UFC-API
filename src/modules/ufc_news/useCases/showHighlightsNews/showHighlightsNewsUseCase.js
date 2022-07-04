const puppeteer = require('puppeteer');


class ShowHighlightsNewsUseCase {
    async execute() {
        try {
            const browser = await puppeteer.launch({args:['--no-sandbox']});
            const page = await browser.newPage();
            await page.goto('https://www.ufc.br');
            page.once('load', () => console.log('Page inicial da UFC carregada com sucesso!'));
            page.setDefaultNavigationTimeout(30000);
            await page.waitForSelector("#conteudo")
    
            const content = await page.$("#conteudo > div.ten.columns")
            // #conteudo > div.ten.columns > div:nth-child(1)
            //Notícias
            const highlightsNews= await content.$eval("div:nth-child(1)",(el)=>{
                const highlightNews= el.querySelector("div.destaques.clearfix")
                const result=[]
                const items= highlightNews.querySelectorAll(".item")
                items.forEach(item=>{
                    let thumbnailUrl=item.querySelector(".thumb").href
                    let link= item.querySelector(".link").href
                    result.push({
                        link,
                        thumbnailUrl
                    })
                })
                return result
            })
            if(!highlightsNews){
                console.log('Sem destaques')
            }
            // Últimas notícias
            const latestNews=await content.$eval("div:nth-child(1)",(el)=>{
                const lastNews= el.querySelector("div.ultimas")
                const items= lastNews.querySelectorAll(".item")
                const result=[]
                items.forEach(item=>{
                    //subtitulo
                    const subtitleItem=item.querySelector(".subtitulo").firstElementChild
                    const title={
                        url:subtitleItem.href,
                        description:subtitleItem.textContent
                    }
                    //descricao
                    const description=item.querySelector(".descricao").textContent
                    //img
                    const img=item.querySelector(".img").src
    
                    result.push({
                        img,
                        title,
                        description
                    })
                })
                return result
            })
            // #conteudo > div.ten.columns > div:nth-child(2)
            //Concursos e seleções
            const contestAndSelections=await content.$eval("#conteudo > div.ten.columns > div:nth-child(2)",(el)=>{
                const result=[]
                const links= el.querySelector(".links")
                const items=links.querySelectorAll(".item")
    
                items.forEach(item=>{
                    const link=item.firstElementChild
                    const description=link.textContent
                    const url=link.href
    
                    result.push({
                        url,
                        description
                    })
                })
    
                return result
            })
    
            const news={
                highlight:highlightsNews,
                latestNews:latestNews,
                extra:contestAndSelections
            }
    
            await browser.close();
            return news
        } catch (error) {
            console.log(error.message)
            if (error instanceof puppeteer.errors.TimeoutError) {
                return new Error('Falha ao buscar notícia do site da UFC ',error.message)
            }
        }
    }
}

module.exports = {
    ShowHighlightsNewsUseCase
}

