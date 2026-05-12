// test-client.ts
import { io } from 'socket.io-client';

const seeker = io('http://localhost:3000', {
  reconnection: false,
});

seeker.on('connect', () => {
  console.log('seeker connected:', seeker.id);
  seeker.emit('join:seeker');
});

seeker.on('waiting:oracle', () => {
  console.log('waiting for oracle...');
});

seeker.on('match:found', (data) => {
  console.log('match found!', data);
});
