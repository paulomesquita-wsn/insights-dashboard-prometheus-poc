import * as express from 'express';
import { Gauge, Registry } from 'prom-client';

// Create an Express instance
const app = express();

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
  const events = [
    'ROUTE_CREATED',
    'ROUTE_RECEIVED',
    'ROUTE_OPENED',
    'ROUTE_STARTED',
    'ROUTE_ARRIVED_STOP',
    'ROUTE_COMPLETED', 
    'APP_OPENED', 
    'APP_SESSION_STARTED'
  ];
  return events[randomIntBetween(0, events.length - 1)];
}

setInterval(() => {
  pushEvent(getRandomUserId(), getRandomEvent());
}, 100);

// Define the /metrics endpoint
app.get('/metrics', async (request, reply) => {
  const metrics = await register.metrics();
  reply.set('Content-Type', register.contentType);
  reply.end(metrics);
});

// Start the server
app.listen(3000, () => {
  console.log(`Metrics server listening at http://localhost:3000`);
});
