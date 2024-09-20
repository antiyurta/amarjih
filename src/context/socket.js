import { createContext } from 'react';
import socketio from 'socket.io-client';

// export const socket = socketio.connect('http://103.236.194.40:8000');
export const socket = socketio.connect(process.env.NEXT_PUBLIC_BASE_API_URL);

socket.on('connect', function () {
  console.log('Socket Connected');
});

socket.on('disconnect', function () {
  console.log('Socket Disconnected');
});

export const SocketContext = createContext();
