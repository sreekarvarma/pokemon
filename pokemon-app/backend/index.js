const path = require('path');
const express = require('express');
const cors = require('cors')
const axios = require('axios')

const app = express();
app.use(express.json())
app.use(cors())

// Serve React static files
app.use(express.static(path.join(__dirname, 'frontend/dist')));

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

app.get('/pokemon', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;

  try {
    const response = await axios.get(`${BASE_URL}?limit=10000`);
    const allPokemon = response.data.results.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const startIndex = (page - 1) * limit;
    const paginated = allPokemon.slice(startIndex, startIndex + limit);

    if (!paginated.length) {
      return res.status(400).json({ error: 'Invalid page number.' });
    }

    res.json({ results: paginated, total: allPokemon.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving Pokémon list.' });
  }
});

app.get('/pokemon/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const response = await axios.get(`${BASE_URL}/${name}`);
    const data = response.data;

    const formatted = {
      name: data.name,
      sprite: data.sprites.front_default,
      type: data.types.map((t) => t.type.name),
      moves: data.moves.slice(0, 5).map((m) => m.move.name),
    };

    res.json(formatted);
  } catch (error) {
    res.status(404).json({ error: 'Pokémon not found.' });
  }
});

// Serve index.html for all other routes (React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
