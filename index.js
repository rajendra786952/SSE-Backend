const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
  res.json({message:"connection done successfull"});
})

app.get('/progress', (req, res) => {
  // Set necessary headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // Send headers immediately

  let progress = 0;

  // Send progress update every second
  const interval = setInterval(() => {
    if (progress <= 100) {
      console.log(new Date().toLocaleTimeString())
      console.log("data ",progress);
      res.write(`data: ${JSON.stringify({ progress })}\n\n`);
      progress += 10; // Simulating progress increment
    } else {
      clearInterval(interval);
      res.write(`data: ${JSON.stringify({ progress: 100, message: "Task completed" })}\n\n`);
      res.end(); // Close the connection when done
    }
  }, 1000);

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected, closing connection');
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
