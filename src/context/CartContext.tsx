import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/api/axiosInstance';
import { toast } from 'sonner';
import { useAuth } from '../AuthContext';

interface CartItem {
    serviceId: string;
    subServiceId: string;
    name: string;
    category: string;
    price: number;
    actualPrice?: number;
    imageUrl?: string;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => Promise<void>;
    removeFromCart: (subServiceId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    loading: boolean;
    totalPrice: number;
    totalActualPrice: number;
    totalSavings: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/cart');
            console.log('Cart Fetched:', { data });
            if (data && data.items) {
                setCartItems(data.items);
            }
        } catch (error) {
            console.error('Failed to fetch cart', error);
            // Don't toast on fetch error to avoid spam on login
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (item: CartItem) => {
        try {
            if (!user) {
                toast.error('Please login to add items to cart');
                return;
            }

            // Check if item already exists locally to give instant feedback
            if (cartItems.some(i => i.subServiceId === item.subServiceId)) {
                toast.info('Item is already in your cart');
                return;
            }

            setLoading(true);
            await axios.post('/cart/add', item);
            await fetchCart(); // Refresh cart from server
            toast.success('Added to cart');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (subServiceId: string) => {
        try {
            setLoading(true);
            await axios.delete(`/cart/${subServiceId}`);
            setCartItems(prev => prev.filter(item => item.subServiceId !== subServiceId));
            toast.success('Removed from cart');
        } catch (error) {
            toast.error('Failed to remove item');
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            setLoading(true);
            await axios.delete('/cart');
            setCartItems([]);
        } catch (error) {
            console.error("Failed to clear cart", error)
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalActualPrice = cartItems.reduce((acc, item) => acc + ((item.actualPrice || item.price) * item.quantity), 0);
    const totalSavings = totalActualPrice - totalPrice;

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            loading,
            totalPrice,
            totalActualPrice,
            totalSavings
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
