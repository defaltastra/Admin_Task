import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './afficher_groupe.css';
import { Link } from 'react-router-dom';


function DisplayGroups() {
  const [data, setData] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [selectedSecteur, setSelectedSecteur] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

axios.get('http://localhost:3000/groupe')
  .then(res => {
    console.log(res.data); 
    if (Array.isArray(res.data)) {
      const groups = res.data;
      setData(groups);
      const uniqueSecteurs = [...new Set(groups.map(group => group.secteur))];
      setSecteurs(uniqueSecteurs);
    } else {
      setError('Invalid data format, expected an array of groups');
    }
    setLoading(false);
  })
  .catch(err => {
    console.error('Error fetching data:', err); 
    setError('Error fetching data');
    setLoading(false);
  });

  useEffect(() => {
    if (selectedSecteur) {
      const filtered = data.filter(group => group.secteur === selectedSecteur);
      setFilteredGroups(filtered);
    } else {
      setFilteredGroups(data);
    }
  }, [selectedSecteur, data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h2>Veuillez selectionner un Secteur</h2>
      <div>
        <select 
          value={selectedSecteur}
          onChange={(e) => setSelectedSecteur(e.target.value)}
          className="form-select"
        >
          <option value="">Tous les Secteurs</option>
          {secteurs.map((secteur, index) => (
            <option key={index} value={secteur}>{secteur}</option>
          ))}
        </select>
      </div>
      <div className="groups">
        {filteredGroups.length > 0 ? (
          filteredGroups.map(group => (
            <div key={group.codeGroupe} className="card my-2 p-3">
              <h4 className="card-title">{group.intituleGroupe}</h4>
              <p><strong>Filiere:</strong> {group.filiere}</p>
              <p><Link style={{textDecoration: 'none',color:'#007bff',backgroundColor:'#ddd',padding:'10px',borderRadius:'10px'}} to="/emploi_stagiare">Emploi du Stagiaire</Link></p>

            </div>
          ))
        ) : (
          <div>No groups available for this secteur.</div>
        )}
      </div>
    </div>
  );
}

export default DisplayGroups;