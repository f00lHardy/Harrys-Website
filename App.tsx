
import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import type { Special, ProductCategory, Subcategory, GalleryItem, User } from './types';
import { BUSINESS_INFO, INITIAL_PRODUCT_CATEGORIES, GALLERY_ITEMS, INITIAL_SPECIALS } from './constants';

// --- ICONS ---
const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> );
const XIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> );
const WhatsAppIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.908 6.161l-1.317 4.831 4.92-1.307z"/></svg> );
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>;


// --- CONTEXT ---
// Local Storage Hook
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}


// Products Context
interface ProductsContextType {
    categories: ProductCategory[];
    addCategory: (category: Omit<ProductCategory, 'id' | 'subcategories'>) => void;
    updateCategory: (id: number, category: Omit<ProductCategory, 'id' | 'subcategories'>) => void;
    deleteCategory: (id: number) => void;
    addSubcategory: (categoryId: number, subcategory: Omit<Subcategory, 'id'>) => void;
    updateSubcategory: (categoryId: number, subcategoryId: number, subcategory: Omit<Subcategory, 'id'>) => void;
    deleteSubcategory: (categoryId: number, subcategoryId: number) => void;
}
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useLocalStorage<ProductCategory[]>('harrys_products', INITIAL_PRODUCT_CATEGORIES);

    const addCategory = (category: Omit<ProductCategory, 'id' | 'subcategories'>) => {
        const newCategory: ProductCategory = { ...category, id: Date.now(), subcategories: [] };
        setCategories(prev => [newCategory, ...prev]);
    };

    const updateCategory = (id: number, updatedCategory: Omit<ProductCategory, 'id' | 'subcategories'>) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedCategory } : c));
    };

    const deleteCategory = (id: number) => {
        if (window.confirm('Are you sure you want to delete this category and all its subcategories?')) {
            setCategories(prev => prev.filter(c => c.id !== id));
        }
    };

    const addSubcategory = (categoryId: number, subcategory: Omit<Subcategory, 'id'>) => {
        const newSubcategory: Subcategory = { ...subcategory, id: Date.now() };
        setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, subcategories: [...c.subcategories, newSubcategory] } : c));
    };

    const updateSubcategory = (categoryId: number, subcategoryId: number, updatedSubcategory: Omit<Subcategory, 'id'>) => {
        setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, subcategories: c.subcategories.map(s => s.id === subcategoryId ? { ...s, ...updatedSubcategory } : s) } : c));
    };

    const deleteSubcategory = (categoryId: number, subcategoryId: number) => {
         if (window.confirm('Are you sure you want to delete this subcategory?')) {
            setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subcategoryId) } : c));
        }
    };
    
    return (
        <ProductsContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory }}>
            {children}
        </ProductsContext.Provider>
    );
};

const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) throw new Error('useProducts must be used within a ProductsProvider');
    return context;
};

// Specials Context
interface SpecialsContextType {
    specials: Special[];
    addSpecial: (special: Omit<Special, 'id'>) => void;
    removeSpecial: (id: number) => void;
}
const SpecialsContext = createContext<SpecialsContextType | undefined>(undefined);

const SpecialsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [specials, setSpecials] = useLocalStorage<Special[]>('harrys_specials', INITIAL_SPECIALS);

    const addSpecial = (special: Omit<Special, 'id'>) => {
        const newSpecial = { ...special, id: Date.now() };
        setSpecials(prev => [newSpecial, ...prev]);
    };

    const removeSpecial = (id: number) => {
        setSpecials(prev => prev.filter(s => s.id !== id));
    };

    return (
        <SpecialsContext.Provider value={{ specials, addSpecial, removeSpecial }}>
            {children}
        </SpecialsContext.Provider>
    );
};

const useSpecials = () => {
    const context = useContext(SpecialsContext);
    if (!context) throw new Error('useSpecials must be used within a SpecialsProvider');
    return context;
};

// Auth Context
interface AuthContextType {
    user: User | null;
    login: (email: string) => void;
    register: (name: string, email: string) => void;
    logout: () => void;
    addPoints: (amount: number) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useLocalStorage<User[]>('harrys_users', []);
    const [user, setUser] = useLocalStorage<User | null>('harrys_currentUser', null);
   
    const login = (email: string) => {
        const foundUser = users.find(u => u.email === email);
        if (foundUser) {
            setUser(foundUser);
        } else {
            alert('User not found.');
        }
    };
    
    const register = (name: string, email: string) => {
        if (users.some(u => u.email === email)) {
            alert('User with this email already exists.');
            return;
        }
        const newUser: User = { id: Date.now(), name, email, points: 0 };
        setUsers(prev => [...prev, newUser]);
        setUser(newUser);
    };
    
    const logout = () => {
        setUser(null);
    };

    const addPoints = (amount: number) => {
        if (user) {
            const updatedUser = { ...user, points: user.points + amount };
            setUser(updatedUser);
            setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, addPoints }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

// --- REUSABLE COMPONENTS ---
const Logo: React.FC = () => (
    <div className="flex items-center flex-shrink-0">
        <img src="https://i.imgur.com/Xq2O39P.png" alt="Harry's Hardware Logo" className="h-12 w-auto" />
    </div>
);

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const navLinks = [
        { path: '/', name: 'Home' },
        { path: '/about', name: 'About' },
        { path: '/products', name: 'Products' },
        { path: '/gallery', name: 'Gallery' },
        { path: '/contact', name: 'Contact' },
    ];
    
    const activeLinkClass = "text-brand-orange";
    const inactiveLinkClass = "hover:text-brand-orange";

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" onClick={() => setIsOpen(false)}>
                        <Logo />
                    </Link>
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <NavLink key={link.name} to={link.path} className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} font-semibold transition-colors duration-200`}>
                                {link.name}
                            </NavLink>
                        ))}
                    </div>
                    <div className="hidden md:flex items-center">
                         {user ? (
                            <Link to="/dashboard" className="bg-brand-green text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors">Dashboard</Link>
                        ) : (
                            <Link to="/auth" className="bg-brand-orange text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors">Login / Register</Link>
                        )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="hover:text-brand-orange focus:outline-none">
                            {isOpen ? <XIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                            <NavLink key={link.name} to={link.path} onClick={() => setIsOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-semibold ${isActive ? 'bg-orange-100 text-brand-orange' : 'hover:bg-gray-100'}`}>
                                {link.name}
                            </NavLink>
                        ))}
                    </div>
                     <div className="p-4 border-t">
                        {user ? (
                            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="w-full text-center bg-brand-green text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors">Dashboard</Link>
                        ) : (
                            <Link to="/auth" onClick={() => setIsOpen(false)} className="w-full text-center bg-brand-orange text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors">Login / Register</Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

const Footer: React.FC = () => (
    <footer className="bg-gray-800 text-white">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-bold text-brand-orange mb-4">Harry's Hardware</h3>
                    <p className="text-gray-400">{BUSINESS_INFO.slogan}</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li>Phone: {BUSINESS_INFO.phone}</li>
                        <li>Email: {BUSINESS_INFO.email}</li>
                        <li>{BUSINESS_INFO.address}</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold mb-4">Hours</h3>
                    <ul className="space-y-2 text-gray-300">
                       {BUSINESS_INFO.hours.map(h => <li key={h.day}><strong>{h.day}:</strong> {h.time}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                     <ul className="space-y-2 text-gray-300">
                       <li><Link to="/about" className="hover:text-brand-orange">About Us</Link></li>
                       <li><Link to="/products" className="hover:text-brand-orange">Products</Link></li>
                       <li><Link to="/contact" className="hover:text-brand-orange">Contact</Link></li>
                       <li><Link to="/admin" className="hover:text-brand-orange">Admin</Link></li>
                    </ul>
                </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} {BUSINESS_INFO.name}. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
    </div>
);

const QuoteModal: React.FC<{ isOpen: boolean; onClose: () => void; productName?: string }> = ({ isOpen, onClose, productName }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const whatsappMessage = `Hi, I'd like a quote for ${productName || 'some products'}.`;
    const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
    const mailtoUrl = `mailto:${BUSINESS_INFO.email}?subject=Quote Request for ${productName || 'Products'}`;


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full relative">
                <button onClick={() => {onClose(); setIsSubmitted(false);}} className="absolute top-4 right-4 text-gray-500 hover:text-brand-dark">
                    <XIcon />
                </button>
                {isSubmitted ? (
                    <div>
                         <h2 className="text-2xl font-bold text-brand-dark mb-4">Thank You!</h2>
                         <p className="mb-6">Your quote request has been received. You can also contact us directly:</p>
                         <div className="space-y-4">
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full bg-brand-green text-white px-4 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors">
                                <WhatsAppIcon/> Open WhatsApp Chat
                            </a>
                             <a href={mailtoUrl} className="block w-full text-center bg-gray-200 text-gray-800 px-4 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors">
                                Send an Email
                            </a>
                         </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Request a Quote</h2>
                        {productName && <p className="mb-4">Requesting a quote for: <strong>{productName}</strong></p>}
                        <div className="space-y-4">
                            <input type="text" placeholder="Your Name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange" required />
                            <input type="email" placeholder="Your Email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange" required />
                            <textarea placeholder="Your Message (e.g., quantity, specifications)" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange" required></textarea>
                            <div>
                                <label className="block text-sm font-medium mb-1">Optional File Upload</label>
                                <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-brand-orange hover:file:bg-orange-100"/>
                            </div>
                        </div>
                        <button type="submit" className="mt-6 w-full bg-brand-orange text-white px-4 py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors">
                            Submit Request
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

const GasDeliverySection: React.FC = () => {
    const [gasSize, setGasSize] = useState('48kg');
    const [address, setAddress] = useState('');

    const handleOrder = () => {
        if (!address.trim()) {
            alert('Please enter a delivery address.');
            return;
        }
        const message = `Hi, I'd like to order a ${gasSize} gas cylinder for delivery to the following address: ${address}.`;
        window.open(`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const gasOptions = [
        { size: '9kg', imgSrc: 'https://images.unsplash.com/photo-1605685232806-1e1f985a9b93?q=80&w=400&auto=format&fit=crop', imgAlt: '9kg gas bottle', heightClass: 'h-24' },
        { size: '19kg', imgSrc: 'https://images.unsplash.com/photo-1605051912630-3d22b27429fe?q=80&w=400&auto=format&fit=crop', imgAlt: '19kg gas bottle', heightClass: 'h-32' },
        { size: '48kg', imgSrc: 'https://images.unsplash.com/photo-1610930335293-e4a779166f2a?q=80&w=400&auto=format&fit=crop', imgAlt: '48kg gas bottle', heightClass: 'h-40' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full">
            <h3 className="text-3xl font-extrabold text-brand-dark mb-6 text-center">Order Your Gas Now</h3>

            <div className="flex justify-around items-end mb-6 py-4">
                {gasOptions.map(opt => (
                    <div key={opt.size} className="text-center">
                        <img src={opt.imgSrc} alt={opt.imgAlt} className={`${opt.heightClass} object-contain mx-auto transition-transform duration-300 ${gasSize === opt.size ? 'scale-110' : 'opacity-70 grayscale'}`} />
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <div>
                    <label className="font-bold text-brand-dark mb-2 block text-lg">Select Cylinder Size:</label>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {gasOptions.map(opt => (
                            <button
                                key={opt.size}
                                onClick={() => setGasSize(opt.size)}
                                className={`flex-1 sm:flex-none sm:px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 border-2 border-transparent ${gasSize === opt.size ? 'bg-brand-orange text-white scale-105 shadow-md' : 'bg-gray-200 hover:bg-gray-300'}`}
                            >
                                {opt.size}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="font-bold text-brand-dark mb-2 block text-lg">Delivery Address:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="Enter your full address"
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                </div>
                <button
                    onClick={handleOrder}
                    className="w-full bg-brand-green text-white flex items-center justify-center px-4 py-4 rounded-lg font-bold text-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    Order via WhatsApp
                </button>
            </div>
             <p className="text-center text-gray-500 mt-4 text-sm">Delivery in Broederstroom and nearby areas.</p>
        </div>
    );
};


const Breadcrumbs: React.FC<{ crumbs: { label: string; path?: string }[] }> = ({ crumbs }) => (
    <nav className="flex items-center text-sm text-gray-500" aria-label="Breadcrumb">
        {crumbs.map((crumb, index) => (
            <React.Fragment key={index}>
                {index > 0 && <ChevronRightIcon />}
                {crumb.path ? (
                    <Link to={crumb.path} className="px-2 py-1 rounded-md hover:bg-gray-100 hover:text-gray-700">{crumb.label}</Link>
                ) : (
                    <span className="px-2 py-1 font-semibold text-brand-dark">{crumb.label}</span>
                )}
            </React.Fragment>
        ))}
    </nav>
);

// --- PAGES ---

const HomePage: React.FC = () => {
    const { specials } = useSpecials();
    const navigate = useNavigate();
    
    const currentSpecials = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return specials.filter(s => {
            const endDate = new Date(s.endDate);
            return endDate >= today;
        });
    }, [specials]);

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-gray-800 text-white h-[60vh] flex items-center justify-center text-center">
                <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1600&auto=format&fit=crop" alt="Hardware Store Interior" className="absolute inset-0 w-full h-full object-cover opacity-40"/>
                <div className="relative z-10 px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">{BUSINESS_INFO.name}</h1>
                    <p className="text-xl md:text-2xl font-light mb-8">{BUSINESS_INFO.slogan}</p>
                    <button onClick={() => navigate('/products')} className="bg-brand-orange text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-orange-600 transition-transform hover:scale-105">
                        Explore Our Products
                    </button>
                </div>
            </div>
            {/* Specials Section */}
            <div className="py-16 bg-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-brand-dark mb-10">Current Specials</h2>
                    {currentSpecials.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentSpecials.map(special => (
                                <div key={special.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
                                    <img src={special.image} alt={special.title} className="w-full h-48 object-cover"/>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-brand-dark mb-2">{special.title}</h3>
                                        <p className="mb-4">{special.description}</p>
                                        <p className="text-sm text-red-600 font-semibold">Valid until: {new Date(special.endDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center">No current specials. Check back soon!</p>
                    )}
                </div>
            </div>
             {/* Gas Order Section */}
             <div className="py-16 bg-brand-green">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                     <GasDeliverySection />
                </div>
            </div>
        </div>
    );
};

const AboutPage: React.FC = () => (
    <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-brand-dark">About Harry's Hardware</h1>
                <p className="mt-4 text-lg">Your trusted partner in Broederstroom since 2010.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="prose lg:prose-lg">
                    <p>
                        We are a family-owned hardware store located in the heart of Broederstroom, dedicated to providing quality tools, building materials, and exceptional service to our community.
                    </p>
                    <p>
                        For over 15 years, Harry's Hardware has been the go-to source for local builders, passionate DIY customers, and professional contractors. We pride ourselves on our knowledgeable staff and our commitment to stocking reliable, high-quality products.
                    </p>
                    <p>
                        Whether you're starting a major construction project or just need to fix a leaky tap, we're here to help with expert advice and the right tools for the job.
                    </p>
                </div>
                <div>
                    <img src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=800&auto=format&fit=crop" alt="Harry's Hardware Team" className="rounded-lg shadow-xl w-full"/>
                </div>
            </div>
             <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop" alt="Store Interior" className="rounded-lg shadow-lg w-full h-64 object-cover"/>
                <img src="https://images.unsplash.com/photo-1444731961956-751ed90465a5?q=80&w=800&auto=format&fit=crop" alt="Broederstroom Area" className="rounded-lg shadow-lg w-full h-64 object-cover"/>
                <img src="https://images.unsplash.com/photo-1621929749712-de5934e6526e?q=80&w=800&auto=format&fit=crop" alt="Delivery Van" className="rounded-lg shadow-lg w-full h-64 object-cover"/>
            </div>
        </div>
    </div>
);

const ProductsPage: React.FC = () => {
    const { categories } = useProducts();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = useMemo(() =>
        categories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [categories, searchTerm]
    );

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-brand-dark">Our Products</h1>
                    <p className="mt-4 text-lg">Quality supplies for every project.</p>
                </div>
                <div className="mb-8 max-w-lg mx-auto">
                    <input
                        type="text"
                        placeholder="Search for a category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredCategories.map(category => (
                        <Link to={`/products/${encodeURIComponent(category.name)}`} key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden group block">
                            <img src={category.image} alt={category.name} className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-300"/>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-brand-dark mb-2">{category.name}</h3>
                                <p className="mb-4">{category.description}</p>
                                <span className="font-semibold text-brand-orange group-hover:underline">
                                    View Products &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CategoryPage: React.FC = () => {
    const { categoryName } = useParams<{ categoryName: string }>();
    const { categories } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const category = useMemo(() => 
        categories.find(c => c.name === decodeURIComponent(categoryName || '')),
        [categories, categoryName]
    );

    const filteredSubcategories = useMemo(() =>
        category?.subcategories.filter(sub =>
            sub.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [],
        [category, searchTerm]
    );
    
    const openQuoteModal = (productName: string) => {
        setSelectedProduct(productName);
        setIsModalOpen(true);
    };

    if (!category) {
        return <div className="text-center py-16">Category not found.</div>;
    }
    
    const breadcrumbs = [
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        { label: category.name }
    ];

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-8">
                    <Breadcrumbs crumbs={breadcrumbs} />
                </div>
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-brand-dark">{category.name}</h1>
                    <p className="mt-4 text-lg">{category.description}</p>
                </div>

                <div className="mb-8 max-w-lg mx-auto">
                    <input
                        type="text"
                        placeholder={`Search in ${category.name}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                </div>
                
                {filteredSubcategories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredSubcategories.map(sub => (
                             <div key={sub.id} className="bg-white rounded-lg shadow-md overflow-hidden group flex flex-col">
                                <img src={sub.image} alt={sub.name} className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-300"/>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-brand-dark mb-2">{sub.name}</h3>
                                    <p className="mb-4 flex-grow">{sub.description}</p>
                                    <button onClick={() => openQuoteModal(`${category.name} - ${sub.name}`)} className="w-full mt-auto bg-brand-orange text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors">
                                        Request a Quote
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">No products found matching your search.</p>
                )}
            </div>
             {category.name === "Gas Refills & Accessories" && (
                 <div className="py-16 bg-brand-green">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
                        <GasDeliverySection />
                    </div>
                </div>
             )}
            <QuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} productName={selectedProduct} />
        </div>
    )
}

const GalleryPage: React.FC = () => {
    const [filter, setFilter] = useState<'all' | GalleryItem['category']>('all');

    const filters: {key: typeof filter, label: string}[] = [
        {key: 'all', label: 'All'},
        {key: 'store', label: 'Store'},
        {key: 'staff', label: 'Our Team'},
        {key: 'products', label: 'Products'},
        {key: 'brands', label: 'Top Brands'},
    ];
    
    const filteredItems = filter === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(item => item.category === filter);

    return (
        <div className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-brand-dark">Gallery</h1>
                    <p className="mt-4 text-lg">A glimpse into Harry's Hardware.</p>
                </div>
                <div className="flex justify-center space-x-2 md:space-x-4 mb-8">
                    {filters.map(({key, label}) => (
                         <button key={key} onClick={() => setFilter(key)} className={`px-4 py-2 rounded-full font-semibold text-sm md:text-base transition-colors ${filter === key ? 'bg-brand-orange text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                            {label}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item, index) => (
                        <div key={index} className="overflow-hidden rounded-lg shadow-lg group">
                            <img src={item.src} alt={item.alt} className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300 cursor-pointer"/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ContactPage: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you shortly.');
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-brand-dark">Get In Touch</h1>
                    <p className="mt-4 text-lg">We're here to help. Contact us today!</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-brand-dark mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Your Name" className="w-full p-3 border border-gray-300 rounded-md" required/>
                            <input type="email" placeholder="Your Email" className="w-full p-3 border border-gray-300 rounded-md" required/>
                            <textarea placeholder="Your Message" rows={5} className="w-full p-3 border border-gray-300 rounded-md" required></textarea>
                            <button type="submit" className="w-full bg-brand-orange text-white p-3 rounded-md font-semibold hover:bg-orange-600">Send Message</button>
                        </form>
                    </div>
                     <div className="space-y-6">
                        <div className="bg-white p-8 rounded-lg shadow-md">
                             <h2 className="text-2xl font-bold text-brand-dark mb-4">Contact Details</h2>
                            <p><strong>Address:</strong> {BUSINESS_INFO.address}</p>
                            <p><strong>Phone / WhatsApp:</strong> {BUSINESS_INFO.phone}</p>
                            <p><strong>Email:</strong> {BUSINESS_INFO.email}</p>
                            <a href={`https://wa.me/${BUSINESS_INFO.whatsapp}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center bg-brand-green text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700">
                                <WhatsAppIcon /> Chat on WhatsApp
                            </a>
                        </div>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden h-64">
                             <iframe src={BUSINESS_INFO.mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        
        if (isLogin) {
            login(email);
        } else {
            register(name, email);
        }
        navigate('/dashboard');
    };

    return (
         <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-dark">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="sr-only">Name</label>
                            <input id="name" name="name" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-brand-orange focus:border-brand-orange focus:z-10 sm:text-sm" placeholder="Full Name"/>
                        </div>
                    )}
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input id="email-address" name="email" type="email" autoComplete="email" required className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 ${isLogin ? 'rounded-md' : 'rounded-b-md'} focus:outline-none focus:ring-brand-orange focus:border-brand-orange focus:z-10 sm:text-sm`} placeholder="Email address" />
                    </div>
                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange">
                            {isLogin ? 'Sign In' : 'Register'}
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-brand-green hover:text-green-700">
                        {isLogin ? 'Register here' : 'Sign in here'}
                    </button>
                </p>
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const { user, logout, addPoints } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/auth');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    if (!user) {
        return null; // Render nothing while redirecting
    }

    return (
        <div className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-brand-dark">Welcome, {user.name}!</h1>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-brand-green mb-4">Loyalty Dashboard</h2>
                            <p className="text-6xl font-extrabold text-brand-orange">{user.points}</p>
                            <p>Loyalty Points</p>
                            <p className="mt-4 text-sm text-gray-500">Earn 1 point for every R1 spent. Points can be redeemed for discounts and special rewards in-store.</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-brand-dark mb-4">Simulate Purchase</h2>
                            <p className="mb-4">For demonstration, add points to your account:</p>
                             <button onClick={() => addPoints(100)} className="bg-brand-green text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700">Add 100 Points</button>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-brand-dark mb-4">Account Details</h2>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <button onClick={handleLogout} className="mt-6 w-full bg-red-500 text-white p-3 rounded-md font-semibold hover:bg-red-600">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboardPage: React.FC = () => (
    <div>
        <h1 className="text-3xl font-bold text-brand-dark mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/admin/specials" className="block bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold text-brand-orange mb-2">Manage Specials</h2>
                <p>Add, edit, or remove promotional specials from the home page.</p>
            </Link>
            <Link to="/admin/products" className="block bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold text-brand-green mb-2">Manage Products</h2>
                <p>Update product categories, subcategories, images, and descriptions.</p>
            </Link>
        </div>
    </div>
);

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
                <Link to="/admin" className="text-brand-green hover:underline font-semibold">Admin</Link>
            </div>
            {children}
        </div>
    </div>
);

const AdminSpecialsPage: React.FC = () => {
    const { specials, addSpecial, removeSpecial } = useSpecials();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newSpecial = {
            title,
            description,
            endDate,
            startDate: new Date().toISOString().split('T')[0],
            image: `https://picsum.photos/seed/${title}/800/600`,
        };
        addSpecial(newSpecial);
        setTitle('');
        setDescription('');
        setEndDate('');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-dark mb-8">Admin: Manage Specials</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-brand-dark mb-6">Add New Special</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-3 border border-gray-300 rounded-md" required/>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={3} className="w-full p-3 border border-gray-300 rounded-md" required></textarea>
                        <div>
                            <label className="block text-sm font-medium">End Date</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-md" required/>
                        </div>
                        <button type="submit" className="w-full bg-brand-orange text-white p-3 rounded-md font-semibold hover:bg-orange-600">Add Special</button>
                    </form>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-brand-dark mb-6">Current Specials List</h2>
                    <ul className="space-y-4 max-h-96 overflow-y-auto">
                        {specials.map(s => (
                            <li key={s.id} className="flex justify-between items-center p-3 border rounded-md">
                                <span>{s.title}</span>
                                <button onClick={() => removeSpecial(s.id)} className="text-red-500 hover:text-red-700 font-semibold">Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const AdminProductsPage: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory } = useProducts();
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);

    // TODO: Add modal forms for add/edit operations
    const handleAddCategory = () => {
        const name = prompt("Enter new category name:");
        if (name) {
            addCategory({ name, description: "New Description", image: "https://picsum.photos/seed/tools/800/600" });
        }
    };
    
    const handleAddSubcategory = (catId: number) => {
        const name = prompt("Enter new subcategory name:");
        if(name) {
            addSubcategory(catId, { name, description: "Sub Description", image: "https://picsum.photos/seed/hardware/800/600" });
        }
    };


    if (selectedCategory) {
        return (
             <div>
                <button onClick={() => setSelectedCategory(null)} className="mb-4 text-brand-green hover:underline font-semibold">&larr; Back to All Categories</button>
                <h1 className="text-3xl font-bold text-brand-dark mb-8">Manage: {selectedCategory.name}</h1>
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-brand-dark">Subcategories</h2>
                         <button onClick={() => handleAddSubcategory(selectedCategory.id)} className="bg-brand-green text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 flex items-center"><PlusIcon /> Add Subcategory</button>
                    </div>
                     <ul className="space-y-3">
                        {selectedCategory.subcategories.map(sub => (
                            <li key={sub.id} className="flex justify-between items-center p-3 border rounded-md bg-gray-50">
                                <span className="font-semibold">{sub.name}</span>
                                <div className="flex space-x-2">
                                     <button className="text-gray-500 hover:text-blue-600"><PencilIcon/></button>
                                     <button onClick={() => deleteSubcategory(selectedCategory.id, sub.id)} className="text-gray-500 hover:text-red-600"><TrashIcon/></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-brand-dark mb-8">Admin: Manage Products</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-dark">Main Categories</h2>
                    <button onClick={handleAddCategory} className="bg-brand-orange text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-600 flex items-center"><PlusIcon/> Add Category</button>
                </div>
                <ul className="space-y-4">
                    {categories.map(cat => (
                        <li key={cat.id} className="p-4 border rounded-md flex justify-between items-center">
                            <div>
                                <p className="font-bold text-lg">{cat.name}</p>
                                <p className="text-sm text-gray-500">{cat.subcategories.length} subcategories</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setSelectedCategory(cat)} className="text-sm bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300">Manage</button>
                                <button className="text-gray-500 hover:text-blue-600"><PencilIcon/></button>
                                <button onClick={() => deleteCategory(cat.id)} className="text-gray-500 hover:text-red-600"><TrashIcon/></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


// --- APP ---
const App: React.FC = () => {
  return (
    <AuthProvider>
      <SpecialsProvider>
        <ProductsProvider>
            <HashRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:categoryName" element={<CategoryPage />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
                        <Route path="/admin/specials" element={<AdminLayout><AdminSpecialsPage /></AdminLayout>} />
                        <Route path="/admin/products" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
                    </Routes>
                </Layout>
            </HashRouter>
        </ProductsProvider>
      </SpecialsProvider>
    </AuthProvider>
  );
};

export default App;
