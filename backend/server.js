// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Temporary in-memory DB
let products = [];

// Save product
app.post('/products', (req, res) => {
  const { name, description, answers } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: 'Missing name or description' });
  }
  const newProduct = { id: products.length + 1, name, description, answers };
  products.push(newProduct);
  res.json({ message: 'Product saved successfully!', product: newProduct });
});

// List products
app.get('/products', (req, res) => {
  res.json(products);
});

// Generate PDF report
app.post('/report', (req, res) => {
  const { productName, answers } = req.body;

  if (!productName || !answers) {
    return res.status(400).json({ message: 'Missing productName or answers' });
  }

  const doc = new PDFDocument();
  let filename = `${productName.replace(/\s+/g, "_")}_report.pdf`;

  res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-type", "application/pdf");

  doc.pipe(res);

  // Title
  doc.fontSize(20).text("Product Transparency Report", { align: "center" });
  doc.moveDown();

  // Product name
  doc.fontSize(14).text(`Product: ${productName}`);
  doc.moveDown();

  // Answers
  Object.entries(answers).forEach(([q, a]) => {
    doc.fontSize(12).text(`Q: ${q}`);
    doc.text(`A: ${a}`);
    doc.moveDown();
  });

  doc.end();
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
