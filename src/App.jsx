import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Libraries from './pages/Libraries';
import CardDetail from './components/CardDetail';
import LibrariesDetail from './pages/LibraryDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Book from './pages/Book';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/libraries" element={<Libraries />} />
        <Route path="/libraryDetail/:id" element={<LibrariesDetail />} />
        <Route path="/bookDetail/:id" element={<CardDetail />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/profile" element={<Profile />} />

        <Route element={<PrivateRoute />}>
          <Route path="/books" element={<Book />} />
        </Route>
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

export default App;
