import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Libraries from './pages/Libraries';
import Books from './pages/Books';
import '@mantine/carousel/styles.css';
import CardDetail from './components/CardDetail';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/libraries" element={<Libraries />} />
        <Route path="/books" element={<Books />} />
        <Route path="/bookDetail/:id" element={<CardDetail />} />
      </Route>
    </Routes>
  );
};

export default App;
