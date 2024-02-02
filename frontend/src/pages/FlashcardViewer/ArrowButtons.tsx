import React, { useState } from 'react';

const ArrowButtons = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <button onClick={handleDecrement}>&larr;</button>
      <p>{count}</p>
      <button onClick={handleIncrement}>&rarr;</button>
    </div>
  );
};

export default ArrowButtons;