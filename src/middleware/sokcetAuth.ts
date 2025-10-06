import jwt from "jsonwebtoken"
import { Socket } from "socket.io"

export function socketAuth(socket: Socket, next: (err?: Error) => void) {
    try {
        const token =
            socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split("")[1];

        if (!token) {
            console.warn("❌ Conexão recusada: token ausente");
            return next(new Error("Authentication error: token missing"));
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("❌ JWT_SECRET is not defined in environment variables");
            return next(new Error("Authentication error: server misconfiguration"));
        }
        
        const decoded = jwt.verify(token, secret) as unknown as { id_user: number };

         (socket as any).user = decoded;

        console.log(`🔐 Usuário autenticado no socket: ${decoded.id_user}`);
        next();

    } catch (err) {
        console.error("❌ Erro ao verificar token:", err);
        next(new Error("Authentication error"));

    }
}