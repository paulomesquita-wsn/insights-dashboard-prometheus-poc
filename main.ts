import fastify from 'fastify';
import { Gauge, Registry } from 'prom-client';

// Create a Fastify instance
const app = fastify({ logger: true });

// Create a registry
const register = new Registry();

// Define a gauge metric
const eventGauge = new Gauge({
  name: 'event_count',
  help: 'Count of events',
  labelNames: ['userId', 'event'],
});

// Register the gauge metric
register.registerMetric(eventGauge);

// Simulate pushing events
function pushEvent(userId: string, eventType: string) {
  eventGauge.labels(userId, eventType).inc();
}

function randomIntBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomUserId() {
  return randomIntBetween(1, 1000).toString();
}

function getRandomEvent() {
  const events = ['ROUTE_CREATED',
  'ROUTE_RECEIVED',
  'ROUTE_OPENED',
  'ROUTE_STARTED',
  'ROUTE_ARRIVED_STOP',
  'ROUTE_COMPLETED', 
  'APP_OPENED', 
  'APP_SESSION_STARTED'];
  return events[randomIntBetween(0, 2)];
}

setInterval(()=> {
  pushEvent(getRandomUserId(), getRandomEvent());
}, 100)


// Define the /metrics endpoint
app.get('/metrics', async (request, reply) => {
  reply.header('Content-Type', register.contentType);
  reply.send(await register.metrics());
});

// Start the server
const start = async () => {
  try {
    await app.server.listen(3000, '0.0.0.0');
    app.log.info(`Metrics server listening at http://localhost:3000`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
