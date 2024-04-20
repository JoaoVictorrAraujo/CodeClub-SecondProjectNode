const express = require('express')
const uuid = require('uuid')
const app = express()
const port = 3000

app.use(express.json())

const requests=[]

const typeMethods = (request,response,next)=>{
    const methods= request.methods
    const url = request.url
    console.log(methods,url)

    next()
}
const checkId = (request,response,next) =>{
    const id = request.params.id
    const index = requests.findIndex( idRequests => idRequests.id=== id)
    if(index<0){
        return response.status(404).json({message:"User not found"})
    }
    request.orderId = id
    request.orderIndex=index

    next()
}

app.post('/order', typeMethods ,(request,response)=>{
    const order = request.body.order
    const clienteName = request.body.clienteName
    const price = request.body.price
    const status = request.body.status

    const orders ={id:uuid.v4(),order,clienteName,price,status}
    requests.push(orders)

    return response.status(201).json({orders})
})

app.get('/order', typeMethods,(request, response)=>{
    return response.json({requests})
})

app.get('/order/:id',typeMethods,checkId, (request,response)=>{
    const getValues = requests[request.orderIndex]
    return response.json({getValues})
})

app.put('/order/:id',typeMethods,checkId, (request, response)=>{
    const order = request.body.order
    const clienteName = request.body.clienteName
    const price = request.body.price
    const status = request.body.status

    const updateOrder = {id: request.orderId,order,clienteName,price,status}
    requests[request.orderIndex]=updateOrder

    return response.json(updateOrder)
})

app.delete('/order/:id' ,typeMethods,checkId, (request, response) =>{
    requests.splice(request.orderIndex,1)
    return response.status(204).json()
})
app.patch('/order/:id' ,typeMethods,checkId, (request,response) =>{
    requests[request.orderIndex].status="Pronto"
    const getValues = requests[request.orderIndex]
    return response.json({getValues})
})

app.listen(port,() => {
    console.log(`✔ Server started on port: ${port}`)
})