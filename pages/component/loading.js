import { useState } from "react";

export default function ButtonWithLoading() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      
      setLoading(false);
    }, 1500);
  };

  return <LoadingButton loading={loading} onClick={handleClick} />;
}
