import * as React from 'react';
import { Button } from './components/ui/button';

const App = () => {
   const [message, setMessage] = React.useState('');

   React.useEffect(() => {
      fetch('/api/hello')
         .then((res) => res.json())
         .then((data) => setMessage(data.message));
   }, []);
   return (
      <div className="p-4">
         <p className="font-bold text-3xl">{message}</p>
         <Button>Click me</Button>
      </div>
   );
};

export default App;
