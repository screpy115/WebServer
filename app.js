const WebSocket = require("ws");

const serialPort = require("serialport");
const readLine = require("@serialport/parser-readline");
const port = new serialPort("COM4", {baudRate: 4800});
const parser = new readLine();

port.pipe(parser);

port.on('readable', function () {
  const data = port.read();
  console.log('Data:', data);
  port.write(data);
});

const wsServer = new WebSocket.Server({port: 9000});
console.log(wsServer.address());

const os = require('os');
const networkInterfaces = os.networkInterfaces();
const localIPs = [];

for (const interfaceName of Object.keys(networkInterfaces)) {
   for (const network of networkInterfaces[interfaceName]) {
      if (network.family === 'IPv4' && !network.internal) {
         localIPs.push(network.address);
      }
   }
}

console.log('Local IP addresses:', localIPs);

wsServer.on('connection', onConnect);

function onConnect(wsClient)
{
    console.log('Новый пользователь')
    wsClient.send('Привет');
    wsClient.on('message', 
        function(message)
        {
            /* обработчяик сообщений от клиента */
            try {
                // сообщение пришло текстом, нужно конвертировать в JSON-формат
                const jsonMessage = JSON.parse(message);
                switch (jsonMessage.action) {
                  case "ECHO":
                    wsClient.send(jsonMessage.data);
                    break;
                  case "PING":
                    setTimeout(function() {
                      wsClient.send("PONG");
                    }, 2500);
                    break;
                  default:
                    console.log('Неизвестная команда');
                    break;
                }
              } catch (error) {
                console.log("Ошибка", error);
              }
        }
    );
    wsClient.on('close', 
        function()
        {
            console.log('Пользователь отключился');
        }
    );
    
}