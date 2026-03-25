import { useState, useEffect } from 'react';

export const useImpact = () => {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    // TBD: Fetch impact points from Supabase
    setPoints(1540);
  }, []);

  return { points };
};
