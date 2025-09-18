import express from 'express';

import fetch from 'node-fetch';


const app = express();

const PORT = process.env.PORT || 3000;

app.get('/',(req, res) => {
    res.send('Hello World! This is my first Express server.');
});

app.get('/api/products', (req, res) => {
    try {
        const productId = parseInt(req.query.id); // FIX: use params ?id=1
        console.log(`Fetching data for product ID: ${productId}`);

        const products = [
            { id: 1, name: 'Laptop', price: 1200 },
            { id: 2, name: 'Mouse', price: 25 },
            { id: 3, name: 'Keyboard', price: 75 }
        ];

        const product = products.find(p => p.id === productId);

        if (product) {
            console.log(product);
            return res.json(product);
        } else {
            return res.status(404).send('Product not found');
        }
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});


app.get('/api/books', async (req, res) => {
  try {
    const q = req.query.q || 'crime and punishment';
    const fields = req.query.fields || 'key,title,author_name,editions';

    // build and encode the OpenLibrary URL
    const olUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&fields=${encodeURIComponent(fields)}`;

    // fetch from OpenLibrary
    const response = await fetch(olUrl);

    // pass through status if you want to mirror upstream errors
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const data = await response.json();

    // basic cache-control to reduce repeated hits (tweak as needed)
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    return res.json(data);
  } catch (err) {
    console.error('OpenLibrary proxy error:', err);
    return res.status(500).send(`Error fetching OpenLibrary: ${err.message}`);
  }
});
// app.get('/api/products/:id', (req, res) => {
// //     const reason = "https://openlibrary.org/search.json?q=crime+and+punishment&fields=key,title,author_name,editions"
// //   res.send(reason)
//         try {
//             const productsId = parseInt(req.parms.id); // from params /i
//         console.log(`Fetching data for product ID: ${productsId}`);
//             const products = [
//             { id: 1, name: 'Laptop', price: 1200 },
//             { id: 2, name: 'Mouse', price: 25 },
//             { id: 3, name: 'Keyboard', price: 75 }
//         ];
//          const product = products.find(p => p.id === productId);

//         if (product) {
//             res.json(product);
//             return;
//         } else {
//             res.status(404).send('Product not found');
//             return;
//         }
//         } catch (error) {
//             res.status(500).send('Internal Server Error');
//             res.send(error.message)
//         }
// });
// URL looks like: /api/products?id=1
// app.get('/api/products', (req, res) => {
//     const productId = parseInt(req.parms.id); // from query   
//     console.log(`Fetching data for product ID: ${productId}`);

//     const products = [
//         { id: 1, name: 'Laptop', price: 1200 },
//         { id: 2, name: 'Mouse', price: 25 },
//         { id: 3, name: 'Keyboard', price: 75 }
//     ];

//     const product = products.find(p => p.id === productId);

//     if (product) {
//         res.json(product);
//     } else {
//         res.status(404).send('Product not found');
//     }
// });


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
