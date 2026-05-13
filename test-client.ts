// test-client.ts
import { io } from 'socket.io-client';

const seeker = io('http://localhost:3000', {
  reconnection: false,
  auth: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6Imtvc292b3NvIiwiaWF0IjoxNzc4NjMwNDY4LCJleHAiOjE3Nzg2Mzc2Njh9.VXQIeZA3qf7ZqlbpFGou3aOMGidKSahzrETKtr-lKrc',
  },
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
