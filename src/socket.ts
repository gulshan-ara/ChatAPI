// socket.ts
import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import User from "./models/User";
import Message from "./models/Message";

export const setupSocketIO = (server: HttpServer): void => {
  const io = new Server(server);

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // User presence detection
    socket.on("userOnline", async (username: string) => {
      const user = await User.findOneAndUpdate(
        { username },
        { online: true },
        { new: true, upsert: true }
      );
      io.emit("userPresence", { username: user.username, online: user.online });
    });

    socket.on("userOffline", async (username: string) => {
      await User.findOneAndUpdate({ username }, { online: false });
      io.emit("userPresence", { username, online: false });
    });

    // Handle sending messages
    socket.on("sendMessage", async (data: { sender: string; recipient: string; content: string }) => {
      const message = await new Message({ ...data, timestamp: new Date(), read: false }).save();
      io.to(data.recipient).emit("receiveMessage", message);
    });

    // Handle read receipts
    socket.on("readMessage", async (messageId: string) => {
      const message = await Message.findByIdAndUpdate(messageId, { read: true }, { new: true });
      if (message) {
        io.to(message.sender).emit("messageRead", message);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
