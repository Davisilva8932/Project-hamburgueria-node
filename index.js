

const express = require("express") // importando o express

const app = express()
const uuid = require("uuid") // gerador de id
app.use(express.json())

app.listen(3000) // escolhendo a porta para rodar

const orders = []

const checkMethodUrl = (request, response, next) => { // Middleware para mostra a requisicao (GET,POST,PUT,DELETE e a URL)
const methodUrl = {
    method: request.method,
    Url: request.Url
}
    console.log(methodUrl);

    next()
}

const checkOrderId = ( request, response, next ) => { //verificação do ID do pedido e valido
const { id } = request.params

const index = orders.findIndex( order => order.id === id )

if( index < 0 ){

    return response.status (404).json({ error:"Order not fund"})
}

    request.orderIndex = index
    request.orderId = id

    next()

}

app.get("/order", checkMethodUrl,( request, response) => { //verificar todos os pedidos

    return response.json (orders)

})

app.get("/order/:id", checkMethodUrl,( request, response ) =>{ // retornar um pedido especifico

   const index = request.orderIndex;
   const orderId = orders [ index ]

    return response.json ( orderId );

})

app.patch ("/order/:id",checkMethodUrl, checkOrderId,( request, response) => { // aiterando o status do padedi

    const index = request.orderIndex
    const { id, clientName, order, price,  } = orders [ index ];

    let status = orders [ index ].status;
    status = "Pedido pronto";

    const finishedOrder = { id, order, clientName, price, status};
    orders [ index ] = finishedOrder;

    return response.json ( finishedOrder ); // respondendo com os dados atualizados

})

app.post("/order", checkMethodUrl,( request, response) => { // adicionando novo pedido

   const { order, clientName, price, status} = request.body
   const clientOrder = { id:uuid.v4(), order, clientName, price,status}

   orders.push ( clientOrder)

    return response.status (201).json ( clientOrder)

})

app.put ("/order/:id", checkMethodUrl,checkOrderId,( request, response)=>{//aiteração de pedido

    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId
    
    const updateOrder = { id, order, clientName, price, status }
    orders [ index ] = updateOrder

    return response.json ( updateOrder)

})

app.delete ("/order/:id", checkMethodUrl,checkOrderId,( request, response ) => {// deletando pedido

    const index = request.orderIndex

    orders.splice ( index,1 )

    return response.status (204).json()

})

