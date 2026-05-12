import { io } from 'socket.io-client';

const oracle = io('http://localhost:3000', {
  reconnection: false,
});

oracle.on('connect', () => {
  console.log('oracle connected:', oracle.id);
  oracle.emit('join:oracle');
});

oracle.on('match:found', (data) => {
  console.log('match found!', data);
});

oracle.on('waiting:seeker', () => {
  console.log('waiting for seeker...');
});
