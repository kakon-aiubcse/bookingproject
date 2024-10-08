import React, { useEffect, useRef } from "react";

const TestFocus = () => {
  const inputRef = useRef(null);

  useEffect(() => {
    console.log("Component mounted, focusing on creditedAmount input.");
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <label htmlFor="creditedAmount">Credited Amount</label>
      <input
        type="number"
        id="creditedAmount"
        ref={inputRef}
        placeholder="Focus should auto here"
        className="border rounded p-2"
      />
    </div>
  );
};

export default TestFocus;
