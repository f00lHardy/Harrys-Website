import { ProductCategory, GalleryItem, Special, GasOption } from './types';

export const BUSINESS_INFO = {
  name: "Harry's Hardware",
  slogan: "Your trusted local hardware partner",
  address: "Shop 1, Mountain Lake Shopping Centre, Broederstroom, South Africa",
  phone: "079 895 1812",
  whatsapp: "27798951812",
  email: "sales@harryshardware.co.za",
  domain: "harryshardware.co.za",
  hours: [
    { day: "Mon–Fri", time: "8h00–17h00" },
    { day: "Sat", time: "8h00–14h00" },
    { day: "Sun & Public Holidays", time: "8h30–12h30" },
  ],
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594.398072101344!2d27.88174431502013!3d-25.72422898365395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1eb9d8a57cf8d1c7%3A0x9b3259e8e5a1b7c1!2sMountain%20Lake%20Shopping%20Centre!5e0!3m2!1sen!2sza!4v1678886421337!5m2!1sen!2sza"
};

export const INITIAL_PRODUCT_CATEGORIES: ProductCategory[] = [
  { 
    id: 1, name: "Building Materials", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop", description: "Essential materials for any construction project.",
    subcategories: [
      { id: 101, name: "Cement", image: "https://images.unsplash.com/photo-1604560914225-c409b3b841a3?q=80&w=800&auto=format&fit=crop", description: "High-quality cement for strong foundations." },
      { id: 102, name: "Sand", image: "https://images.unsplash.com/photo-1528628031193-2f2b3e8b3509?q=80&w=800&auto=format&fit=crop", description: "Building and plastering sand." },
      { id: 103, name: "Bricks", image: "https://images.unsplash.com/photo-1517983692621-17f2a1a5b8e8?q=80&w=800&auto=format&fit=crop", description: "A variety of bricks for all building types." },
      { id: 104, name: "Gravel", image: "https://images.unsplash.com/photo-1605372485458-4d519b5b2a4d?q=80&w=800&auto=format&fit=crop", description: "Stone and gravel for driveways and concrete." },
      { id: 105, name: "Reinforcing", image: "https://images.unsplash.com/photo-1574042250917-025111a430c5?q=80&w=800&auto=format&fit=crop", description: "Steel bars and mesh for concrete reinforcement." },
      { id: 106, name: "Roof Sheets", image: "https://images.unsplash.com/photo-1593521992736-993661c1626f?q=80&w=800&auto=format&fit=crop", description: "Corrugated and IBR roof sheeting." },
      { id: 107, name: "Timber", image: "https://images.unsplash.com/photo-1622373303632-45e05d05a4a5?q=80&w=800&auto=format&fit=crop", description: "Structural and finishing timber." },
      { id: 108, name: "Waterproofing", image: "https://images.unsplash.com/photo-1591182413511-2f0858852e98?q=80&w=800&auto=format&fit=crop", description: "Sealants and membranes to protect against water damage." },
    ]
  },
  { 
    id: 2, name: "Paint & Plumbing", image: "https://images.unsplash.com/photo-1569705461998-c11b5a513758?q=80&w=800&auto=format&fit=crop", description: "Everything you need for painting and plumbing jobs.",
    subcategories: [
        { id: 201, name: "Paint", image: "https://images.unsplash.com/photo-1555873997-73b35582b137?q=80&w=800&auto=format&fit=crop", description: "Interior, exterior, and specialty paints." },
        { id: 202, name: "Brushes & Rollers", image: "https://images.unsplash.com/photo-1628759392118-9d5f7f9e8a0b?q=80&w=800&auto=format&fit=crop", description: "High-quality brushes and roller sets." },
        { id: 203, name: "Sealants", image: "https://images.unsplash.com/photo-1581135649959-d81559f0714b?q=80&w=800&auto=format&fit=crop", description: "Silicone and acrylic sealants for all surfaces." },
        { id: 204, name: "Taps", image: "https://images.unsplash.com/photo-1616762232049-7c3548a05151?q=80&w=800&auto=format&fit=crop", description: "Stylish and durable taps for kitchens and bathrooms." },
        { id: 205, name: "Pipes", image: "https://images.unsplash.com/photo-1543886153-27b3b65a585f?q=80&w=800&auto=format&fit=crop", description: "Copper, PVC, and galvanized pipes." },
        { id: 206, name: "Fittings", image: "https://images.unsplash.com/photo-1598254885827-31726a793a38?q=80&w=800&auto=format&fit=crop", description: "A wide range of pipe fittings and connectors." },
        { id: 207, name: "Drainage", image: "https://images.unsplash.com/photo-1605711654630-d3c5442f9b11?q=80&w=800&auto=format&fit=crop", description: "Pipes and solutions for effective drainage." },
    ]
  },
   { 
    id: 3, name: "Tools & Power Tools", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop", description: "Hand tools and power tools for every job.",
    subcategories: [
        { id: 301, name: "Hammers", image: "https://images.unsplash.com/photo-1518772848149-a5aa02521312?q=80&w=800&auto=format&fit=crop", description: "Claw, ball-peen, and sledgehammers." },
        { id: 302, name: "Spanners", image: "https://images.unsplash.com/photo-1618329864757-19e83532f022?q=80&w=800&auto=format&fit=crop", description: "Wrench and spanner sets in all sizes." },
        { id: 303, name: "Screwdrivers", image: "https://images.unsplash.com/photo-1566933491985-f12a2013829b?q=80&w=800&auto=format&fit=crop", description: "Individual screwdrivers and full sets." },
        { id: 304, name: "Drills", image: "https://images.unsplash.com/photo-1508513511736-8e5c49a3c7a1?q=80&w=800&auto=format&fit=crop", description: "Corded and cordless drills from top brands." },
        { id: 305, name: "Grinders", image: "https://images.unsplash.com/photo-1628813642335-5627f711f592?q=80&w=800&auto=format&fit=crop", description: "Angle grinders for cutting and polishing." },
        { id: 306, name: "Saws", image: "https://images.unsplash.com/photo-1629424424285-78c6e3d23831?q=80&w=800&auto=format&fit=crop", description: "Hand saws, circular saws, and jigsaws." },
        { id: 307, name: "Toolkits", image: "https://images.unsplash.com/photo-1582212450290-7799cb77359a?q=80&w=800&auto=format&fit=crop", description: "Comprehensive toolkits for home and professional use." },
    ]
  },
  { 
    id: 4, name: "Electrical", image: "https://images.unsplash.com/photo-1617578948995-c9cec5145895?q=80&w=800&auto=format&fit=crop", description: "All your essential electrical supplies.",
    subcategories: [
        { id: 401, name: "Cables", image: "https://images.unsplash.com/photo-1547038555-54092c1a89be?q=80&w=800&auto=format&fit=crop", description: "Electrical cables of all types and sizes." },
        { id: 402, name: "Switches", image: "https://images.unsplash.com/photo-1631048035183-1d02f2323f46?q=80&w=800&auto=format&fit=crop", description: "Light switches and socket outlets." },
        { id: 403, name: "Plugs", image: "https://images.unsplash.com/photo-1615286234932-d15a5f103554?q=80&w=800&auto=format&fit=crop", description: "Standard and industrial plugs." },
        { id: 404, name: "Light Bulbs", image: "https://images.unsplash.com/photo-1570852608444-3d63425b7468?q=80&w=800&auto=format&fit=crop", description: "LED, fluorescent, and incandescent bulbs." },
        { id: 405, name: "Breakers", image: "https://images.unsplash.com/photo-1644781703644-b0548d72124a?q=80&w=800&auto=format&fit=crop", description: "Circuit breakers and distribution boards." },
        { id: 406, name: "Extensions", image: "https://images.unsplash.com/photo-1617578948995-c9cec5145895?q=80&w=800&auto=format&fit=crop", description: "Extension cords and multi-plugs." },
    ]
  },
  { 
    id: 5, name: "Garden & Outdoor", image: "https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=800&auto=format&fit=crop", description: "Tools and supplies for your garden.",
    subcategories: [
        { id: 501, name: "Lawn Equipment", image: "https://images.unsplash.com/photo-1609154499316-9d338e0766c5?q=80&w=800&auto=format&fit=crop", description: "Lawnmowers, trimmers, and blowers." },
        { id: 502, name: "Irrigation", image: "https://images.unsplash.com/photo-1525286299198-a8b27301c221?q=80&w=800&auto=format&fit=crop", description: "Sprinklers, hoses, and irrigation systems." },
        { id: 503, name: "Garden Tools", image: "https://images.unsplash.com/photo-1455582449734-e3621406521a?q=80&w=800&auto=format&fit=crop", description: "Spades, forks, rakes, and other hand tools." },
        { id: 504, name: "Fencing", image: "https://images.unsplash.com/photo-1464972377637-3a130953a7b3?q=80&w=800&auto=format&fit=crop", description: "Wire, posts, and fencing materials." },
        { id: 505, name: "Outdoor Décor", image: "https://images.unsplash.com/photo-1585331312063-6c70a1f0a5f9?q=80&w=800&auto=format&fit=crop", description: "Pots, planters, and garden decorations." },
    ]
  },
  { 
    id: 6, name: "Gas Refills & Accessories", image: "https://images.unsplash.com/photo-1610930335293-e4a779166f2a?q=80&w=800&auto=format&fit=crop", description: "Gas refills and accessories.",
    subcategories: [
        { id: 601, name: "Gas Cylinders", image: "https://images.unsplash.com/photo-1605051912630-3d22b27429fe?q=80&w=800&auto=format&fit=crop", description: "9kg, 19kg, and 48kg gas cylinders." },
        { id: 602, name: "Regulators", image: "https://images.unsplash.com/photo-1623190839842-811c2105f776?q=80&w=800&auto=format&fit=crop", description: "High and low-pressure gas regulators." },
        { id: 603, name: "Hoses", image: "https://images.unsplash.com/photo-1584879294248-83a38a7a0526?q=80&w=800&auto=format&fit=crop", description: "Durable gas hoses in various lengths." },
        { id: 604, name: "Gas Delivery Orders", image: "https://images.unsplash.com/photo-1595804675544-7f1b7f4682b5?q=80&w=800&auto=format&fit=crop", description: "Order your gas delivery here." },
    ]
  },
  { 
    id: 7, name: "Fishing Gear", image: "https://images.unsplash.com/photo-1520392322099-059a84d4df11?q=80&w=800&auto=format&fit=crop", description: "Gear for the avid fisherman.",
    subcategories: [
        { id: 701, name: "Rods", image: "https://images.unsplash.com/photo-1549279028-4096c4a8a3a3?q=80&w=800&auto=format&fit=crop", description: "Fishing rods for all types of fishing." },
        { id: 702, name: "Reels", image: "https://images.unsplash.com/photo-1614278142319-1563e7750174?q=80&w=800&auto=format&fit=crop", description: "A selection of high-quality fishing reels." },
        { id: 703, name: "Hooks", image: "https://images.unsplash.com/photo-1579733479412-f3a76e99e4d3?q=80&w=800&auto=format&fit=crop", description: "Hooks, sinkers, and traces." },
        { id: 704, name: "Nets", image: "https://images.unsplash.com/photo-1575453008443-52f81907e5c9?q=80&w=800&auto=format&fit=crop", description: "Landing nets for securing your catch." },
        { id: 705, name: "Bait", image: "https://images.unsplash.com/photo-1550968393-50f7a7f4335c?q=80&w=800&auto=format&fit=crop", description: "Live and artificial bait." },
    ]
  },
  { 
    id: 8, name: "Building Supplies (General)", image: "https://images.unsplash.com/photo-1504917595217-d4dc5b990ee6?q=80&w=800&auto=format&fit=crop", description: "General hardware and building supplies.",
    subcategories: [
        { id: 801, name: "Adhesives", image: "https://images.unsplash.com/photo-1633229618489-79730164c483?q=80&w=800&auto=format&fit=crop", description: "Glues and adhesives for all materials." },
        { id: 802, name: "Nails", image: "https://images.unsplash.com/photo-1584513686229-f53b5167b579?q=80&w=800&auto=format&fit=crop", description: "Loose nails and nail gun supplies." },
        { id: 803, name: "Screws", image: "https://images.unsplash.com/photo-1621440319417-028f8f047e17?q=80&w=800&auto=format&fit=crop", description: "A wide variety of screws for wood and metal." },
        { id: 804, name: "Safety Gear", image: "https://images.unsplash.com/photo-1600577916048-823a96412170?q=80&w=800&auto=format&fit=crop", description: "Gloves, goggles, masks, and safety boots." },
        { id: 805, name: "Measuring Tools", image: "https://images.unsplash.com/photo-1519693154291-c1b2413a1e34?q=80&w=800&auto=format&fit=crop", description: "Tape measures, levels, and squares." },
    ]
  },
];

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, src: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop", alt: "Inside Harry's Hardware", category: 'store' },
  { id: 2, src: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=800&auto=format&fit=crop", alt: "The friendly team at Harry's Hardware", category: 'staff' },
  { id: 3, src: "https://images.unsplash.com/photo-1621929749712-de5934e6526e?q=80&w=800&auto=format&fit=crop", alt: "Aisle with various products", category: 'products' },
  { id: 4, src: "https://images.unsplash.com/photo-1601131123491-3a830953a7b6?q=80&w=800&auto=format&fit=crop", alt: "Franke brand products", category: 'brands' },
  { id: 5, src: "https://images.ctfassets.net/o65arnbxpbco/79EPL1IaxG1slCX0vU3NxN/efe8a84473eb1fb17dd105d9b9a21eef/2023_RY_USB_Lithium_Family_June_A_Final.jpg", alt: "Ryobi power tools", category: 'brands' },
  { id: 6, src: "https://images.unsplash.com/photo-1531215912328-a35f2a1b9a89?q=80&w=800&auto=format&fit=crop", alt: "Excelsior paint selection", category: 'brands' },
  { id: 7, src: "https://images.unsplash.com/photo-1595825392095-d4a1378a5e01?q=80&w=800&auto=format&fit=crop", alt: "Bosch power tools", category: 'brands' },
  { id: 8, src: "https://images.unsplash.com/photo-1521992132984-7834e5b99215?q=80&w=800&auto=format&fit=crop", alt: "Store shelf with tools", category: 'store' },
  { id: 9, src: "https://images.unsplash.com/photo-1455582449734-e3621406521a?q=80&w=800&auto=format&fit=crop", alt: "Gardening section", category: 'products' },
  { id: 10, src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop", alt: "Building materials", category: 'products' },
];

export const INITIAL_SPECIALS: Special[] = [
    {
        id: 1,
        image: 'https://images.ctfassets.net/o65arnbxpbco/79EPL1IaxG1slCX0vU3NxN/efe8a84473eb1fb17dd105d9b9a21eef/2023_RY_USB_Lithium_Family_June_A_Final.jpg',
        title: '20% Off All Ryobi Power Tools',
        description: 'Upgrade your toolkit with our Ryobi power tools, now at a 20% discount. Limited time offer!',
        startDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0],
        endDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],
        price: 'From R499.99'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1531215912328-a35f2a1b9a89?q=80&w=800&auto=format&fit=crop',
        title: 'Excelsior Paint Deal: Buy 3 Get 1 Free',
        description: 'Refresh your home for less. Buy any three 5L Excelsior paint cans and get the fourth one absolutely free.',
        startDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0],
        endDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1455582449734-e3621406521a?q=80&w=800&auto=format&fit=crop',
        title: 'Expired Deal: Garden Set',
        description: 'This is an example of an expired deal that should not be visible on the home page.',
        startDate: '2023-01-01',
        endDate: '2023-01-15',
    }
];

export const INITIAL_GAS_OPTIONS: GasOption[] = [
    { size: 9, name: "9kg Gas Refill", price: 250, image: "https://raw.githubusercontent.com/f00lHardy/Harrys-Website/main/9kg%20Gas.jpg" },
    { size: 19, name: "19kg Gas Refill", price: 500, image: "https://raw.githubusercontent.com/f00lHardy/Harrys-Website/main/19kg%20Gas.jpg" },
    { size: 48, name: "48kg Gas Refill", price: 1200, image: "https://raw.githubusercontent.com/f00lHardy/Harrys-Website/main/48kg%20Gas.jpg" },
];