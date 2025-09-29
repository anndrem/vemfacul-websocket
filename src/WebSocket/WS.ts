import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: Number(process.env.PORT) || 3002 })

export default wss