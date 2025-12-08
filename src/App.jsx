import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Libraries from './pages/Libraries';
import Books from './pages/Books';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/libraries" element={<Libraries />} />
        <Route path="/books" element={<Books />} />
      </Route>
    </Routes>
  );
};

export default App;
