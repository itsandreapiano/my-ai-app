import * as React from "react";

const App = () => {
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);
  return <p className="font-bold p-4">{message}</p>;
};

export default App;
