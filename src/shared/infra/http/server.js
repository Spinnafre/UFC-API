const { port } = require("../../../config/server.js")
const { app} = require("./app.js")


app.listen(port,(err)=>{
    if(err){
        console.log('Error in server runtine ',err.message)
    }
    console.log(`Server listening in port ${port}`)
})
