import { createContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [tableNumber, setTableNumber] = useState(null);
    const [currentOrder, setCurrentOrder] = useState(null);

    useEffect(() => {
        // Load state from local storage if available
        const storedCustomer = localStorage.getItem('customer');
        const storedTable = localStorage.getItem('tableNumber');
        const storedCart = localStorage.getItem('cart');

        if (storedCustomer) setCustomer(JSON.parse(storedCustomer));
        if (storedTable) setTableNumber(storedTable);
        if (storedCart) setCart(JSON.parse(storedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((i) => i._id === item._id);
            if (existingItem) {
                return prevCart.map((i) =>
                    i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((i) => i._id !== itemId));
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity < 1) {
            removeFromCart(itemId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((i) => (i._id === itemId ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const loginCustomer = (cust, table) => {
        setCustomer(cust);
        setTableNumber(table);
        localStorage.setItem('customer', JSON.stringify(cust));
        localStorage.setItem('tableNumber', table);
    };

    const logoutCustomer = () => {
        setCustomer(null);
        setTableNumber(null);
        setCart([]);
        setCurrentOrder(null);
        localStorage.clear();
    };

    return (
        <OrderContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                customer,
                tableNumber,
                loginCustomer,
                logoutCustomer,
                currentOrder,
                setCurrentOrder
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export default OrderContext;
