console.log("Hello World");

const { SerialPort } = require('serialport')

const serialport = new SerialPort({ path: 'COM4', baudRate: 9600 })
serialport.write('ROBOT POWER ON')