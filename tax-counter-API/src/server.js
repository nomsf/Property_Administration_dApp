const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3001;

// Middleware for logging incoming request
app.use(morgan('combined'))

// Middleware to parse JSON requests
app.use(express.json());

// Test route for get example
app.get('/', (req, res)=> {
  res.send("Hello, World!");
})

// Route to calculate the sum of two numbers
app.post('/tax_count', (req, res) => {
  const { luas_bangunan, luas_tanah, harga_bangunan, harga_tanah } = req.body;
  const isConvertible = !isNaN(Number(luas_bangunan)) && !isNaN(Number(luas_tanah)) && !isNaN(Number(harga_bangunan)) && !isNaN(Number(harga_tanah))
  console.log(luas_bangunan, luas_tanah, harga_bangunan, harga_tanah);

  // Validate inputs
  if (!isConvertible) {
    return res.status(400).json({ error: 'All request parameters must be numbers' });
  }

  const luas_bangunan_converted = Number(luas_bangunan)
  const luas_tanah_converted = Number(luas_tanah)
  const harga_bangunan_converted = Number(harga_bangunan)
  const harga_tanah_converted = Number(harga_tanah)

  let harga_akhir = 0;
  const pajak = 0.005;
  const harga_total = luas_bangunan_converted * harga_bangunan_converted + luas_tanah_converted * harga_tanah_converted;
  if (harga_total >= 1000000000){
    harga_akhir = 0.4 * harga_total * pajak
  }else{
    harga_akhir = 0.2 * harga_total * pajak    
  }

  console.log(harga_akhir);
  return res.json({ harga_akhir });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});