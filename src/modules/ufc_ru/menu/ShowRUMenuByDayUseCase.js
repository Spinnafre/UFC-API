const { browserOptions, timeoutToRequest } = require('../../../config/puppeteer');
const {AppError} =require("../../../shared/errors/AppErrors")

class ShowRUMenuByDayUseCase {
    constructor(puppeteer){
        this.scrapper=puppeteer
    }
    async execute(day) {
        
        const browser = await this.scrapper.launch(browserOptions);
        try {
            const page = await browser.newPage();
            await page.goto(`https://www.ufc.br/restaurante/cardapio/1-restaurante-universitario-de-fortaleza/${day}`,{
                timeout:timeoutToRequest
            });

            const typesOfMeat=await page.evaluate(()=>{
                const types= document.querySelector(".c-cardapios")
                const tagTitles=Array.from(types.getElementsByTagName("h3"))
    
                const titlesIDs=tagTitles.map(title=>{
                    return title.getAttribute("id")
                })
                
                return titlesIDs
            })
    
            const result=[]
            if(typesOfMeat.length){
                for(let type of typesOfMeat){
                    //.refeicao.desjejum > .listras
                    const selector=`.refeicao.${type} > .listras`
                    const meat=await page.$eval(selector,(table)=>{
                        function removeBlanksLines(text) {
                            const allLines = text.split("\n");
                            return allLines.join(", ")
                        }

                        let result=[]
    
                        let rows=Array.from(table.getElementsByTagName("tr"))
    
                        for(let row of rows){
                            let title=row.firstElementChild.textContent.trim()
                            let options=removeBlanksLines(row.lastElementChild.innerText.trim())
                            result.push({
                                title,
                                options
                            })
                        }
                        return result
                    })
                    result.push({
                        type,
                        meat
                    })
                }
     
                await browser.close()
                return result
            }else{
                //Não tem refeição no DIA
                console.log('SEM REFEIÇÃO NO DIA MAN!')
                await browser.close()
                return []
            }
            
        } catch (error) {
            await browser.close();
            if (error instanceof this.scrapper.errors.TimeoutError) {
              throw new AppError({
                message:
                    "[TIMEOUT] - Falha ao buscar cardápio do ru pois o tempo limite de requisição foi alcançado " +
                    error,
                statusCode: 504,
            });
            }
            throw new AppError({message:`Falha ao realizar busca do cardápio do ru. Error -> ${error.message}`});
          }
    }
}

module.exports = {
    ShowRUMenuByDayUseCase
}

