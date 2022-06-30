const { app} = require("./app.js")

const PORT = process.env.PORT || 3000;

app.listen(PORT,(err)=>{
    if(err){
        console.log('Error in server runtine ',err.message)
    }
    console.log(`Server listening in port ${PORT}`)
})
