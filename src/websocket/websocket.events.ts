export enum SocketEvent {
  JOIN_AS_ORACLE = 'join:oracle',
  JOIN_AS_SEEKER = 'join:seeker',
  MATCH_FOUND = 'match:found',
  WAITING_ORACLE = 'waiting:oracle',
  WAITING_SEEKER = 'waiting:seeker',
  QUESTION_SEND = 'question:send',
  QUESTION_RECEIVED = 'question:received',
  ANSWER_SEND = 'answer:send',
  ANSWER_RECEIVED = 'answer:received',
  SESSION_CLOSED = 'session:closed',
}
