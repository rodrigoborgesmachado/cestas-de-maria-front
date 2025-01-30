import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingModal from './components/common/Modals/LoadingModal/LoadingModal';
import AdminRoutes from './routes/admin/AdminRoutes';
import LoginPage from './pages/common/LoginPage/LoginPage';

function App() {
  const isLoading = useSelector((state) => state.loading.isLoading);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <div className="App">
        <ToastContainer autoClose={2000} />
        {isLoading && <LoadingModal />}
        <Routes>
          {
            !isAuthenticated?
            <Route path="/" element={<LoginPage />} />
            :
            <Route path="/*" element={<AdminRoutes />} />
          }
          </Routes>
      </div>
    </Router>
  );
}

export default App;
