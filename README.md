# 🔮 Oráculo

> *"O oráculo é a resposta dada por uma divindade a uma questão pessoal através de artes divinatórias."*

O Oráculo é um projeto que traz a parte mais humana de uma consulta oracular — a vontade de perguntar e a disposição de responder. Duas pessoas se conectam em tempo real: uma como Perguntador, outra como Oráculo. Cada sessão tem direito a uma pergunta e uma resposta. Pense muito antes de perguntar.

---

## Arquitetura

O projeto é um **monólito modular** em NestJS, organizado em domínios isolados (`session`, `matchmaking`, `websocket`, `moderation`) mas rodando em um único processo. Essa decisão foi intencional — microsserviços trazem custo operacional alto para um volume pequeno de requisições, mas a estrutura modular permite extrair qualquer domínio para um serviço independente no futuro.

**Decisões técnicas:**

- **Redis + BullMQ no lugar de Kafka** — o volume de mensagens por sessão é baixo (máximo 2 por par de usuários). Kafka seria overkill; o Redis resolve o mesmo problema com muito menos complexidade operacional.
- **Moderação síncrona no gateway** — pela mesma razão, a moderação via Groq roda direto no handler do WebSocket em vez de um worker desacoplado. A latência do modelo é baixa o suficiente para não bloquear o fluxo.
- **Fila de matchmaking no Redis via BullMQ** — diferente de uma fila em memória, persiste entre restarts do servidor.
- **MongoDB Atlas** — banco gerenciado, sem necessidade de configurar replica set local.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | NestJS + TypeScript |
| Banco de dados | MongoDB (Prisma ORM) |
| Fila | Redis + BullMQ |
| Comunicação | Socket.io (WebSockets) |
| Moderação | Groq API (llama-3.1-8b-instant) |
| Testes | Jest |

---

## Como rodar localmente

**Pré-requisitos:** Node.js 20+, Docker, Yarn

```bash
git clone https://github.com/seu-usuario/oraculo-api
cd oraculo-api
yarn install
cp .env.example .env   # preenche as variáveis
docker compose up -d   # sobe o Redis
yarn start:dev
```

**Variáveis de ambiente necessárias:**

```env
DATABASE_URL=          # MongoDB Atlas connection string
REDIS_HOST=localhost
REDIS_PORT=6379
GROQ_API_KEY=          # console.groq.com
NODE_ENV=development
```

---

## Eventos WebSocket

| Evento | Direção | Payload |
|---|---|---|
| `join:seeker` | cliente → servidor | — |
| `join:oracle` | cliente → servidor | — |
| `match:found` | servidor → cliente | `{ roomId }` |
| `waiting:oracle` | servidor → cliente | — |
| `waiting:seeker` | servidor → cliente | — |
| `question:send` | cliente → servidor | `{ roomId, content }` |
| `question:received` | servidor → cliente | `{ content }` |
| `answer:send` | cliente → servidor | `{ roomId, content }` |
| `answer:received` | servidor → cliente | `{ content }` |
| `session:closed` | servidor → cliente | — |

---

## Testes

```bash
yarn test
```