import React, { useEffect, useState } from 'react';
import GlobalApi from '../utils/GlobalApi';

export default function BusinessList() {
  const [businessLists, setBusinessLists] = useState([]);

  useEffect(() => {
    const fetchBusinessLists = async () => {
      try {
        const fetchedBusinessLists = await GlobalApi.getBusinessLists();
        setBusinessLists(fetchedBusinessLists);
      } catch (error) {
        console.error('Error fetching business lists:', error);
      }
    };

    fetchBusinessLists();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Business Lists</h2>
      <ul style={styles.list}>
        {businessLists.map((business) => (
          <li key={business.id} style={styles.listItem}>
            {business.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    padding: '10px 0',
    borderBottom: '1px solid #ccc',
  },
};
