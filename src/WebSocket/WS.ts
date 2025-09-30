import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: Number(process.env.PORT)})

export default wss