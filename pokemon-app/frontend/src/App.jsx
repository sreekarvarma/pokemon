import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {

  const [page, setPage] = useState(1);
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // New state to track loading

  const BASE_URL = 'https://pokemon-6ebn.onrender.com';

  const fetchPokemon = async (pageNum) => {
    setLoading(true);  // Start loading before the API request
    try {
      setError('');
      const listRes = await axios.get(`${BASE_URL}/pokemon?page=${pageNum}`);
      const promises = listRes.data.results.map((p) =>
        axios.get(`${BASE_URL}/pokemon/${p.name}`)
      );
      const details = await Promise.all(promises);
      setPokemonList(details.map((res) => res.data));
      setPage(pageNum);
    } catch (error) {
      setError(error.message,'Could not fetch Pokémon. Please try again.');
    } finally {
      setLoading(false);  // Stop loading after the API request finishes
    }
  };

  return (
    <>
        <div style={{ padding: 20 }}>
      <h1>Pokemon</h1>
      <button onClick={() => fetchPokemon(1)}>Start</button>

      {/* Show error message if there's an error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Show loading message only once */}
      {loading && <p className="loader">Loading...</p>}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {pokemonList.map((p) => (
          <div key={p.name} className="pokemon-card">
            <img src={p.sprite} alt={p.name} className="pokemon-img" />
            <h3>{p.name}</h3>
            <p><strong>Type:</strong> {p.type.join(', ')}</p>
            <p><strong>Moves:</strong> {p.moves.join(', ')}</p>
          </div>
        ))}
      </div>

      {pokemonList.length > 0 && (
        <div style={{ marginTop: 20 }}>
          {page > 1 && <button onClick={() => fetchPokemon(page - 1)}>Prev</button>}
          {<button onClick={() => fetchPokemon(page + 1)}>Next</button>}
        </div>
      )}
    </div>
    </>
  )
}

export default App;
