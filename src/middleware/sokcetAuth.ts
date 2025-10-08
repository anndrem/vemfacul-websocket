import jwt from "jsonwebtoken"
import { Socket } from "socket.io"

export function socketAuth(socket: Socket, next: (err?: Error) => void) {
    const cookies = socket.handshake.headers.cookie || ""
    const token = cookies.substring(6)
    
    if (!token) { return next(new Error("Token ausente nos cookies")); }
    
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET!)
        socket.data.user = decoded

        console.log(`✅ Usuário autenticado via cookie`);
        next();

    } catch (err) {
        console.error("❌ Erro ao verificar token:", err);
        next(new Error("Authentication error"));

    }
}