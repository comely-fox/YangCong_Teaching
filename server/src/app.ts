import express, { Express } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router'
import event from './event';
import path from 'path';

const app: Express = express();

const httpServer = createServer(app)
const io: Server = new Server(httpServer, { cors: {} });


io.on('connection', (socket: Socket) => {
  event.on('onDownloaded', socket.emit.bind(socket, 'loaded'))
  event.on('onDownloadError', socket.emit.bind(socket, 'error'))
  event.on('onDownloadProgress', socket.emit.bind(socket, 'progress'))
  event.on('onDownloadComplete', socket.emit.bind(socket, 'complete'))
})

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, 'public')))
app.use('/api', router)

httpServer.listen(3000, () => {
  console.log(`server runing at http://localhost:3000`);
})