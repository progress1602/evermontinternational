export const COUNTRIES_DATA = [
  { 
    name: "United States", 
    code: "US", 
    currency: "USD", 
    currencySymbol: "$",
    states: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]
  },
  { 
    name: "United Kingdom", 
    code: "GB", 
    currency: "GBP", 
    currencySymbol: "£",
    states: ["England", "Scotland", "Wales", "Northern Ireland", "London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool"]
  },
  { 
    name: "Canada", 
    code: "CA", 
    currency: "CAD", 
    currencySymbol: "C$",
    states: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"]
  },
  { 
    name: "Australia", 
    code: "AU", 
    currency: "AUD", 
    currencySymbol: "A$",
    states: ["New South Wales", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia"]
  },
  { 
    name: "Germany", 
    code: "DE", 
    currency: "EUR", 
    currencySymbol: "€",
    states: ["Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"]
  },
  { 
    name: "France", 
    code: "FR", 
    currency: "EUR", 
    currencySymbol: "€",
    states: ["Île-de-France", "Provence-Alpes-Côte d'Azur", "Auvergne-Rhône-Alpes", "Nouvelle-Aquitaine", "Occitanie", "Hauts-de-France", "Grand Est"]
  },
  { 
    name: "Japan", 
    code: "JP", 
    currency: "JPY", 
    currencySymbol: "¥",
    states: ["Tokyo", "Osaka", "Hokkaido", "Kyoto", "Fukuoka", "Aichi", "Kanagawa", "Saitama", "Chiba"]
  },
  { 
    name: "China", 
    code: "CN", 
    currency: "CNY", 
    currencySymbol: "¥",
    states: ["Guangdong", "Jiangsu", "Shandong", "Zhejiang", "Henan", "Sichuan", "Hubei", "Hunan", "Beijing", "Shanghai"]
  },
  { 
    name: "India", 
    code: "IN", 
    currency: "INR", 
    currencySymbol: "₹",
    states: ["Maharashtra", "Tamil Nadu", "Karnataka", "Uttar Pradesh", "Gujarat", "West Bengal", "Rajasthan", "Kerala", "Delhi"]
  },
  { 
    name: "Brazil", 
    code: "BR", 
    currency: "BRL", 
    currencySymbol: "R$",
    states: ["São Paulo", "Rio de Janeiro", "Minas Gerais", "Bahia", "Paraná", "Rio Grande do Sul", "Pernambuco"]
  },
  { name: "Switzerland", code: "CH", currency: "CHF", currencySymbol: "CHF", states: ["Zurich", "Geneva", "Vaud", "Bern", "Aargau", "Lucerne"] },
  { name: "Norway", code: "NO", currency: "NOK", currencySymbol: "kr", states: ["Oslo", "Viken", "Vestland", "Rogaland"] },
  { name: "Sweden", code: "SE", currency: "SEK", currencySymbol: "kr", states: ["Stockholm", "Västra Götaland", "Skåne"] },
  { name: "Netherlands", code: "NL", currency: "EUR", currencySymbol: "€", states: ["South Holland", "North Holland", "North Brabant", "Utrecht"] },
  { name: "Belgium", code: "BE", currency: "EUR", currencySymbol: "€", states: ["Antwerp", "East Flanders", "Flemish Brabant", "Brussels"] },
  { name: "Austria", code: "AT", currency: "EUR", currencySymbol: "€", states: ["Vienna", "Lower Austria", "Upper Austria", "Styria"] },
  { name: "Philippines", code: "PH", currency: "PHP", currencySymbol: "₱", states: ["Metro Manila", "Cebu", "Davao", "Iloilo", "Cavite", "Laguna", "Pampanga"] },
  { name: "Singapore", code: "SG", currency: "SGD", currencySymbol: "$", states: ["Central", "North", "East", "West"] },
  { name: "South Korea", code: "KR", currency: "KRW", currencySymbol: "₩", states: ["Seoul", "Busan", "Incheon", "Gyeonggi", "Gyeongsang"] },
  { name: "United Arab Emirates", code: "AE", currency: "AED", currencySymbol: "د.إ", states: ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Ras Al Khaimah"] },
  { name: "Qatar", code: "QA", currency: "QAR", currencySymbol: "ر.ق", states: ["Doha", "Al Rayyan", "Al Wakrah"] },
  { name: "New Zealand", code: "NZ", currency: "NZD", currencySymbol: "$", states: ["Auckland", "Wellington", "Canterbury", "Waikato"] },
  { name: "Ireland", code: "IE", currency: "EUR", currencySymbol: "€", states: ["Dublin", "Cork", "Galway", "Limerick"] },
  { name: "Italy", code: "IT", currency: "EUR", currencySymbol: "€", states: ["Lombardy", "Lazio", "Campania", "Veneto", "Sicily", "Tuscany"] },
  { name: "Spain", code: "ES", currency: "EUR", currencySymbol: "€", states: ["Madrid", "Catalonia", "Andalusia", "Valencia", "Galicia"] },
  { name: "Portugal", code: "PT", currency: "EUR", currencySymbol: "€", states: ["Lisbon", "Porto", "Setúbal", "Braga"] },
  { name: "Denmark", code: "DK", currency: "DKK", currencySymbol: "kr", states: ["Hovedstaden", "Midtjylland", "Syddanmark"] },
  { name: "Finland", code: "FI", currency: "EUR", currencySymbol: "€", states: ["Uusimaa", "Pirkanmaa", "Varsinais-Suomi"] },
  { name: "Greece", code: "GR", currency: "EUR", currencySymbol: "€", states: ["Attica", "Central Macedonia", "Thessaly", "Crete"] },
  { name: "Turkey", code: "TR", currency: "TRY", currencySymbol: "₺", states: ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"] },
  { name: "Mexico", code: "MX", currency: "MXN", currencySymbol: "$", states: ["Mexico City", "Jalisco", "Nuevo León", "Puebla", "Guanajuato"] },
  { name: "Argentina", code: "AR", currency: "ARS", currencySymbol: "$", states: ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza"] },
  { name: "Chile", code: "CL", currency: "CLP", currencySymbol: "$", states: ["Santiago", "Valparaíso", "Biobío"] },
  { name: "Colombia", code: "CO", currency: "COP", currencySymbol: "$", states: ["Bogotá", "Antioquia", "Valle del Cauca", "Atlántico"] },
  { name: "Peru", code: "PE", currency: "PEN", currencySymbol: "S/", states: ["Lima", "Arequipa", "La Libertad", "Piura"] },
  { name: "Thailand", code: "TH", currency: "THB", currencySymbol: "฿", states: ["Bangkok", "Chiang Mai", "Chon Buri", "Phuket"] },
  { name: "Vietnam", code: "VN", currency: "VND", currencySymbol: "₫", states: ["Ho Chi Minh City", "Hanoi", "Da Nang", "Hai Phong"] },
  { name: "Malaysia", code: "MY", currency: "MYR", currencySymbol: "RM", states: ["Selangor", "Kuala Lumpur", "Johor", "Penang"] },
  { name: "Indonesia", code: "ID", currency: "IDR", currencySymbol: "Rp", states: ["Jakarta", "West Java", "East Java", "Bali"] },
  { name: "Poland", code: "PL", currency: "PLN", currencySymbol: "zł", states: ["Mazovian", "Silesian", "Greater Poland", "Lesser Poland"] },
  { name: "Czech Republic", code: "CZ", currency: "CZK", currencySymbol: "Kč", states: ["Prague", "South Moravian", "Central Bohemian"] },
  { name: "Hungary", code: "HU", currency: "HUF", currencySymbol: "Ft", states: ["Budapest", "Pest", "Borsod-Abaúj-Zemplén"] },
  { name: "Israel", code: "IL", currency: "ILS", currencySymbol: "₪", states: ["Tel Aviv", "Jerusalem", "Haifa", "Central District"] },
  { name: "Kuwait", code: "KW", currency: "KWD", currencySymbol: "د.ك", states: ["Al Ahmadi", "Farwaniya", "Hawalli"] },
  { name: "Romania", code: "RO", currency: "RON", currencySymbol: "lei", states: ["Bucharest", "Cluj", "Timiș", "Iași"] },
  { name: "Russia", code: "RU", currency: "RUB", currencySymbol: "₽", states: ["Moscow", "Saint Petersburg", "Sverdlovsk", "Tatarstan"] },
  { name: "Ukraine", code: "UA", currency: "UAH", currencySymbol: "₴", states: ["Kyiv", "Kharkiv", "Lviv", "Odesa"] },
  { name: "Pakistan", code: "PK", currency: "PKR", currencySymbol: "Rs", states: ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan"] },
  { name: "Bangladesh", code: "BD", currency: "BDT", currencySymbol: "৳", states: ["Dhaka", "Chittagong", "Rajshahi", "Khulna"] },
  { name: "Taiwan", code: "TW", currency: "TWD", currencySymbol: "NT$", states: ["New Taipei", "Kaohsiung", "Taichung", "Taipei"] },
  { name: "Luxembourg", code: "LU", currency: "EUR", currencySymbol: "€", states: ["Luxembourg City", "Esch-sur-Alzette", "Differdange"] },
  { name: "Iceland", code: "IS", currency: "ISK", currencySymbol: "kr", states: ["Reykjavík", "Kópavogur", "Hafnarfjörður"] },
  { name: "Malta", code: "MT", currency: "EUR", currencySymbol: "€", states: ["Valletta", "Birkirkara", "Mosta"] },
  { name: "Monaco", code: "MC", currency: "EUR", currencySymbol: "€", states: ["Monte Carlo", "La Condamine", "Fontvieille"] },
  { name: "Saudi Arabia", code: "SA", currency: "SAR", currencySymbol: "SR", states: ["Riyadh", "Makkah", "Madinah", "Eastern Province"] },
  { name: "Bahrain", code: "BH", currency: "BHD", currencySymbol: ".د.ب", states: ["Manama", "Riffa", "Muharraq"] },
  { name: "Oman", code: "OM", currency: "OMR", currencySymbol: "ر.ع.", states: ["Muscat", "Dhofar", "Batinah South"] }
];
