import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {

  const [page, setPage] = useState(1);
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState('');

  const fetchPokemon = async (pageNum) => {
    try {
      setError('');
      const listRes = await axios.get(`http://localhost:3000/pokemon?page=${pageNum}`);
      const promises = listRes.data.results.map((p) =>
        axios.get(`http://localhost:3000/pokemon/${p.name}`)
      );
      const details = await Promise.all(promises);
      setPokemonList(details.map((res) => res.data));
      setPage(pageNum);
    } catch (error) {
      setError(error.message, 'Could not fetch Pokémon. Please try again.');
    }
  };

  return (
    <>
        <div style={{ padding: 20 }}>
      <h1>Pokemon</h1>
      <button onClick={() => fetchPokemon(1)}>Start</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {pokemonList.map((p) => (
          <div key={p.name} style={{ border: '1px solid gray', padding: 10 }}>
            <h3>{p.name}</h3>
            <img src={p.sprite} alt={p.name} />
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

export default App
