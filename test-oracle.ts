import { io } from 'socket.io-client';

const oracle = io('http://localhost:3000', {
  reconnection: false,
  auth: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6InBlcmd1bnRhZG9yIiwiaWF0IjoxNzc4NjMwNTQ0LCJleHAiOjE3Nzg2Mzc3NDR9.LlmAnEqPnheMULN6Lm8y5tINMiRLYlEY9GnPsyOV03s',
  },
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
