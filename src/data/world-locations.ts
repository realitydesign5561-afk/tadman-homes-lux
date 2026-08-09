/**
 * World locations data for cascading country → state → city dropdowns.
 * Countries: complete list. States/cities: representative selections for popular regions.
 */

export const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas",
  "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin",
  "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia",
  "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Costa Rica", "Croatia",
  "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica",
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
  "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
  "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
  "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
  "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
  "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts & Nevis", "Saint Lucia", "Saint Vincent & the Grenadines",
  "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
  "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
  "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

/** States/provinces keyed by country name. */
export const statesByCountry: Record<string, string[]> = {
  Nigeria: [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
    "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
    "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
    "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
    "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
  ],
  "United States": [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
    "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
    "Washington", "West Virginia", "Wisconsin", "Wyoming",
  ],
  "United Kingdom": [
    "England", "Northern Ireland", "Scotland", "Wales",
  ],
  Canada: [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick",
    "Newfoundland & Labrador", "Northwest Territories", "Nova Scotia",
    "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",
    "Yukon",
  ],
  Australia: [
    "Australian Capital Territory", "New South Wales", "Northern Territory",
    "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia",
  ],
  India: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
    "West Bengal", "Delhi",
  ],
  "South Africa": [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo",
    "Mpumalanga", "North West", "Northern Cape", "Western Cape",
  ],
  Ghana: [
    "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra",
    "North East", "Northern", "Oti", "Savannah", "Upper East", "Upper West",
    "Volta", "Western", "Western North",
  ],
  Kenya: [
    "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu",
    "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho",
    "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale",
    "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
    "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi",
    "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita Taveta",
    "Tana River", "Tharaka-Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu",
    "Vihiga", "Wajir", "West Pokot",
  ],
  "United Arab Emirates": [
    "Abu Dhabi", "Ajman", "Dubai", "Fujairah", "Ras Al Khaimah",
    "Sharjah", "Umm Al Quwain",
  ],
  Germany: [
    "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen",
    "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern",
    "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony",
    "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia",
  ],
  France: [
    "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany",
    "Centre-Val de Loire", "Corsica", "Grand Est", "Hauts-de-France",
    "Île-de-France", "Normandy", "Nouvelle-Aquitaine", "Occitanie",
    "Pays de la Loire", "Provence-Alpes-Côte d'Azur",
  ],
  Spain: [
    "Andalusia", "Aragon", "Asturias", "Balearic Islands", "Basque Country",
    "Canary Islands", "Cantabria", "Castilla-La Mancha", "Castile & León",
    "Catalonia", "Extremadura", "Galicia", "La Rioja", "Madrid",
    "Murcia", "Navarre", "Valencia",
  ],
  Italy: [
    "Abruzzo", "Aosta Valley", "Apulia", "Basilicata", "Calabria", "Campania",
    "Emilia-Romagna", "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardy",
    "Marche", "Molise", "Piedmont", "Sardinia", "Sicily", "Trentino-South Tyrol",
    "Tuscany", "Umbria", "Veneto",
  ],
  Brazil: [
    "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará",
    "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso",
    "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", "Paraná",
    "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte",
    "Rio Grande do Sul", "Rondônia", "Roraima", "Santa Catarina",
    "São Paulo", "Sergipe", "Tocantins",
  ],
  Malaysia: [
    "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Malacca",
    "Negeri Sembilan", "Pahang", "Penang", "Perak", "Perlis", "Putrajaya",
    "Sabah", "Sarawak", "Selangor", "Terengganu",
  ],
  China: [
    "Anhui", "Beijing", "Chongqing", "Fujian", "Gansu", "Guangdong",
    "Guangxi", "Guizhou", "Hainan", "Hebei", "Heilongjiang", "Henan",
    "Hubei", "Hunan", "Inner Mongolia", "Jiangsu", "Jiangxi", "Jilin",
    "Liaoning", "Ningxia", "Qinghai", "Shaanxi", "Shandong", "Shanghai",
    "Shanxi", "Sichuan", "Tianjin", "Tibet", "Xinjiang", "Yunnan", "Zhejiang",
  ],
};

/** Cities keyed by "Country|State". */
export const citiesByState: Record<string, string[]> = {
  "Nigeria|Lagos": [
    "Alimosho", "Apapa", "Badagry", "Epe", "Eti-Osa (Victoria Island/Lekki)",
    "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe",
    "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo",
    "Somolu", "Surulere",
  ],
  "Nigeria|FCT (Abuja)": [
    "Abuja Municipal", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Lugbe", "Nyanya",
  ],
  "Nigeria|Rivers": [
    "Bonny", "Eleme", "Etche", "Gokana", "Ikwerre", "Khana", "Obio-Akpor",
    "Ogba-Egbema-Ndoni", "Ogu-Bolo", "Okrika", "Omuma", "Opobo-Nkoro",
    "Oyigbo", "Port Harcourt", "Tai",
  ],
  "Nigeria|Ogun": [
    "Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Ewekoro", "Ifo",
    "Ijebu East", "Ijebu North", "Ijebu Ode", "Ipokia", "Obafemi Owode",
    "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Sagamu", "Yewa North",
  ],
  "Nigeria|FCT (Abuja)": ["Abuja Central", "Garki", "Maitama", "Wuse", "Asokoro"],
  "United States|California": [
    "Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento",
    "Fresno", "Long Beach", "Oakland", "Bakersfield", "Anaheim",
  ],
  "United States|Texas": [
    "Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso",
    "Arlington", "Corpus Christi", "Plano", "Laredo",
  ],
  "United States|New York": [
    "New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse",
    "Albany", "New Rochelle", "Mount Vernon", "Schenectady", "Utica",
  ],
  "United States|Florida": [
    "Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg",
    "Hialeah", "Tallahassee", "Fort Lauderdale", "Port St. Lucie", "Pembroke Pines",
  ],
  "United Kingdom|England": [
    "London", "Birmingham", "Manchester", "Leeds", "Sheffield",
    "Liverpool", "Bristol", "Newcastle", "Nottingham", "Leicester",
  ],
  "United Kingdom|Scotland": [
    "Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness",
  ],
  "United Kingdom|Wales": ["Cardiff", "Swansea", "Newport", "Bangor"],
  "United Kingdom|Northern Ireland": ["Belfast", "Derry", "Lisburn", "Newry"],
  "United Arab Emirates|Dubai": [
    "Downtown Dubai", "Dubai Marina", "Jumeirah", "Deira", "Bur Dubai",
    "JBR", "Business Bay", "Palm Jumeirah", "Al Quoz", "Silicon Oasis",
  ],
  "United Arab Emirates|Abu Dhabi": [
    "Abu Dhabi City", "Al Ain", "Khalifa City", "Yas Island", "Saadiyat Island",
  ],
  "United Arab Emirates|Sharjah": ["Sharjah City", "Al Majaz", "Al Nahda"],
  "Canada|Ontario": [
    "Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton",
    "London", "Markham", "Vaughan", "Kitchener", "Windsor",
  ],
  "Canada|British Columbia": [
    "Vancouver", "Surrey", "Burnaby", "Richmond", "Kelowna", "Abbotsford",
  ],
  "Canada|Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau"],
  "Australia|New South Wales": [
    "Sydney", "Newcastle", "Wollongong", "Maitland", "Coffs Harbour",
  ],
  "Australia|Victoria": [
    "Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton",
  ],
  "Australia|Queensland": [
    "Brisbane", "Gold Coast", "Sunshine Coast", "Townsville", "Cairns",
  ],
  "South Africa|Gauteng": [
    "Johannesburg", "Pretoria", "Ekurhuleni", "Sandton", "Midrand", "Soweto",
  ],
  "South Africa|Western Cape": [
    "Cape Town", "Stellenbosch", "Paarl", "George", "Knysna",
  ],
  "South Africa|KwaZulu-Natal": [
    "Durban", "Pietermaritzburg", "Newcastle", "Richards Bay",
  ],
  "Ghana|Greater Accra": [
    "Accra", "Tema", "Madina", "Ashaiman", "Lashibi", "East Legon",
  ],
  "Ghana|Ashanti": ["Kumasi", "Obuasi", "Ejisu", "Konongo", "Mampong"],
  "Kenya|Nairobi": [
    "Nairobi CBD", "Westlands", "Karen", "Kilimani", "Langata", "Embakasi",
  ],
  "Kenya|Mombasa": ["Mombasa Island", "Likoni", "Nyali", "Bamburi", "Kisauni"],
  "India|Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad",
  ],
  "India|Delhi": ["New Delhi", "Dwarka", "Noida", "Gurugram", "Faridabad"],
  "India|Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi"],
  "India|Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Malaysia|Selangor": ["Shah Alam", "Petaling Jaya", "Klang", "Subang Jaya", "Ampang"],
  "Malaysia|Kuala Lumpur": ["Chow Kit", "Bukit Bintang", "Bangsar", "Mont Kiara", "Wangsa Maju"],
};

/** Get states for a country. Returns empty array if none defined. */
export function getStates(country: string): string[] {
  return statesByCountry[country] ?? [];
}

/** Get cities for a country + state. Returns empty array if none defined. */
export function getCities(country: string, state: string): string[] {
  return citiesByState[`${country}|${state}`] ?? [];
}
