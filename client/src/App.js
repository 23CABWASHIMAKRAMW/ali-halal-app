import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderStatus from './pages/OrderStatus';
import Review from './pages/Review';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';

function App() {
    return (
        <OrderProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* Customer Routes */}
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/order/:id" element={<OrderStatus />} />
                        <Route path="/review/:orderId" element={<Review />} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<Navigate to="/admin/login" />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Routes>
                </div>
            </Router>
        </OrderProvider>
    );
}

export default App;
