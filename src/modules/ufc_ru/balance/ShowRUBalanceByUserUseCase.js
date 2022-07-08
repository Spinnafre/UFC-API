const { browserOptions, timeoutToRequest } = require('../../../config/puppeteer');

class ShowRUBalanceByUserUseCase {
    constructor(puppeteer){
        this.scrapper=puppeteer
    }
    async execute(input_card_number,input_registry_number) {
        console.log(input_card_number,input_registry_number)
        try {
            const browser = await this.scrapper.launch(browserOptions);
            const page = await browser.newPage();
            await page.goto('https://si3.ufc.br/public/iniciarConsultaSaldo.do',{
                timeout:timeoutToRequest
            });
    
            /** 
             payload: 
                codigoCartao: 2887746615
                matriculaAtreladaCartao: 470605
            */
    
            /*
                - [X] Buscar input do cartão (#corpo > form > table > tbody > tr:nth-child(1) > td > input[type=text])
                - [X] Buscar input da matrícula atralada ao cartão (#corpo > form > table > tbody > tr:nth-child(2) > td > input[type=text])
                - [X] Buscar botão de consultar (#corpo > form > table > tfoot > tr > td > input[type=submit])
                - [X] Realizar o submit dos dados
            */    
    
            await page.evaluate((card_number)=>{
                let input = document.querySelector('input[name="codigoCartao"]')
                input.value=card_number
                return input
            },Number(input_card_number))
    
            await page.evaluate((registry_number)=>{
                let input = document.querySelector('input[name="matriculaAtreladaCartao"]')
                input.value=registry_number
                return input
            },Number(input_registry_number))
    
            await Promise.all([
                page.click("#corpo > form > table > tfoot > tr > td > input[type=submit]"),
                page.waitForNavigation({waitUntil: 'networkidle2'})
            ])
            
            const user_info_page=await page.$("#corpo > table:nth-child(6)")
            if(!user_info_page){
                throw new Error("Não foi possível buscar usuário")
            }

            const content=await page.waitForSelector("#corpo > table:nth-child(6) > tbody")
            const userInfo=await content.evaluate((node)=>{
                try {
                    let result={
                        user_name:"",
                        user_credits:""
                    }
                    let rowEven=node.querySelector(".linhaPar")
                    result.user_name=rowEven.lastElementChild.textContent
                    
                    let rowOdd=node.querySelector(".linhaImpar")
                    result.user_credits=rowOdd.lastElementChild.textContent
                    
                    return result
                } catch (error) {
                    return {}
                }
            })
    
            const last_transactions=await page.$eval("#corpo > table:nth-child(8) > tbody",(tbody)=>{
                try {
                    let result=[]
                function removeBlanksLines(text) {
                    const allLines = text.split("\n");
                    const withoutBlankLinesandMarks = allLines.map((line) => {
                        return line.trim()
                    });
                
                    return withoutBlankLinesandMarks.join(" ")
                }
                let rows=Array.from(tbody.getElementsByTagName("tr"))
    
                for(let row of rows){
                    if(row.hasChildNodes()){
                        let operation_date= row.children[0].textContent
                        let operation_type= removeBlanksLines(row.children[1].textContent)
                        let operation_details= removeBlanksLines(row.children[2].textContent)
                        result.push({
                            date:operation_date,
                            type:operation_type,
                            details:operation_details
                        })
    
    
                    }
    
                }
                
                return result
                } catch (error) {
                    return {}
                }
            })
    
    
    
            await browser.close();
            return{
                user_info:userInfo,
                transactions:last_transactions
            }
        } catch (error) {
            await browser.close();
            return new Error('Falha ao buscar notícia do site da UFC ',error.message)
        }
    }
}

module.exports = {
    ShowRUBalanceByUserUseCase
}

