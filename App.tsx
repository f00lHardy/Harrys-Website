

import React, { useState, createContext, useContext, useMemo, useCallback, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, useNavigate, useParams, Outlet, useLocation } from 'react-router-dom';
import type { Special, ProductCategory, Subcategory, GalleryItem, User, SessionUser, GasOption } from './types';
import { BUSINESS_INFO, INITIAL_PRODUCT_CATEGORIES, INITIAL_GALLERY_ITEMS, INITIAL_SPECIALS, INITIAL_GAS_OPTIONS } from './constants';

// --- ICONS ---
const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> );
const XIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> );
const WhatsAppIcon = ({className = "h-5 w-5"}: {className?: string}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.908 6.161l-1.317 4.831 4.92-1.307z"/></svg> );
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>;
const PrintIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v4m14 0a2 2 0 01-2 2H7a2 2 0 01-2-2m0 0V5" /></svg>;
const HomeIcon = ({className="w-5 h-5"} : {className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const UsersIcon = ({className="w-5 h-5"} : {className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0110 14.01a5 5 0 01-2.5-1.33A6.97 6.97 0 006 16c0 .34.024.673.07 1h6.86zM6 16a7 7 0 00-5.93 4h17.86A7 7 0 0014 16h-2a5 5 0 01-4 0H6z" /></svg>;
const TagIcon = ({className="w-5 h-5"} : {className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h5a.997.997 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const CollectionIcon = ({className="w-5 h-5"} : {className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>;
const CogIcon = ({className="w-5 h-5"} : {className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const DollarIcon = ({className="w-5 h-5"} : {className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M8.433 7.418c.158-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-.567-.267C8.07 8.488 8 8.731 8 9c0 .269.07.512.433.582.221.07.409.164.567.267v1.698c-.221.07-.409.164-.567.267C8.07 11.512 8 11.731 8 12c0 .269.07.512.433.582.221.07.409.164.567.267v1.698c-1.133-.29-2-1.232-2-2.582 0-.696.22-1.332.607-1.848a.91.91 0 01-.112-.434c0-.497.404-.9.9-.9.212 0 .41.074.567.203z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v1.076a4.5 4.5 0 00-1.558 1.522c-.46-.353-.945-.63-1.442-.828A1 1 0 006 6.076v1.846a1 1 0 001.29.948 4.505 4.505 0 002.26 2.261 1 1 0 00.949 1.29v1.846a1 1 0 102 0v-1.846a1 1 0 00-.949-1.29 4.505 4.505 0 00-2.26-2.261 1 1 0 00-1.29-.948V5z" clipRule="evenodd" /></svg>;
const PhotoIcon = ({className="w-5 h-5"} : {className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>;
const EyeIcon = ({className="w-5 h-5"} : {className?:string}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// --- HELPER FUNCTIONS ---
const generateKeywords = (text: string): string[] => {
    if (!text) return [];
    return text.toLowerCase().split(' ').filter(word => word.length > 3);
};

// --- IMAGE FALLBACK COMPONENT ---
const ImageWithFallback = ({ src, alt, className, keywords = [] }: { src: string; alt: string; className: string; keywords?: string[] }) => {
    const [currentSrc, setCurrentSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    
    // This ref helps us know if we are on the primary or fallback src attempt
    const isFallbackAttempt = useRef(false);

    useEffect(() => {
        // Reset state when the src prop changes
        setCurrentSrc(src);
        setIsLoading(true);
        setHasError(false);
        isFallbackAttempt.current = false;
    }, [src]);

    const handleError = () => {
        if (!isFallbackAttempt.current) {
            // Primary image failed, switch to fallback
            isFallbackAttempt.current = true;
            const searchTerms = [...keywords, ...generateKeywords(alt)].filter((v, i, a) => a.indexOf(v) === i && v).join(',');
            const fallbackUrl = `https://source.unsplash.com/featured/800x600?${searchTerms || 'hardware,tools'}&sig=${Date.now()}`;
            setCurrentSrc(fallbackUrl);
        } else {
            // Fallback image also failed, show final placeholder
            setHasError(true);
            setIsLoading(false);
        }
    };

    if (hasError) {
        return (
            <div className={`${className} bg-gray-200 flex items-center justify-center text-gray-500`}>
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <p className="mt-2 text-sm font-medium">Image Not Found</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className} bg-gray-200 overflow-hidden`}>
            {isLoading && <div className="shimmer-bg absolute inset-0"></div>}
            <img
                // Use a key to force React to re-mount the img element when the src changes.
                // This can help avoid issues with onError firing unexpectedly on fast re-renders.
                key={currentSrc} 
                src={currentSrc}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                onError={handleError}
            />
        </div>
    );
};


// --- MOCK API / LOCAL STORAGE ---
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => {
    try {
      const storedItem = window.localStorage.getItem(key);
      return storedItem ? JSON.parse(storedItem) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, state]);

  return [state, setState];
};

// --- AUTH CONTEXT ---
interface AuthContextType {
  currentUser: SessionUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (user: Omit<User, 'id' | 'points'>) => User | null;
  updateUser: (user: SessionUser) => void;
  updateUserPoints: (userId: number, points: number) => void;
  users: User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const [currentUser, setCurrentUser] = useLocalStorage<SessionUser | null>('currentUser', null);

  const login = (email: string, password: string): boolean => {
    if (email === 'admin@harryshardware.co.za' && password === '3196') {
      const adminUser: SessionUser = {
        id: 0,
        fullName: 'Admin',
        cellNumber: 'N/A',
        email: 'admin@harryshardware.co.za',
        deliveryAddress: 'N/A',
        points: 9999,
      };
      setCurrentUser(adminUser);
      return true;
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...sessionUser } = user;
      setCurrentUser(sessionUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (user: Omit<User, 'id' | 'points'>): User | null => {
    if (users.some(u => u.email === user.email)) {
      return null;
    }
    const newUser: User = { 
      ...user, 
      id: Date.now(), 
      points: Math.floor(Math.random() * 200) + 50
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    
    // Log in the new user immediately
    const { password: _, ...sessionUser } = newUser;
    setCurrentUser(sessionUser);

    return newUser;
  };
  
  const updateUser = (updatedUser: SessionUser) => {
    if(!currentUser) return;
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    setCurrentUser(updatedUser);
  };

  const updateUserPoints = (userId: number, points: number) => {
      setUsers(prevUsers => prevUsers.map(u => u.id === userId ? {...u, points} : u));
  };

  const value = { currentUser, login, logout, register, updateUser, users, updateUserPoints };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// --- APP STATE CONTEXT ---
interface AppState {
  specials: Special[];
  setSpecials: (specials: Special[] | ((val: Special[]) => Special[])) => void;
  productCategories: ProductCategory[];
  setProductCategories: (categories: ProductCategory[] | ((val: ProductCategory[]) => ProductCategory[])) => void;
  loyaltySystem: 'points' | 'discount';
  setLoyaltySystem: (system: 'points' | 'discount') => void;
  gasOptions: GasOption[];
  setGasOptions: (options: GasOption[] | ((val: GasOption[]) => GasOption[])) => void;
  galleryItems: GalleryItem[];
  setGalleryItems: (items: GalleryItem[] | ((val: GalleryItem[]) => GalleryItem[])) => void;
}

const AppStateContext = createContext<AppState | null>(null);

const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [specials, setSpecials] = useLocalStorage<Special[]>('specials', INITIAL_SPECIALS);
    const [productCategories, setProductCategories] = useLocalStorage<ProductCategory[]>('productCategories', INITIAL_PRODUCT_CATEGORIES);
    const [galleryItems, setGalleryItems] = useLocalStorage<GalleryItem[]>('galleryItems', INITIAL_GALLERY_ITEMS);
    const [loyaltySystem, setLoyaltySystem] = useLocalStorage<'points' | 'discount'>('loyaltySystem', 'points');
    const [gasOptions, setGasOptions] = useLocalStorage<GasOption[]>('gasOptions', INITIAL_GAS_OPTIONS);


    const value = { 
        specials, 
        setSpecials,
        productCategories,
        setProductCategories,
        loyaltySystem,
        setLoyaltySystem,
        gasOptions,
        setGasOptions,
        galleryItems,
        setGalleryItems,
    };
    return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

const useAppState = () => {
    const context = useContext(AppStateContext);
    if(!context) throw new Error('useAppState must be used within an AppStateProvider');
    return context;
}

// --- LAYOUT COMPONENTS ---
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

const MainLayout = () => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow"><Outlet /></main>
        <Footer />
        <WhatsAppButton />
    </div>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();
  const navLinks = [
    { path: "/", label: "Home" }, { path: "/about", label: "About" },
    { path: "/products", label: "Products" }, { path: "/gallery", label: "Gallery" },
    { path: "/contact", label: "Contact" },
  ];
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 no-print">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-36">
          <Link to="/" className="flex-shrink-0"><img src="https://raw.githubusercontent.com/f00lHardy/Harrys-Website/main/Harry's%20Hardware%20Logo%20v1.png" alt="Harry's Hardware Logo" className="h-32" /></Link>
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => ( <NavLink key={link.path} to={link.path} className={({ isActive }) => `text-gray-600 hover:text-brand-orange transition-colors duration-200 text-lg font-medium pb-1 border-b-2 ${isActive ? 'border-brand-orange text-brand-orange' : 'border-transparent'}`}>{link.label}</NavLink>))}
          </nav>
          <div className="hidden md:flex items-center">
             <Link to={currentUser ? "/dashboard" : "/auth"} className="bg-brand-orange text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-opacity-90 transition-colors duration-200">{currentUser ? "Dashboard" : "Login / Register"}</Link>
          </div>
          <div className="md:hidden flex items-center"><button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-brand-orange">{isOpen ? <XIcon /> : <MenuIcon />}</button></div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (<NavLink key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-orange-50 text-brand-orange' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-orange'}`}>{link.label}</NavLink>))}
            <Link to={currentUser ? "/dashboard" : "/auth"} onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-3 rounded-md text-base font-medium bg-brand-orange text-white hover:bg-opacity-90 mt-2">{currentUser ? "Dashboard" : "Login / Register"}</Link>
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
    <footer className="bg-brand-dark text-white no-print">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div><h3 className="text-lg font-semibold text-brand-orange mb-4">Harry's Hardware</h3><p className="text-gray-300">{BUSINESS_INFO.slogan}</p></div>
                <div><h3 className="text-lg font-semibold mb-4">Quick Links</h3><ul className="space-y-2"><li><Link to="/" className="text-gray-300 hover:text-brand-orange">Home</Link></li><li><Link to="/products" className="text-gray-300 hover:text-brand-orange">Products</Link></li><li><Link to="/about" className="text-gray-300 hover:text-brand-orange">About Us</Link></li><li><Link to="/contact" className="text-gray-300 hover:text-brand-orange">Contact</Link></li></ul></div>
                <div><h3 className="text-lg font-semibold mb-4">Contact Us</h3><ul className="space-y-2 text-gray-300"><li>{BUSINESS_INFO.address}</li><li>Phone: {BUSINESS_INFO.phone}</li><li>Email: {BUSINESS_INFO.email}</li></ul></div>
                <div><h3 className="text-lg font-semibold mb-4">Trading Hours</h3><ul className="space-y-2 text-gray-300">{BUSINESS_INFO.hours.map(h => <li key={h.day}><strong>{h.day}:</strong> {h.time}</li>)}</ul></div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400"><p>&copy; {new Date().getFullYear()} {BUSINESS_INFO.name}. All Rights Reserved.</p><div className="mt-4 text-xs"><Link to="/admin-login" className="hover:text-brand-orange transition-colors">Admin Login</Link></div></div>
        </div>
    </footer>
);

const WhatsAppButton = () => (<a href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=Hello%20Harry's%20Hardware,%20I%20have%20a%20question.`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-brand-green text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-transform hover:scale-110 flex items-center z-50 no-print" aria-label="Chat on WhatsApp"><WhatsAppIcon className="h-6 w-6"/></a>);

const Breadcrumbs = ({ crumbs }: { crumbs: { name: string, path?: string }[] }) => (
    <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
            <li className="flex items-center"><Link to="/" className="text-gray-500 hover:text-brand-orange">Home</Link>{crumbs.length > 0 && <ChevronRightIcon />}</li>
            {crumbs.map((crumb, index) => (<li key={index} className="flex items-center">{crumb.path && index < crumbs.length - 1 ? (<Link to={crumb.path} className="text-gray-500 hover:text-brand-orange">{crumb.name}</Link>) : (<span className="text-gray-700 font-medium">{crumb.name}</span>)}{index < crumbs.length - 1 && <ChevronRightIcon />}</li>))}
        </ol>
    </nav>
);

// --- PAGE COMPONENTS ---

const GasDeliverySection = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { gasOptions } = useAppState();
    
    const handleOrderClick = () => { navigate(currentUser ? '/gas-order' : '/auth'); };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-brand-dark mb-4 text-center">Gas Delivery</h3>
            <div className="space-y-4">
                {gasOptions.map(option => (
                    <div key={option.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                            <ImageWithFallback src={option.image} alt={option.name} className="w-12 h-12 object-contain mr-4" keywords={['gas', 'cylinder']}/>
                            <div>
                                <p className="font-semibold">{option.name}</p>
                                <p className="text-brand-green">R{option.price.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleOrderClick} className="mt-6 w-full bg-brand-orange text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-90 transition-colors">Place Gas Order</button>
            <p className="text-xs text-center text-gray-500 mt-2">{currentUser ? "Proceed to order page" : "Login or register to order"}</p>
        </div>
    );
};

const ProjectCalculator = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-brand-green text-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-3">Project Calculator</h3>
            <p className="mb-4">Need help estimating materials for your next project? We can help!</p>
            <button onClick={() => navigate('/calculator')} className="bg-white text-brand-green font-bold py-2 px-6 rounded-lg hover:bg-gray-200 transition-colors">Get an Estimate</button>
        </div>
    );
};

const HomePage = () => {
  const { specials } = useAppState();
  const navigate = useNavigate();
  const activeSpecials = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return specials.filter((s: Special) => {
      const endDate = new Date(s.endDate); endDate.setHours(23, 59, 59, 999);
      return endDate >= today;
    });
  }, [specials]);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="relative rounded-lg shadow-xl overflow-hidden h-[60vh] min-h-[450px] flex items-center justify-center text-center p-6">
            <ImageWithFallback 
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1920&auto=format=fit=crop"
                alt="Tools hanging on a hardware store wall"
                className="absolute inset-0 w-full h-full"
                keywords={['hardware', 'store', 'tools', 'workshop']}
            />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Welcome to {BUSINESS_INFO.name}</h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">{BUSINESS_INFO.slogan}</p>
            <div className="space-x-4">
              <button onClick={() => navigate('/products')} className="bg-brand-orange text-white py-3 px-8 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-transform hover:scale-105">Shop Products</button>
              <button onClick={() => navigate('/contact')} className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-lg font-semibold text-lg hover:bg-white hover:text-brand-dark transition-colors">Get a Quote</button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-8 text-center sm:text-left">Current Specials</h2>
            {activeSpecials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {activeSpecials.map((special) => (
                  <div key={special.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                    <ImageWithFallback src={special.image} alt={special.title} className="w-full h-56" keywords={generateKeywords(special.title)} />
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold mb-2">{special.title}</h3>
                      <p className="text-gray-600 mb-4 flex-grow">{special.description}</p>
                      {special.price && <p className="text-lg text-brand-orange font-bold mb-2">{special.price}</p>}
                      <p className="text-sm text-brand-green font-medium">Valid until: {new Date(special.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (<p className="text-center text-gray-600">No specials currently available. Check back soon!</p>)}
          </div>
          <div className="lg:col-span-1 space-y-12"><GasDeliverySection /><ProjectCalculator /></div>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => (
    <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
             <Breadcrumbs crumbs={[{ name: 'About Us' }]} />
            <h1 className="text-4xl font-bold text-center mb-12">About Harry's Hardware</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="rounded-lg shadow-xl overflow-hidden">
                    <ImageWithFallback src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format=fit=crop" alt="Inside Harry's Hardware" className="w-full h-full" keywords={['hardware', 'store', 'aisle']} />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold text-brand-dark mb-4">Your Trusted Local Partner Since 2005</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">Harry's Hardware has been proudly serving the Broederstroom community and surrounding areas for over 15 years. What started as a small family-run shop has grown into a cornerstone of the community, known for our expert advice, friendly service, and comprehensive range of products.</p>
                    <p className="text-gray-700 leading-relaxed mb-4">Our mission is simple: to provide our customers with the best quality products at fair prices, backed by knowledge and service you can rely on. Whether you're a seasoned contractor or a weekend DIY enthusiast, we're here to help you get the job done right.</p>
                     <p className="text-gray-700 leading-relaxed">We believe in building relationships, not just selling products. Come on down and experience the Harry's Hardware difference!</p>
                </div>
            </div>
        </div>
    </div>
);

const ProductsPage = () => {
  const { productCategories } = useAppState();
  const { categoryId, subcategoryId } = useParams();
  const navigate = useNavigate();
  const selectedCategory = useMemo(() => productCategories.find(c => c.id === Number(categoryId)), [productCategories, categoryId]);
  const selectedSubcategory = useMemo(() => selectedCategory?.subcategories.find(sc => sc.id === Number(subcategoryId)), [selectedCategory, subcategoryId]);

  const crumbs: { name: string; path?: string }[] = [{ name: 'Products', path: '/products' }];
  if (selectedCategory) crumbs.push({ name: selectedCategory.name, path: `/products/${selectedCategory.id}` });
  if (selectedSubcategory) crumbs.push({ name: selectedSubcategory.name });

  const CategoryList = () => (<div><h2 className="text-3xl font-bold mb-8 text-brand-orange">Product Categories</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">{productCategories.map(category => (<div key={category.id} onClick={() => navigate(`/products/${category.id}`)} className="group cursor-pointer"><div className="overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"><ImageWithFallback src={category.image} alt={category.name} className="w-full h-48 group-hover:scale-105 transition-transform duration-300" keywords={generateKeywords(category.name)} /></div><h3 className="text-lg font-semibold mt-4 text-center group-hover:text-brand-orange transition-colors">{category.name}</h3></div>))}</div></div>);
  const SubcategoryList = ({ category }: { category: ProductCategory }) => (<div><h2 className="text-3xl font-bold mb-2 text-brand-orange">{category.name}</h2><p className="text-lg text-gray-600 mb-8">{category.description}</p><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">{category.subcategories.map(subcategory => (<div key={subcategory.id} onClick={() => navigate(`/products/${category.id}/${subcategory.id}`)} className="group cursor-pointer"><div className="overflow-hidden rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"><ImageWithFallback src={subcategory.image} alt={subcategory.name} className="w-full h-48 group-hover:scale-105 transition-transform duration-300" keywords={generateKeywords(subcategory.name)} /></div><h3 className="text-lg font-semibold mt-4 text-center group-hover:text-brand-orange transition-colors">{subcategory.name}</h3></div>))}</div></div>);
  const SubcategoryDetail = ({ subcategory }: { subcategory: Subcategory }) => (<div><h2 className="text-3xl font-bold mb-2 text-brand-orange">{subcategory.name}</h2><p className="text-lg text-gray-600 mb-8">{subcategory.description}</p><div className="bg-gray-100 p-8 rounded-lg text-center"><p className="text-xl">For specific product information, pricing, and availability, please contact us.</p><button onClick={() => navigate('/quote')} className="mt-6 bg-brand-orange text-white py-3 px-8 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-transform hover:scale-105">Request a Quote</button></div></div>);

  return (
    <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <Breadcrumbs crumbs={crumbs} />
                {selectedSubcategory ? <SubcategoryDetail subcategory={selectedSubcategory} /> : selectedCategory ? <SubcategoryList category={selectedCategory} /> : <CategoryList />}
            </div>
        </div>
    </div>
  );
};

const GalleryPage = () => {
    const { galleryItems } = useAppState();
    const [filter, setFilter] = useState<'all' | 'store' | 'staff' | 'products' | 'brands'>('all');
    const filteredItems = useMemo(() => filter === 'all' ? galleryItems : galleryItems.filter(item => item.category === filter), [filter, galleryItems]);
    const filters: { key: typeof filter; label: string }[] = [{ key: 'all', label: 'All' }, { key: 'store', label: 'Our Store' }, { key: 'staff', label: 'Our Staff' }, { key: 'products', label: 'Our Products' }, { key: 'brands', label: 'Top Brands' }];
    return (
        <div className="bg-white"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10"><Breadcrumbs crumbs={[{ name: 'Gallery' }]} /><h1 className="text-4xl font-bold text-center mb-8">Gallery</h1><div className="flex justify-center mb-8 space-x-2 sm:space-x-4">{filters.map(f => (<button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f.key ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{f.label}</button>))}</div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{filteredItems.map((item) => (<div key={item.id} className="overflow-hidden rounded-lg shadow-lg"><ImageWithFallback src={item.src} alt={item.alt} className="w-full h-64 transform hover:scale-105 transition-transform duration-300" keywords={[item.category, ...generateKeywords(item.alt)]} /></div>))}</div></div></div>
    );
};

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); console.log("Form submitted:", formData); setSubmitted(true); };
    return (
        <div className="bg-white"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"><Breadcrumbs crumbs={[{ name: 'Contact Us' }]} /><h1 className="text-4xl font-bold text-center mb-12">Get In Touch</h1>{submitted ? (<div className="text-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg" role="alert"><strong className="font-bold">Thank you!</strong><span className="block sm:inline"> Your message has been sent successfully. We'll get back to you soon.</span></div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-16"><form onSubmit={handleSubmit} className="space-y-6"><div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" name="name" id="name" required onChange={handleChange} value={formData.name} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange"/></div><div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" name="email" id="email" required onChange={handleChange} value={formData.email} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange"/></div><div><label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label><input type="tel" name="phone" id="phone" onChange={handleChange} value={formData.phone} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange"/></div><div><label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label><input type="text" name="subject" id="subject" required onChange={handleChange} value={formData.subject} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange"/></div><div><label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label><textarea name="message" id="message" rows={4} required onChange={handleChange} value={formData.message} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-orange focus:border-brand-orange"></textarea></div><div><button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-brand-orange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange">Send Message</button></div></form><div><h3 className="text-2xl font-semibold mb-6">Our Location</h3><div className="space-y-4 text-gray-700"><p><strong>Address:</strong> {BUSINESS_INFO.address}</p><p><strong>Phone:</strong> {BUSINESS_INFO.phone}</p><p><strong>Email:</strong> {BUSINESS_INFO.email}</p></div><h3 className="text-2xl font-semibold mt-8 mb-4">Trading Hours</h3><ul className="space-y-2 text-gray-700">{BUSINESS_INFO.hours.map(h => <li key={h.day}><strong>{h.day}:</strong> {h.time}</li>)}</ul><div className="mt-8"><iframe src={BUSINESS_INFO.mapUrl} width="100%" height="300" style={{border:0}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="rounded-lg shadow-md"></iframe></div></div></div>)}</div></div>
    );
};

const ProjectCalculatorPage = () => {
    type CalculatorType = 'paint' | 'bricks' | 'slabs' | 'plastering';
    const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('paint');

    const CalculatorTab = ({ type, label }: { type: CalculatorType; label: string }) => (
        <button
            onClick={() => setActiveCalculator(type)}
            className={`px-6 py-3 font-semibold rounded-t-lg transition-colors ${
                activeCalculator === type
                    ? 'bg-white text-brand-orange'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
            {label}
        </button>
    );

    const PaintCalculator = () => {
        const [inputs, setInputs] = useState({ height: '', width: '', coats: '2', excludeArea: '0' });
        const [result, setResult] = useState<string | null>(null);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputs({ ...inputs, [e.target.name]: e.target.value });
        };
        
        const calculate = (e: React.FormEvent) => {
            e.preventDefault();
            const { height, width, coats, excludeArea } = inputs;
            const h = parseFloat(height);
            const w = parseFloat(width);
            const c = parseInt(coats, 10);
            const ex = parseFloat(excludeArea);
            
            if (isNaN(h) || isNaN(w) || isNaN(c) || isNaN(ex) || h <= 0 || w <= 0 || c <= 0) {
                setResult("Please enter valid positive numbers for all fields.");
                return;
            }

            const totalArea = (h * w) - ex;
            if (totalArea <= 0) {
                setResult("The area to be painted must be positive.");
                return;
            }
            
            const coveragePerLitre = 10; // m^2 per litre
            const totalLitres = (totalArea * c) / coveragePerLitre;
            
            const fiveLitreCans = Math.ceil(totalLitres / 5);
            
            setResult(`You will need approximately **${totalLitres.toFixed(2)} litres** of paint. We recommend purchasing **${fiveLitreCans} x 5L cans** to complete your project.`);
        };

        return (
            <div className="p-8 bg-white rounded-b-lg rounded-r-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-brand-dark">Paint Estimator</h2>
                <form onSubmit={calculate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium">Wall Height (meters)</label><input type="number" name="height" value={inputs.height} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., 2.5" /></div>
                        <div><label className="block text-sm font-medium">Wall Width (meters)</label><input type="number" name="width" value={inputs.width} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., 4" /></div>
                        <div><label className="block text-sm font-medium">Number of Coats</label><input type="number" name="coats" value={inputs.coats} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" min="1" /></div>
                        <div><label className="block text-sm font-medium">Area to Exclude (m²)</label><input type="number" name="excludeArea" value={inputs.excludeArea} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" placeholder="For doors, windows, etc." /></div>
                    </div>
                    <button type="submit" className="w-full bg-brand-orange text-white py-2 px-4 rounded-md font-semibold hover:bg-opacity-90">Calculate Paint Needed</button>
                </form>
                {result && <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg"><p className="text-green-800" dangerouslySetInnerHTML={{ __html: result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></div>}
            </div>
        );
    };

    const BricksCalculator = () => {
        const [inputs, setInputs] = useState({ height: '', length: '', type: 'single' });
        const [result, setResult] = useState<string | null>(null);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setInputs({ ...inputs, [e.target.name]: e.target.value });
        };

        const calculate = (e: React.FormEvent) => {
            e.preventDefault();
            const h = parseFloat(inputs.height);
            const l = parseFloat(inputs.length);

            if (isNaN(h) || isNaN(l) || h <= 0 || l <= 0) {
                setResult("Please enter valid positive numbers for height and length.");
                return;
            }

            const bricksPerSqM = inputs.type === 'single' ? 55 : 110;
            const totalArea = h * l;
            const totalBricks = Math.ceil(totalArea * bricksPerSqM);
            setResult(`For a **${totalArea.toFixed(2)} m²** wall, you will need approximately **${totalBricks.toLocaleString()}** bricks.`);
        };
        
        return (
            <div className="p-8 bg-white rounded-b-lg rounded-r-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-brand-dark">Brick Estimator</h2>
                <form onSubmit={calculate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className="block text-sm font-medium">Wall Height (meters)</label><input type="number" name="height" value={inputs.height} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., 2.5" /></div>
                        <div><label className="block text-sm font-medium">Wall Length (meters)</label><input type="number" name="length" value={inputs.length} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., 10" /></div>
                        <div><label className="block text-sm font-medium">Wall Type</label><select name="type" value={inputs.type} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md bg-white"><option value="single">Single Brick</option><option value="double">Double Brick</option></select></div>
                    </div>
                    <button type="submit" className="w-full bg-brand-orange text-white py-2 px-4 rounded-md font-semibold hover:bg-opacity-90">Calculate Bricks Needed</button>
                </form>
                {result && <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg"><p className="text-green-800" dangerouslySetInnerHTML={{ __html: result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></div>}
            </div>
        );
    };

    const SlabsCalculator = () => {
        const [inputs, setInputs] = useState({ length: '', width: '', thickness: '100' });
        const [result, setResult] = useState<{ volume: string; materials: string[] } | string | null>(null);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputs({ ...inputs, [e.target.name]: e.target.value });
        };
        
        const calculate = (e: React.FormEvent) => {
            e.preventDefault();
            const l = parseFloat(inputs.length);
            const w = parseFloat(inputs.width);
            const t = parseFloat(inputs.thickness);
            
            if (isNaN(l) || isNaN(w) || isNaN(t) || l <= 0 || w <= 0 || t <= 0) {
                setResult("Please enter valid positive numbers for all fields.");
                return;
            }

            const volume = l * w * (t / 1000); // in cubic meters
            
            // Typical ratios for 1 m^3 of concrete
            const cementBagsPerM3 = 7;
            const sandPerM3 = 0.5; // m^3
            const stonePerM3 = 0.75; // m^3

            const totalCementBags = Math.ceil(volume * cementBagsPerM3);
            const totalSand = (volume * sandPerM3).toFixed(2);
            const totalStone = (volume * stonePerM3).toFixed(2);

            setResult({
                volume: `You will need **${volume.toFixed(2)} m³** of concrete.`,
                materials: [
                    `**${totalCementBags}** bags of cement (50kg)`,
                    `**${totalSand} m³** of sand`,
                    `**${totalStone} m³** of stone (19mm)`
                ]
            });
        };

        return (
            <div className="p-8 bg-white rounded-b-lg rounded-r-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-brand-dark">Concrete Slab Estimator</h2>
                <form onSubmit={calculate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div><label className="block text-sm font-medium">Slab Length (meters)</label><input type="number" name="length" value={inputs.length} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., 5" /></div>
                         <div><label className="block text-sm font-medium">Slab Width (meters)</label><input type="number" name="width" value={inputs.width} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., 4" /></div>
                         <div><label className="block text-sm font-medium">Slab Thickness (mm)</label><input type="number" name="thickness" value={inputs.thickness} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., 100" /></div>
                    </div>
                    <button type="submit" className="w-full bg-brand-orange text-white py-2 px-4 rounded-md font-semibold hover:bg-opacity-90">Calculate Concrete Needed</button>
                </form>
                {result && (
                    <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                        {typeof result === 'string' ? (
                            <p className="text-red-800">{result}</p>
                        ) : (
                            <>
                                <p className="text-green-800 mb-2" dangerouslySetInnerHTML={{ __html: result.volume.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                <p className="text-green-800 font-semibold">This requires approximately:</p>
                                <ul className="list-disc pl-5 mt-1 text-green-800">
                                    {result.materials.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />)}
                                </ul>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const PlasteringCalculator = () => {
        const [inputs, setInputs] = useState({ height: '', length: '', thickness: '15', excludeArea: '0' });
        const [result, setResult] = useState<{ volume: string; materials: string[] } | string | null>(null);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputs({ ...inputs, [e.target.name]: e.target.value });
        };
        
        const calculate = (e: React.FormEvent) => {
            e.preventDefault();
            const { height, length, thickness, excludeArea } = inputs;
            const h = parseFloat(height);
            const l = parseFloat(length);
            const t = parseFloat(thickness);
            const ex = parseFloat(excludeArea);
            
            if (isNaN(h) || isNaN(l) || isNaN(t) || isNaN(ex) || h <= 0 || l <= 0 || t <= 0) {
                setResult("Please enter valid positive numbers for all fields.");
                return;
            }

            const totalArea = (h * l) - ex;
            if (totalArea <= 0) {
                setResult("The area to be plastered must be positive.");
                return;
            }
            
            const plasterVolume = totalArea * (t / 1000); // in cubic meters

            // Based on a 1:4 mix ratio, requiring ~9 bags of cement and 1.2m³ of sand per m³ of plaster
            const cementBagsPerM3 = 9;
            const sandPerM3 = 1.2;

            const totalCementBags = Math.ceil(plasterVolume * cementBagsPerM3);
            const totalSand = (plasterVolume * sandPerM3).toFixed(2);

            setResult({
                volume: `For a **${totalArea.toFixed(2)} m²** area at **${t} mm** thick, you'll need approx. **${plasterVolume.toFixed(3)} m³** of plaster.`,
                materials: [
                    `**${totalCementBags}** bags of cement (50kg)`,
                    `**${totalSand} m³** of plastering sand`
                ]
            });
        };

        return (
            <div className="p-8 bg-white rounded-b-lg rounded-r-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-brand-dark">Plastering Estimator</h2>
                <form onSubmit={calculate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium">Wall Height (meters)</label><input type="number" name="height" value={inputs.height} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., 2.5" /></div>
                        <div><label className="block text-sm font-medium">Wall Length (meters)</label><input type="number" name="length" value={inputs.length} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., 10" /></div>
                        <div><label className="block text-sm font-medium">Plaster Thickness (mm)</label><input type="number" name="thickness" value={inputs.thickness} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" min="1" /></div>
                        <div><label className="block text-sm font-medium">Area to Exclude (m²)</label><input type="number" name="excludeArea" value={inputs.excludeArea} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md" placeholder="For doors, windows, etc." /></div>
                    </div>
                    <button type="submit" className="w-full bg-brand-orange text-white py-2 px-4 rounded-md font-semibold hover:bg-opacity-90">Calculate Plaster Needed</button>
                </form>
                {result && (
                    <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                        {typeof result === 'string' ? (
                            <p className="text-red-800">{result}</p>
                        ) : (
                            <>
                                <p className="text-green-800 mb-2" dangerouslySetInnerHTML={{ __html: result.volume.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                <p className="text-green-800 font-semibold">This requires approximately:</p>
                                <ul className="list-disc pl-5 mt-1 text-green-800">
                                    {result.materials.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />)}
                                </ul>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs crumbs={[{ name: 'Project Calculator' }]} />
                <h1 className="text-4xl font-bold text-center mb-8">Project Material Estimator</h1>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
                    Use our handy calculators to get a quick estimate for the materials required for your next project. Please note these are estimates and it's always best to consult with us for a precise quote.
                </p>

                <div className="flex justify-center">
                    <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
                        <CalculatorTab type="paint" label="Paint" />
                        <CalculatorTab type="bricks" label="Bricks" />
                        <CalculatorTab type="slabs" label="Concrete Slabs" />
                        <CalculatorTab type="plastering" label="Plastering" />
                    </div>
                </div>
                
                <div className="mt-4">
                    {activeCalculator === 'paint' && <PaintCalculator />}
                    {activeCalculator === 'bricks' && <BricksCalculator />}
                    {activeCalculator === 'slabs' && <SlabsCalculator />}
                    {activeCalculator === 'plastering' && <PlasteringCalculator />}
                </div>
            </div>
        </div>
    );
};

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', cellNumber: '', email: '', deliveryAddress: '', password: '', confirmPassword: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setError(''); setFormData({ ...formData, [e.target.name]: e.target.value }); };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); setError('');
        if (isLogin) {
            if (!login(formData.email, formData.password)) setError('Invalid email or password.'); else navigate('/dashboard');
        } else {
            if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
            const newUser = register({ fullName: formData.fullName, cellNumber: formData.cellNumber, email: formData.email, deliveryAddress: formData.deliveryAddress, password: formData.password });
            if (newUser) {
                setShowSuccessModal(true);
            } else {
                setError('User with this email already exists.');
            }
        }
    };
    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-center mb-6">{isLogin ? 'Login' : 'Register'}</h1>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (<><input name="fullName" type="text" placeholder="Full Name" required onChange={handleChange} className="w-full px-4 py-2 border rounded-md bg-white" /><input name="cellNumber" type="tel" placeholder="Cellphone Number" required onChange={handleChange} className="w-full px-4 py-2 border rounded-md bg-white" /><input name="deliveryAddress" type="text" placeholder="Delivery Address" required onChange={handleChange} className="w-full px-4 py-2 border rounded-md bg-white" /></>)}
                        <input name="email" type="email" placeholder="Email Address" required onChange={handleChange} className="w-full px-4 py-2 border rounded-md bg-white" />
                        <input name="password" type="password" placeholder="Password" required onChange={handleChange} className="w-full px-4 py-2 border rounded-md bg-white" />
                        {!isLogin && <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} className="w-full px-4 py-2 border rounded-md bg-white" />}
                        <button type="submit" className="w-full bg-brand-orange text-white py-3 rounded-md font-semibold hover:bg-opacity-90">{isLogin ? 'Login' : 'Create Account'}</button>
                    </form>
                    <p className="text-center mt-6">{isLogin ? "Don't have an account?" : 'Already have an account?'} <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-brand-orange font-semibold ml-2">{isLogin ? 'Register' : 'Login'}</button></p>
                </div>
            </div>
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="success-modal-title">
                    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full text-center">
                        <h2 id="success-modal-title" className="text-2xl font-bold text-brand-green mb-4">Account Created!</h2>
                        <p className="text-gray-700 mb-6">Welcome to Harry's Hardware! Your account has been successfully created.</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-brand-orange text-white py-3 rounded-md font-semibold hover:bg-opacity-90 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange"
                        >
                            Go to my Dashboard
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const AdminLoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); setError('');
        if (login('admin@harryshardware.co.za', password)) { navigate('/dashboard'); } else { setError('Incorrect password.'); }
    };
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center" style={{ minHeight: 'calc(100vh - 144px - 250px)' }}>
            <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center mb-6"><img src="https://raw.githubusercontent.com/f00lHardy/Harrys-Website/main/Harry's%20Hardware%20Logo%20v1.png" alt="Harry's Hardware Logo" className="h-24 mx-auto mb-4" /><h1 className="text-2xl font-bold">Admin Login</h1></div>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white" />
                    <button type="submit" className="w-full bg-brand-dark text-white py-3 rounded-md font-semibold hover:bg-opacity-90">Login</button>
                </form>
            </div>
        </div>
    );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => { if (!currentUser) { navigate('/auth', { replace: true, state: { from: location } }); } }, [currentUser, navigate, location]);
    return currentUser ? <>{children}</> : null;
};

const GasDashboardWidget = () => {
    const navigate = useNavigate();
    // In a real app, this data would come from an API
    const lastOrder = { status: 'Delivered', date: new Date(new Date().setDate(new Date().getDate() - 5)) };

    return (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Gas Delivery Service</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-gray-700">
                    <p className="font-semibold">Last Order Status:</p>
                    <p>{lastOrder.status} on {lastOrder.date.toLocaleDateString()}</p>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-brand-orange hover:underline mt-1 inline-block opacity-70 cursor-not-allowed" aria-disabled="true" title="Coming soon">
                        View Order History
                    </a>
                </div>
                <button 
                    onClick={() => navigate('/gas-order')} 
                    className="bg-brand-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-transform hover:scale-105 text-lg shadow-sm hover:shadow-md flex-shrink-0"
                >
                    Place New Order
                </button>
            </div>
        </div>
    );
};


const DashboardPage = () => {
    const { currentUser, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<SessionUser | null>(currentUser);
    useEffect(() => { setFormData(currentUser); }, [currentUser]);
    if (!currentUser || !formData) return null;
    const handleLogout = () => { logout(); navigate('/'); };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
    const handleSave = (e: React.FormEvent) => { e.preventDefault(); updateUser(formData); setIsEditing(false); };

    const isAdmin = currentUser.email === 'admin@harryshardware.co.za';

    return (
        <div className="bg-gray-50 min-h-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs crumbs={[{ name: 'Dashboard' }]} />
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                        <div><h1 className="text-3xl font-bold">Welcome, {currentUser.fullName}!</h1>
                        {!isAdmin && <p className="text-gray-600">This is your personal dashboard.</p>}
                        </div>
                        <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 mt-4 sm:mt-0">Logout</button>
                    </div>
                    
                    {isAdmin ? (
                        <AdminPanel />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2">
                                <GasDashboardWidget />
                            </div>
                            <div className="bg-brand-green text-white p-6 rounded-lg text-center">
                                <h2 className="text-2xl font-bold mb-2">Loyalty Points</h2>
                                <p className="text-5xl font-extrabold">{currentUser.points}</p>
                                <p className="mt-2">Redeem in-store for discounts!</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold">Account Details</h2>
                                    <button onClick={() => setIsEditing(!isEditing)} className="text-brand-orange hover:underline text-sm font-medium">{isEditing ? 'Cancel' : 'Edit'}</button>
                                </div>
                                {isEditing ? (
                                    <form onSubmit={handleSave} className="space-y-4">
                                        <div><label className="block text-sm font-medium">Full Name</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded-md"/></div>
                                        <div><label className="block text-sm font-medium">Cellphone</label><input type="text" name="cellNumber" value={formData.cellNumber} onChange={handleChange} className="w-full p-2 border rounded-md"/></div>
                                        <div><label className="block text-sm font-medium">Delivery Address</label><input type="text" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} className="w-full p-2 border rounded-md"/></div>
                                        <div className="flex justify-end"><button type="submit" className="bg-brand-orange text-white py-2 px-4 rounded-md hover:bg-opacity-90">Save Changes</button></div>
                                    </form>
                                ) : (
                                    <div className="space-y-2">
                                        <p><strong>Full Name:</strong> {currentUser.fullName}</p>
                                        <p><strong>Email:</strong> {currentUser.email}</p>
                                        <p><strong>Cellphone:</strong> {currentUser.cellNumber}</p>
                                        <p><strong>Delivery Address:</strong> {currentUser.deliveryAddress}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- ADMIN PANEL ---
type AdminView = 'dashboard' | 'customers' | 'specials' | 'products' | 'pricing' | 'gallery' | 'settings';
type EditItem = (Omit<ProductCategory, 'subcategories'> | Subcategory);

const AdminPanel = () => {
    const [view, setView] = useState<AdminView>('dashboard');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const navItems: { id: AdminView; label: string; icon: React.ReactNode }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
        { id: 'customers', label: 'Customers', icon: <UsersIcon /> },
        { id: 'specials', label: 'Specials', icon: <TagIcon /> },
        { id: 'products', label: 'Products', icon: <CollectionIcon /> },
        { id: 'gallery', label: 'Gallery', icon: <PhotoIcon /> },
        { id: 'pricing', label: 'Gas Pricing', icon: <DollarIcon /> },
        { id: 'settings', label: 'Settings', icon: <CogIcon /> },
    ];

    const renderView = () => {
        const props = { showToast };
        switch (view) {
            case 'dashboard': return <AdminDashboardView />;
            case 'customers': return <AdminCustomersView />;
            case 'specials': return <AdminSpecialsView {...props} />;
            case 'products': return <AdminProductsView {...props} />;
            case 'gallery': return <AdminGalleryView {...props} />;
            case 'pricing': return <AdminPriceManagementView {...props} />;
            case 'settings': return <AdminSettingsView />;
            default: return <AdminDashboardView />;
        }
    };

    return (
        <div className="relative">
             <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-64">
                     <nav className="flex flex-col space-y-1">
                        {navItems.map(item => (
                            <button key={item.id} onClick={() => setView(item.id)} className={`flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors text-sm font-medium ${view === item.id ? 'bg-brand-orange text-white shadow' : 'text-gray-600 hover:bg-orange-100 hover:text-brand-orange'}`}>
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
                <main className="flex-1 min-w-0">
                    <div className="bg-white p-6 rounded-lg shadow-inner border">
                        {renderView()}
                    </div>
                </main>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

// --- ADMIN VIEWS ---
const AdminDashboardView = () => {
    const { users } = useAuth();
    const { specials, productCategories } = useAppState();
    const stats = [
        { label: 'Total Customers', value: users.length },
        { label: 'Active Specials', value: specials.filter(s => new Date(s.endDate) >= new Date()).length },
        { label: 'Product Categories', value: productCategories.length },
        { label: 'Total Sales (Mock)', value: 'R12,345' },
    ];
    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Dashboard Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(stat => (
                    <div key={stat.label} className="bg-gray-100 p-4 rounded-lg text-center">
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold">Future Features</h4>
                <p className="text-sm text-gray-700">This dashboard can be expanded with sales charts, top products, and POS integration with backend support.</p>
            </div>
        </div>
    );
};

const AdminCustomersView = () => {
    const { users, updateUserPoints } = useAuth();
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [showWhatsappModal, setShowWhatsappModal] = useState(false);
    const [whatsappMessage, setWhatsappMessage] = useState('');
    
    const handleSelectUser = (id: number) => {
        setSelectedUsers(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
    };
    
    const handleSendBulkWhatsapp = () => {
        if (!whatsappMessage.trim()) { alert("Please enter a message."); return; }
        if (!window.confirm(`This will open ${selectedUsers.length} WhatsApp tabs. Continue?`)) return;

        selectedUsers.forEach(id => {
            const user = users.find(u => u.id === id);
            if (user && user.cellNumber) {
                const phone = user.cellNumber.startsWith('27') ? user.cellNumber : `27${user.cellNumber.substring(1)}`;
                const url = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;
                window.open(url, '_blank');
            }
        });
        setShowWhatsappModal(false);
        setWhatsappMessage('');
        setSelectedUsers([]);
    };
    
    const handleEditPoints = (user: User) => {
        const newPointsStr = prompt(`Editing points for ${user.fullName}.\nCurrent points: ${user.points}\n\nEnter new points value:`, user.points.toString());
        if (newPointsStr) {
            const newPoints = parseInt(newPointsStr, 10);
            if (!isNaN(newPoints)) {
                updateUserPoints(user.id, newPoints);
            } else {
                alert("Invalid number provided for points.");
            }
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Customer Management ({users.length})</h3>
            <div className="mb-4">
                <button onClick={() => setShowWhatsappModal(true)} disabled={selectedUsers.length === 0} className="bg-brand-green text-white py-2 px-4 rounded-md text-sm disabled:bg-gray-400 flex items-center gap-2">
                    <WhatsAppIcon className="w-4 h-4" /> Send WhatsApp ({selectedUsers.length})
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border-b"><input type="checkbox" onChange={(e) => setSelectedUsers(e.target.checked ? users.map(u => u.id) : [])} /></th>
                            <th className="p-2 border-b text-left">Name</th>
                            <th className="p-2 border-b text-left">Email</th>
                            <th className="p-2 border-b text-left">Cellphone</th>
                            <th className="p-2 border-b">Points</th>
                            <th className="p-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="p-2 border-b text-center"><input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => handleSelectUser(user.id)} /></td>
                                <td className="p-2 border-b">{user.fullName}</td>
                                <td className="p-2 border-b">{user.email}</td>
                                <td className="p-2 border-b">{user.cellNumber}</td>
                                <td className="p-2 border-b text-center font-semibold">{user.points}</td>
                                <td className="p-2 border-b text-center">
                                    <button onClick={() => handleEditPoints(user)} className="text-blue-500 hover:text-blue-700"><PencilIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showWhatsappModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
                        <h2 className="text-2xl font-bold mb-4">Send Bulk WhatsApp</h2>
                        <textarea value={whatsappMessage} onChange={(e) => setWhatsappMessage(e.target.value)} placeholder="Type your message here..." rows={5} className="w-full p-2 border rounded"/>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button onClick={() => setShowWhatsappModal(false)} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md">Cancel</button>
                            <button onClick={handleSendBulkWhatsapp} className="bg-brand-green text-white py-2 px-4 rounded-md">Send Message</button>
                        </div>
                        <button onClick={() => setShowWhatsappModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><XIcon /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminSpecialsView = ({ showToast }: { showToast: (msg: string, type?: 'success' | 'error') => void }) => {
    const { specials, setSpecials } = useAppState();
    const [showModal, setShowModal] = useState(false);
    const [editingSpecial, setEditingSpecial] = useState<Special | Omit<Special, 'id'> | null>(null);

    const addSpecial = (special: Omit<Special, 'id'>) => {
        setSpecials(prev => [...prev, { ...special, id: Date.now() }]);
        showToast("Special added successfully!");
    }
    const updateSpecial = (updatedSpecial: Special) => {
        setSpecials(prev => prev.map(s => s.id === updatedSpecial.id ? updatedSpecial : s));
        showToast("Special updated successfully!");
    }
    
    const deleteSpecial = (id: number) => {
        if (window.confirm('Are you sure you want to delete this special?')) {
            setSpecials(prev => prev.filter(s => s.id !== id));
            showToast("Special deleted.", 'error');
        }
    };

    const openAddModal = () => { setEditingSpecial({ title: '', description: '', image: '', startDate: '', endDate: '', price: '' }); setShowModal(true); };
    const openEditModal = (special: Special) => { setEditingSpecial(special); setShowModal(true); };
    const handleSave = (special: Special | Omit<Special, 'id'>) => {
        if ('id' in special) updateSpecial(special); else addSpecial(special);
        setShowModal(false); setEditingSpecial(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Manage Specials</h3>
                <button onClick={openAddModal} className="bg-brand-green text-white py-1 px-3 rounded-md text-sm flex items-center gap-1"><PlusIcon /> Add New</button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {specials.map(s => (
                    <div key={s.id} className="bg-gray-50 p-2 rounded-md shadow-sm flex justify-between items-center">
                        <span className="text-sm truncate pr-2">{s.title}</span>
                        <div className="flex space-x-2 flex-shrink-0">
                            <button onClick={() => openEditModal(s)} className="text-blue-500 hover:text-blue-700"><PencilIcon /></button>
                            <button onClick={() => deleteSpecial(s.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                        </div>
                    </div>
                ))}
            </div>
            {showModal && editingSpecial && ( <SpecialEditModal special={editingSpecial} onClose={() => setShowModal(false)} onSave={handleSave} /> )}
        </div>
    );
};

const AdminProductsView = ({ showToast }: { showToast: (msg: string, type?: 'success' | 'error') => void }) => {
    const { productCategories, setProductCategories } = useAppState();
    type EditModalState = { mode: 'add' | 'edit'; type: 'category' | 'subcategory'; item?: EditItem; parentId?: number; }
    const [editModalState, setEditModalState] = useState<EditModalState | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const selectedCategory = useMemo(() => productCategories.find(cat => cat.id === selectedCategoryId), [productCategories, selectedCategoryId]);

    const handleSave = (itemData: EditItem) => {
        if (!editModalState) return;
        const { type, mode, item: originalItem } = editModalState;

        if (type === 'category') {
            const categoryData = itemData as Omit<ProductCategory, 'subcategories'>;
            if (mode === 'add') {
                const newCategory: ProductCategory = { ...categoryData, id: Date.now(), subcategories: [] };
                setProductCategories(prev => [...prev, newCategory]);
                showToast('Category added successfully!');
            } else if (mode === 'edit' && originalItem?.id) {
                setProductCategories(prev => prev.map(cat => 
                    cat.id === originalItem.id ? { ...cat, ...categoryData, id: originalItem.id } : cat
                ));
                showToast('Category updated successfully!');
            }
        } else if (type === 'subcategory') {
            const subcategoryData = itemData as Subcategory;
            const parentId = selectedCategoryId || editModalState.parentId;
            if (!parentId) return;

            setProductCategories(prev => prev.map(cat => {
                if (cat.id === parentId) {
                    if (mode === 'add') {
                        const newSub: Subcategory = { ...subcategoryData, id: Date.now() };
                        return { ...cat, subcategories: [...cat.subcategories, newSub] };
                    }
                    if (mode === 'edit' && originalItem?.id) {
                        return { 
                            ...cat, 
                            subcategories: cat.subcategories.map(sub => 
                                sub.id === originalItem.id 
                                ? { ...sub, ...subcategoryData, id: originalItem.id } 
                                : sub
                            ) 
                        };
                    }
                }
                return cat;
            }));
            showToast(mode === 'add' ? 'Subcategory added!' : 'Subcategory updated!');
        }
        setEditModalState(null);
    };

    const handleDelete = (type: 'category' | 'subcategory', id: number, parentId?: number) => {
        if (type === 'category') {
            if (window.confirm('Are you sure? This will delete the category and all its subcategories.')) {
                setProductCategories(prev => prev.filter(cat => cat.id !== id));
                if (selectedCategoryId === id) setSelectedCategoryId(null);
                showToast('Category deleted.', 'error');
            }
        } else if (type === 'subcategory' && parentId) {
            if (window.confirm('Are you sure you want to delete this subcategory?')) {
                setProductCategories(prev => prev.map(cat => 
                    cat.id === parentId 
                    ? { ...cat, subcategories: cat.subcategories.filter(sub => sub.id !== id) } 
                    : cat
                ));
                showToast('Subcategory deleted.', 'error');
            }
        }
    };
    
    return (
        <div>
            {selectedCategory ? (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setSelectedCategoryId(null)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-orange">
                            <ArrowLeftIcon /> Back to Categories
                        </button>
                        <button onClick={() => setEditModalState({ mode: 'add', type: 'subcategory', parentId: selectedCategory.id })} className="bg-brand-green text-white py-1 px-3 rounded-md text-sm flex items-center gap-1"><PlusIcon /> Add Subcategory</button>
                    </div>
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">
                        Subcategories for: <span className="text-brand-orange">{selectedCategory.name}</span>
                    </h3>

                    {selectedCategory.subcategories.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto p-2">
                            {selectedCategory.subcategories.map(sub => (
                                <div key={sub.id} className="group relative border rounded-lg overflow-hidden shadow">
                                    <ImageWithFallback src={sub.image} alt={sub.name} className="w-full h-32" keywords={generateKeywords(sub.name)} />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center space-x-2">
                                        <button onClick={() => setEditModalState({ mode: 'edit', type: 'subcategory', item: sub, parentId: selectedCategory.id })} title="Edit Subcategory" className="text-white opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-blue-500 rounded-full hover:bg-blue-600"><PencilIcon /></button>
                                        <button onClick={() => handleDelete('subcategory', sub.id, selectedCategory.id)} title="Delete Subcategory" className="text-white opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500 rounded-full hover:bg-red-600"><TrashIcon /></button>
                                    </div>
                                    <div className="p-2 text-xs">
                                        <p className="font-semibold truncate">{sub.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-4 text-gray-500">No subcategories yet.</div>
                    )}
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Product Category Management</h3>
                        <button onClick={() => setEditModalState({mode: 'add', type: 'category'})} className="bg-brand-green text-white py-1 px-3 rounded-md text-sm flex items-center gap-1"><PlusIcon /> Add Category</button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto p-2">
                        {productCategories.map(cat => (
                            <div key={cat.id} className="group relative border rounded-lg overflow-hidden shadow">
                                <ImageWithFallback src={cat.image} alt={cat.name} className="w-full h-32" keywords={generateKeywords(cat.name)} />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center space-x-2">
                                    <button onClick={() => setSelectedCategoryId(cat.id)} title="View Subcategories" className="text-white opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-green-500 rounded-full hover:bg-green-600"><EyeIcon /></button>
                                    <button onClick={() => setEditModalState({mode: 'edit', type: 'category', item: cat})} title="Edit Category" className="text-white opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-blue-500 rounded-full hover:bg-blue-600"><PencilIcon /></button>
                                    <button onClick={() => handleDelete('category', cat.id)} title="Delete Category" className="text-white opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500 rounded-full hover:bg-red-600"><TrashIcon /></button>
                                </div>
                                 <div className="p-2 text-xs">
                                   <p className="font-semibold truncate">{cat.name}</p>
                                   <p className="text-gray-500 capitalize">{cat.subcategories.length} subcategories</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {editModalState && <ProductEditModal modalState={editModalState} onClose={() => setEditModalState(null)} onSave={handleSave} />}
        </div>
    );
};

interface ProductEditModalProps { modalState: { mode: 'add' | 'edit'; type: 'category' | 'subcategory'; item?: EditItem; parentId?: number }; onClose: () => void; onSave: (data: EditItem) => void; }
const ProductEditModal: React.FC<ProductEditModalProps> = ({ modalState, onClose, onSave }) => {
    const initialData = modalState.item || { name: '', description: '', image: '' };
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => { setFormData(prev => ({ ...prev, image: reader.result as string })); };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as EditItem);
    };

    const title = `${modalState.mode === 'add' ? 'Add' : 'Edit'} ${modalState.type === 'category' ? 'Category' : 'Subcategory'}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 border rounded" />
                    <textarea name="description" value={'description' in formData ? formData.description : ''} onChange={handleChange} placeholder="Description" required className="w-full p-2 border rounded" />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <div className="mt-1 flex items-start space-x-4 p-3 border rounded-lg bg-gray-50">
                            <ImageWithFallback src={formData.image || 'https://placehold.co/100x100?text=No+Image'} alt="Preview" className="w-24 h-24 object-cover rounded-md bg-white shadow-sm flex-shrink-0" keywords={generateKeywords(formData.name)} />
                            <div className="flex-grow space-y-2">
                                <input name="image" value={formData.image} onChange={handleChange} placeholder="Paste Image URL here" required className="w-full p-2 border rounded-md shadow-sm" />
                                <label className="w-full text-center block cursor-pointer bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm transition-colors">
                                    <span>Or Upload an Image</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md">Cancel</button>
                        <button type="submit" className="bg-brand-orange text-white py-2 px-4 rounded-md">Save</button>
                    </div>
                </form>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><XIcon /></button>
            </div>
        </div>
    );
};


const AdminPriceManagementView = ({ showToast }: { showToast: (msg: string, type?: 'success' | 'error') => void }) => {
    const { gasOptions, setGasOptions } = useAppState();
    const [prices, setPrices] = useState<{ [key: number]: number }>(
        gasOptions.reduce((acc, option) => {
            acc[option.size] = option.price;
            return acc;
        }, {} as { [key: number]: number })
    );
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handlePriceChange = (size: number, newPrice: number) => {
        setPrices(prev => ({ ...prev, [size]: newPrice }));
        if (!isDirty) setIsDirty(true);
    };

    const handleSaveChanges = () => {
        setIsSaving(true);
        const updatedOptions = gasOptions.map(option => ({
            ...option,
            price: prices[option.size]
        }));
        setGasOptions(updatedOptions);
        
        setTimeout(() => {
            setIsSaving(false);
            setIsDirty(false);
            showToast('Prices updated successfully!');
        }, 1000);
    };
    
    const handleCancel = () => {
        const originalPrices = gasOptions.reduce((acc, option) => {
            acc[option.size] = option.price;
            return acc;
        }, {} as { [key: number]: number });
        setPrices(originalPrices);
        setIsDirty(false);
    }

    return (
        <div className="text-brand-dark">
            <h3 className="text-xl font-semibold mb-6 border-b pb-2">Manage Gas Bottle Prices</h3>
            <div className="space-y-6">
                {gasOptions.map(option => (
                    <div key={option.size} className="flex items-center justify-between">
                        <label htmlFor={`price-${option.size}`} className="font-medium text-gray-700">{option.name} Selling Price</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">R</span>
                            <input
                                id={`price-${option.size}`}
                                type="number"
                                value={prices[option.size]}
                                onChange={(e) => handlePriceChange(option.size, parseFloat(e.target.value) || 0)}
                                className="w-40 pl-7 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-green focus:border-brand-green"
                                step="0.01"
                                min="0"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 pt-4 border-t flex items-center justify-end space-x-4">
                <button 
                    onClick={handleCancel} 
                    disabled={!isDirty || isSaving}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSaveChanges} 
                    disabled={!isDirty || isSaving}
                    className="bg-brand-green text-white py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

const AdminSettingsView = () => {
    const { loyaltySystem, setLoyaltySystem } = useAppState();
    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Admin Settings</h3>
            <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                    <label className="font-semibold">Loyalty System</label>
                    <div className="flex items-center space-x-4 mt-2">
                        <button onClick={() => setLoyaltySystem('points')} className={`px-4 py-2 rounded-md text-sm ${loyaltySystem === 'points' ? 'bg-brand-orange text-white' : 'bg-white'}`}>Points System</button>
                        <button onClick={() => setLoyaltySystem('discount')} className={`px-4 py-2 rounded-md text-sm ${loyaltySystem === 'discount' ? 'bg-brand-orange text-white' : 'bg-white'}`} disabled>Discount System (Future)</button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Currently using: <strong>{loyaltySystem}</strong></p>
                </div>
            </div>
        </div>
    );
};

interface SpecialEditModalProps { special: Special | Omit<Special, 'id'>; onClose: () => void; onSave: (special: Special | Omit<Special, 'id'>) => void; }
const SpecialEditModal: React.FC<SpecialEditModalProps> = ({ special, onClose, onSave }) => {
    const [formData, setFormData] = useState(special);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative"><h2 className="text-2xl font-bold mb-4">{'id' in formData ? 'Edit' : 'Add'} Special</h2><form onSubmit={handleSubmit} className="space-y-4"><input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border rounded"/><textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 border rounded"/>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="mt-1 flex items-start space-x-4 p-3 border rounded-lg bg-gray-50">
                     <ImageWithFallback src={formData.image || 'https://placehold.co/100x100?text=No+Image'} alt="Preview" className="w-24 h-24 object-cover rounded-md bg-white shadow-sm flex-shrink-0" keywords={generateKeywords(formData.title)} />
                    <div className="flex-grow space-y-2">
                        <input name="image" value={formData.image} onChange={handleChange} placeholder="Paste Image URL here" required className="w-full p-2 border rounded-md shadow-sm"/>
                        <label className="w-full text-center block cursor-pointer bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm transition-colors">
                            <span>Or Upload an Image</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </div>
                </div>
            </div>
         <input name="price" value={formData.price || ''} onChange={handleChange} placeholder="Price (e.g., R199.99 or 20% Off)" className="w-full p-2 border rounded"/><div className="flex space-x-4"><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full p-2 border rounded"/><input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full p-2 border rounded"/></div>
         <div className="flex justify-end space-x-3 pt-4">
             <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md">Cancel</button>
             <button type="submit" className="bg-brand-orange text-white py-2 px-4 rounded-md">Save Special</button>
        </div>
         </form><button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><XIcon/></button></div></div>
    );
};

const QuoteRequestPage = () => {
    type QuoteItem = { id: number; description: string; quantity: number; };
    const [items, setItems] = useState<QuoteItem[]>([{ id: 1, description: '', quantity: 1 }]);
    const [submitted, setSubmitted] = useState(false);
    const { currentUser } = useAuth();
    const addItem = () => { setItems([...items, { id: Date.now(), description: '', quantity: 1 }]); };
    const updateItem = (id: number, field: 'description' | 'quantity', value: string | number) => { setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item)); };
    const removeItem = (id: number) => { setItems(items.filter(item => item.id !== id)); };
    const handlePrint = () => { window.print(); };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); console.log("Quote Request:", { user: currentUser, items }); setSubmitted(true); };
    if (submitted) { return (<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10"><div className="bg-white p-8 rounded-lg shadow-lg text-center"><h1 className="text-3xl font-bold text-green-600 mb-4">Quote Submitted Successfully!</h1><p className="text-gray-700 mb-6">Thank you for your request. We have received your list and will get back to you with a quote shortly.</p><div id="print-area" className="text-left mb-6 border p-4 rounded-md bg-gray-50"><h2 className="text-xl font-semibold mb-2">Your Requested Items:</h2><ul className="list-disc pl-5">{items.map(item => <li key={item.id}>{item.quantity} x {item.description}</li>)}</ul>{currentUser && (<div className="mt-4 border-t pt-2 text-sm"><p><strong>Name:</strong> {currentUser.fullName}</p><p><strong>Email:</strong> {currentUser.email}</p><p><strong>Contact:</strong> {currentUser.cellNumber}</p></div>)}</div><button onClick={handlePrint} className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 flex items-center justify-center mx-auto mb-4 no-print"><PrintIcon /> Print a Copy</button><Link to="/products" className="text-brand-orange hover:underline font-medium">Continue Shopping</Link></div></div>); }
    return (<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10"><Breadcrumbs crumbs={[{ name: 'Request a Quote' }]} /><div id="print-area" className="bg-white p-8 rounded-lg shadow-lg"><h1 className="text-3xl font-bold mb-6">Request a Quote</h1>{!currentUser && (<div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert"><p className="font-bold">Log in for a faster experience!</p><p>If you <Link to="/auth" className="underline">log in or register</Link>, your contact details will be filled in automatically.</p></div>)}<form onSubmit={handleSubmit} className="space-y-4">{items.map((item, index) => (<div key={item.id} className="flex items-center space-x-2"><input type="text" placeholder={`Item ${index + 1} Description`} value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} required className="flex-grow p-2 border rounded-md" /><input type="number" value={item.quantity} min="1" onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))} required className="w-24 p-2 border rounded-md" /><button type="button" onClick={() => removeItem(item.id)} className="text-red-500 p-2 rounded-md hover:bg-red-100 disabled:opacity-50" disabled={items.length <= 1}><TrashIcon/></button></div>))}<button type="button" onClick={addItem} className="text-brand-green font-medium flex items-center"><PlusIcon /> Add another item</button><div className="pt-6 border-t mt-6"><button type="submit" className="w-full bg-brand-orange text-white py-3 rounded-md font-semibold text-lg hover:bg-opacity-90">Submit Quote Request</button></div></form></div></div>);
};

const QuantitySelector = ({ quantity, onDecrease, onIncrease, onSet }: { quantity: number; onDecrease: () => void; onIncrease: () => void; onSet: (val: number) => void }) => (
    <div className="flex items-center justify-center space-x-2">
        <button type="button" onClick={onDecrease} className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 font-bold text-xl hover:bg-gray-300 transition-colors disabled:opacity-50" disabled={quantity <= 0}>-</button>
        <input
            type="number"
            value={quantity}
            onChange={(e) => onSet(parseInt(e.target.value, 10) || 0)}
            className="w-16 h-10 text-center border-2 border-gray-200 rounded-md font-semibold text-lg focus:ring-brand-orange focus:border-brand-orange"
            min="0"
        />
        <button type="button" onClick={onIncrease} className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 font-bold text-xl hover:bg-gray-300 transition-colors">+</button>
    </div>
);


const GasOrderPage = () => {
    const { gasOptions } = useAppState();
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const [submitted, setSubmitted] = useState(false);
    const { currentUser } = useAuth();

    useEffect(() => {
        const initialQuantities = gasOptions.reduce((acc, option) => {
            acc[option.size] = 0;
            return acc;
        }, {} as { [key: number]: number });
        setQuantities(initialQuantities);
    }, [gasOptions]);

    const handleQuantityChange = (size: number, value: number) => {
        setQuantities(prev => ({ ...prev, [size]: Math.max(0, value) }));
    };

    const total = useMemo(() => gasOptions.reduce((acc, option) => acc + ((quantities[option.size] || 0) * option.price), 0), [quantities, gasOptions]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (total <= 0) {
            alert("Please select at least one gas bottle.");
            return;
        }

        const orderItems = gasOptions
            .filter(opt => quantities[opt.size] > 0)
            .map(opt => `${quantities[opt.size]} x ${opt.name}`)
            .join('\n');

        const message = `
Hello Harry's Hardware,

I would like to place a gas order for delivery.

*Customer Details:*
Name: ${currentUser?.fullName}
Address: ${currentUser?.deliveryAddress}
Contact: ${currentUser?.cellNumber}

*Order Details:*
${orderItems}

*Total: R${total.toFixed(2)}*

Please send me an invoice.
Thank you!
`.trim().replace(/\n\n/g, '\n');

        const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <h1 className="text-3xl font-bold text-green-600 mb-4">Order Sent via WhatsApp!</h1>
                    <p className="text-gray-700 mb-6">Thank you! Your order has been prepared for WhatsApp. Please press "Send" in the new tab to finalize your order. We will confirm and send an invoice there shortly.</p>
                    <div className="text-left mb-6 border p-4 rounded-md bg-gray-50">
                        <h2 className="text-xl font-semibold mb-2">Order Summary:</h2>
                        <ul className="list-disc pl-5">
                            {gasOptions.filter(opt => quantities[opt.size] > 0).map(opt => (
                                <li key={opt.size}>{quantities[opt.size]} x {opt.name}</li>
                            ))}
                        </ul>
                        <p className="font-bold text-right mt-4">Total: R{total.toFixed(2)}</p>
                        {currentUser && (
                            <div className="mt-4 border-t pt-2 text-sm">
                                <p><strong>Deliver to:</strong> {currentUser.fullName}</p>
                                <p><strong>Address:</strong> {currentUser.deliveryAddress}</p>
                                <p><strong>Contact:</strong> {currentUser.cellNumber}</p>
                            </div>
                        )}
                    </div>
                    <Link to="/products" className="text-brand-orange hover:underline font-medium">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Breadcrumbs crumbs={[{ name: 'Gas Delivery Order' }]} />
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <h1 className="text-4xl font-bold text-center mb-2">Order Your Gas Delivery</h1>
                    <p className="text-center text-gray-600 mb-8">Select the size and quantity you need. Delivery to your door.</p>
                    <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 mb-8 rounded-r-lg">
                        <p><strong>Deliver to:</strong> {currentUser?.fullName} at <strong>{currentUser?.deliveryAddress}</strong></p>
                         <p className="text-sm">Need to change your address? Go to your <Link to="/dashboard" className="font-semibold underline">dashboard</Link>.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {gasOptions.map(option => (
                                <div key={option.size} className="border border-gray-200 rounded-lg p-6 text-center flex flex-col items-center shadow-sm hover:shadow-lg transition-shadow">
                                    <ImageWithFallback src={option.image} alt={option.name} className="w-32 h-32 object-contain mb-4" keywords={['gas', 'cylinder']} />
                                    <h2 className="text-xl font-semibold">{option.name}</h2>
                                    <p className="text-2xl font-bold text-brand-green my-2">R{option.price.toFixed(2)}</p>
                                    <div className="mt-4">
                                        <QuantitySelector
                                            quantity={quantities[option.size] || 0}
                                            onDecrease={() => handleQuantityChange(option.size, (quantities[option.size] || 0) - 1)}
                                            onIncrease={() => handleQuantityChange(option.size, (quantities[option.size] || 0) + 1)}
                                            onSet={(value) => handleQuantityChange(option.size, value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="pt-8 border-t mt-8 flex flex-col items-center">
                             <p className="text-3xl font-bold mb-4">Total: <span className="text-brand-orange">R{total.toFixed(2)}</span></p>
                            <button type="submit" className="bg-brand-orange text-white py-3 px-12 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100" disabled={total <= 0}>
                                Send Order via WhatsApp
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const App = () => (
    <AuthProvider>
        <AppStateProvider>
            <HashRouter>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="products/:categoryId" element={<ProductsPage />} />
                        <Route path="products/:categoryId/:subcategoryId" element={<ProductsPage />} />
                        <Route path="gallery" element={<GalleryPage />} />
                        <Route path="contact" element={<ContactPage />} />
                        <Route path="calculator" element={<ProjectCalculatorPage />} />
                        <Route path="auth" element={<AuthPage />} />
                        <Route path="admin-login" element={<AdminLoginPage />} />
                        <Route path="quote" element={<QuoteRequestPage />} />
                        <Route path="gas-order" element={<ProtectedRoute><GasOrderPage /></ProtectedRoute>} />
                        <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="*" element={<HomePage />} />
                    </Route>
                </Routes>
            </HashRouter>
        </AppStateProvider>
    </AuthProvider>
);

export default App;
const AdminGalleryView = ({ showToast }: { showToast: (msg: string, type?: 'success' | 'error') => void }) => {
    const { galleryItems, setGalleryItems } = useAppState();
    type ModalState = { mode: 'add' | 'edit'; item?: GalleryItem };
    const [modalState, setModalState] = useState<ModalState | null>(null);

    const handleSave = (itemData: Omit<GalleryItem, 'id'> & { id?: number }) => {
        if (modalState?.mode === 'add') {
            const newItem: GalleryItem = { ...(itemData as Omit<GalleryItem, 'id'>), id: Date.now() };
            setGalleryItems(prev => [...prev, newItem]);
            showToast('Image added successfully!');
        } else if (modalState?.mode === 'edit' && itemData.id) {
            setGalleryItems(prev => prev.map(item => item.id === itemData.id ? { ...item, ...itemData } as GalleryItem : item));
            showToast('Image updated successfully!');
        }
        setModalState(null);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            setGalleryItems(prev => prev.filter(item => item.id !== id));
            showToast('Image deleted.', 'error');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Gallery Management</h3>
                <button onClick={() => setModalState({ mode: 'add' })} className="bg-brand-green text-white py-1 px-3 rounded-md text-sm flex items-center gap-1"><PlusIcon /> Add Image</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto p-2">
                {galleryItems.map(item => (
                    <div key={item.id} className="group relative border rounded-lg overflow-hidden shadow">
                        <ImageWithFallback src={item.src} alt={item.alt} className="w-full h-32" keywords={[item.category]} />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center space-x-2">
                            <button onClick={() => setModalState({ mode: 'edit', item })} className="text-white opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-blue-500 rounded-full hover:bg-blue-600"><PencilIcon /></button>
                            <button onClick={() => handleDelete(item.id)} className="text-white opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500 rounded-full hover:bg-red-600"><TrashIcon /></button>
                        </div>
                        <div className="p-2 text-xs">
                           <p className="font-semibold truncate">{item.alt}</p>
                           <p className="text-gray-500 capitalize">{item.category}</p>
                        </div>
                    </div>
                ))}
            </div>
            {modalState && (
                <GalleryEditModal
                    initialItem={modalState.mode === 'edit' ? modalState.item : undefined}
                    onClose={() => setModalState(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

interface GalleryEditModalProps {
    initialItem?: GalleryItem;
    onClose: () => void;
    onSave: (itemData: Omit<GalleryItem, 'id'> & { id?: number }) => void;
}
const GalleryEditModal: React.FC<GalleryEditModalProps> = ({ initialItem, onClose, onSave }) => {
    const [item, setItem] = useState(initialItem || { src: '', alt: '', category: 'store' as GalleryItem['category'] });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setItem(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setItem(prev => ({ ...prev, src: reader.result as string }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(item);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
                <h2 className="text-2xl font-bold mb-4">{initialItem ? 'Edit' : 'Add'} Gallery Image</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <div className="mt-1 flex items-start space-x-4 p-3 border rounded-lg bg-gray-50">
                             <ImageWithFallback src={item.src || 'https://placehold.co/100x100?text=No+Image'} alt="Preview" className="w-24 h-24 object-cover rounded-md bg-white shadow-sm flex-shrink-0" keywords={[item.category]} />
                            <div className="flex-grow space-y-2">
                                <input name="src" value={item.src} onChange={handleChange} placeholder="Paste Image URL here" required className="w-full p-2 border rounded-md shadow-sm" />
                                <label className="w-full text-center block cursor-pointer bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm transition-colors">
                                    <span>Or Upload an Image</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="alt" className="block text-sm font-medium">Alt Text (Description)</label>
                        <input id="alt" name="alt" value={item.alt} onChange={handleChange} placeholder="e.g., Ryobi power tools" required className="w-full p-2 border rounded mt-1" />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium">Category</label>
                        <select id="category" name="category" value={item.category} onChange={handleChange} required className="w-full p-2 border rounded mt-1 bg-white">
                            <option value="store">Our Store</option>
                            <option value="staff">Our Staff</option>
                            <option value="products">Our Products</option>
                            <option value="brands">Top Brands</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md">Cancel</button>
                        <button type="submit" className="bg-brand-orange text-white py-2 px-4 rounded-md">Save Image</button>
                    </div>
                </form>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><XIcon /></button>
            </div>
        </div>
    );
};

const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void; }> = ({ message, type, onClose }) => (
    <div className="fixed top-5 right-5 z-[100] bg-white shadow-lg rounded-lg p-4 flex items-center border-l-4" style={{ borderColor: type === 'success' ? '#5A922A' : '#EF4444' }}>
        <div className="mr-3">
            {type === 'success' ? <CheckCircleIcon /> : <XCircleIcon />}
        </div>
        <div className="flex-1">
            <p className={`font-semibold ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {type === 'success' ? 'Success' : 'Action'}
            </p>
            <p className="text-sm text-gray-600">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600"><XIcon /></button>
    </div>
);
