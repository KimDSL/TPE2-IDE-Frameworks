import { useState, useEffect } from "react";

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem('polyquiz_token');
        
        const headers = {
          'Content-Type': 'application/json',
          ...options.headers
        };
        
        if (token) {
          headers['Authorization'] = Bearer ${token};
        }
        
        const response = await fetch(url, { ...options, headers });
        const json = await response.json();
        
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('polyquiz_token');
            localStorage.removeItem('polyquiz_user');
            window.location.href = '/';
          }
          throw new Error(json.message || 'Erreur');
        }
        
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default useFetch;