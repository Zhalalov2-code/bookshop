import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/main';
import Books from './pages/books';
import Basket from './pages/basket';
import Profil from './pages/profil';
import Register from './pages/register';
import Login from './pages/login';
import { AuthProvider } from './components/authContext';
import PrivatRoute from './components/privatRoute';
import Details from './pages/details.book';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/books" element={<Books />} />
          <Route path="/basket" element={<Basket />} />
          <Route path="/profil" element={<PrivatRoute><Profil /></PrivatRoute>} />
          <Route path="/register" element={<Register />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/details.book/:id" element={<Details />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
