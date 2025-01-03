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

// Route to calculate property tax (Pajak Bumi dan Bangunan)
app.post('/pbb_count', (req, res) => {
  console.log("HITUNG PBB");
  const { luas_bangunan, luas_tanah, harga_bangunan, harga_tanah } = req.body;
  const isConvertible = !isNaN(Number(luas_bangunan)) && !isNaN(Number(luas_tanah)) && !isNaN(Number(harga_bangunan)) && !isNaN(Number(harga_tanah))

  // Validate inputs
  if (!isConvertible) {
    return res.status(400).json({ error: 'All request parameters must be numbers' });
  }

  const luas_bangunan_converted = Number(luas_bangunan);
  const luas_tanah_converted = Number(luas_tanah);
  const harga_bangunan_converted = Number(harga_bangunan);
  const harga_tanah_converted = Number(harga_tanah);

  let harga_akhir = 0;
  const PERSEN_PAJAK = 0.005;
  const harga_total = luas_bangunan_converted * harga_bangunan_converted + luas_tanah_converted * harga_tanah_converted;
  if (harga_total >= 1000000000){
    harga_akhir = 0.4 * harga_total * PERSEN_PAJAK;
  }else{
    harga_akhir = 0.2 * harga_total * PERSEN_PAJAK;
  }

  console.log(harga_akhir);
  return res.json({ harga_akhir });
});

// Route to calculate property value-added tax (Pajak Pertamabahan Nilai Properti)
app.post('/ppn_count', (req, res) => {
  console.log("HITUNG PPN");
  const { luas_bangunan, luas_tanah, harga_bangunan, harga_tanah } = req.body;
  const isConvertible = !isNaN(Number(luas_bangunan)) && !isNaN(Number(luas_tanah)) && !isNaN(Number(harga_bangunan)) && !isNaN(Number(harga_tanah));

  // Validate inputs
  if (!isConvertible) {
    return res.status(400).json({ error: 'All request parameters must be numbers' });
  }

  const luas_bangunan_converted = Number(luas_bangunan);
  const luas_tanah_converted = Number(luas_tanah);
  const harga_bangunan_converted = Number(harga_bangunan);
  const harga_tanah_converted = Number(harga_tanah);
  const harga_total = luas_bangunan_converted * harga_bangunan_converted + luas_tanah_converted * harga_tanah_converted;
  
  const BPHTB = 0.05 * harga_total;
  const PPH_final = 0.025 * harga_total;
  const PPN_properti = 0.1 * harga_total;

  const harga_akhir = BPHTB + PPH_final + PPN_properti;
  console.log(harga_akhir);
  return res.json({ harga_akhir });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});