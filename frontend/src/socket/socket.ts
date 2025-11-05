import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket(apiUrl: string, uid: string) {
  if (socket) return socket;
  
  // Convert http:// or https:// to ws:// or wss://
  const wsUrl = apiUrl.replace(/^http/, 'ws');
  console.log('Connecting to WebSocket:', `${wsUrl}/ws`);
  
  socket = io(wsUrl, { 
    path: '/ws',
    query: { uid },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  
  // Add debug event listeners
  socket.on('connect', () => {
    console.log('Socket connected with ID:', socket?.id);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);  
  });
  
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });
  
  return socket;
}

export function getSocket() { 
  console.log('Getting socket instance:', socket?.connected ? 'connected' : 'disconnected');
  return socket; 
}

export function disconnectSocket() { 
  console.log('Disconnecting socket');
  socket?.disconnect(); 
  socket = null; 
}
