const { app} = require("./app.js")

app.listen(8080,(err)=>{
    if(err){
        console.log('Error in server runtine ',err.message)
    }
    console.log(`Server listening in http://localhost:${8080}`)
})
