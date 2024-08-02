import axios from 'axios';

interface PrometheusResponse {
  status: string;
  data: {
    resultType: string;
    result: Array<{
      metric: { [key: string]: string };
      values: [number, string][];
    }>;
  };
}

// Function to query event data from Prometheus
async function queryEventCounts(startTime: string, endTime: string) {
  const prometheusUrl = `http://localhost:9090/api/v1/query_range`;
  const query = 'sum by (userId, event) (event_count)';
  const params = {
    query,
    start: startTime,
    end: endTime,
    step: '1h', // Adjust the step value as needed
  };

  try {
    const response = await axios.get<PrometheusResponse>(prometheusUrl, { params });
    const data = response.data.data.result;

    data.forEach(result => {
      const userId = result.metric.userId;
      const event = result.metric.event;
      result.values.forEach(value => {
        const [timestamp, count] = value;
        console.log(`Timestamp: ${new Date(timestamp * 1000).toISOString()}, User: ${userId}, Event: ${event}, Count: ${count}`);
      });
    });
  } catch (error) {
    console.error('Query failed:', error);
  }
}

// Example usage
const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // 24 hours ago
const endTime = new Date().toISOString(); // Now
queryEventCounts(startTime, endTime);
