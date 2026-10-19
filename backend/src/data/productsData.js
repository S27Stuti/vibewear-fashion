const sampleCategories = [
  {
    "_id": "cat_men",
    "name": "Men Collection",
    "slug": "men-collection",
    "targetAudience": "Men",
    "description": "Elevated urban streetwear, tailored essentials & luxury outerwear.",
    "image": "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80",
    "itemCount": "180+ Styles"
  },
  {
    "_id": "cat_women",
    "name": "Women Collection",
    "slug": "women-collection",
    "targetAudience": "Women",
    "description": "Contemporary dresses, high-waisted silhouettes & luxury knitwear.",
    "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    "itemCount": "210+ Styles"
  },
  {
    "_id": "cat_kids",
    "name": "Kids Collection",
    "slug": "kids-collection",
    "targetAudience": "Kids",
    "description": "Vibrant, durable & ultra-comfy streetwear for youngsters.",
    "image": "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80",
    "itemCount": "140+ Styles"
  }
];

const sampleProducts = [
  {
    "_id": "prod_1",
    "id": "prod_1",
    "title": "Urban Oversized Heavyweight Graphic Tee",
    "description": "Crafted from 240 GSM pure combed Turkish cotton, this boxy oversized silhouette features retro-futuristic puff-print graphics and drop shoulders.",
    "price": 499,
    "category": "Men",
    "subCategory": "T-Shirts",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Jet Black",
      "Vintage White",
      "Midnight Purple"
    ],
    "colorImages": {
      "Jet Black": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80",
      "Vintage White": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=900&q=80",
      "Midnight Purple": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 45,
    "rating": 4.9,
    "numReviews": 28,
    "isFeatured": true
  },
  {
    "_id": "prod_2",
    "id": "prod_2",
    "title": "Resort Collar Pure Linen Relaxed Shirt",
    "description": "Breathe freely with 100% natural European washed flax linen. Tailored with a relaxed camp collar, mother-of-pearl buttons, and a vented hem.",
    "price": 649,
    "category": "Men",
    "subCategory": "Shirts",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Crisp White",
      "Midnight Black",
      "Pale Lilac"
    ],
    "colorImages": {
      "Crisp White": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",
      "Midnight Black": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80",
      "Pale Lilac": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 28,
    "rating": 4.7,
    "numReviews": 19,
    "isFeatured": true
  },
  {
    "_id": "prod_3",
    "id": "prod_3",
    "title": "Vintage Acid Wash Relaxed Denim Jacket",
    "description": "14.5 oz rugged Japanese selvage denim featuring vintage stone wash, embossed matte black metal shanks, and twin chest flap pockets.",
    "price": 999,
    "category": "Men",
    "subCategory": "Jackets",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Washed Black",
      "Electric Indigo",
      "Bleached White"
    ],
    "colorImages": {
      "Washed Black": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80",
      "Electric Indigo": "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 20,
    "rating": 4.8,
    "numReviews": 32,
    "isFeatured": false
  },
  {
    "_id": "prod_4",
    "id": "prod_4",
    "title": "VibeTech Technical Shell Windbreaker",
    "description": "Water-repellent ripstop nylon shell with taped water-resistant zippers, concealed storm hood, and breathable underarm mesh ventilation.",
    "price": 999,
    "category": "Men",
    "subCategory": "Jackets",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Stealth Black",
      "Neon Violet",
      "Cyber Silver"
    ],
    "colorImages": {
      "Stealth Black": "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80",
      "Neon Violet": "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 22,
    "rating": 4.8,
    "numReviews": 24,
    "isFeatured": false
  },
  {
    "_id": "prod_5",
    "id": "prod_5",
    "title": "Minimalist Heavyweight Fleece Hoodie",
    "description": "450 GSM diagonal loopback French terry with double-layered hood without drawstrings for an ultra-clean modern aesthetic.",
    "price": 899,
    "category": "Men",
    "subCategory": "Hoodies",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Obsidian Black",
      "Royal Purple",
      "Chalk White"
    ],
    "colorImages": {
      "Obsidian Black": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80",
      "Royal Purple": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 35,
    "rating": 4.9,
    "numReviews": 41,
    "isFeatured": true
  },
  {
    "_id": "prod_6",
    "id": "prod_6",
    "title": "Tactical Utility Relaxed Cargo Pants",
    "description": "Heavyweight cotton twill engineered with 6 functional snap pockets, adjustable ankle cinch cords, and reinforced articulated knees.",
    "price": 749,
    "category": "Men",
    "subCategory": "Pants",
    "sizes": [
      "30",
      "32",
      "34",
      "36"
    ],
    "colors": [
      "Dark Charcoal",
      "Deep Plum",
      "Raw Ecru"
    ],
    "colorImages": {
      "Dark Charcoal": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 30,
    "rating": 4.8,
    "numReviews": 29,
    "isFeatured": false
  },
  {
    "_id": "prod_7",
    "id": "prod_7",
    "title": "Tailored Wide-Leg Pleated Trousers",
    "description": "Crafted with premium Italian wool-blend fabric, double front pleats, and an elegant fluid drape designed for formal streetwear crossover.",
    "price": 749,
    "category": "Men",
    "subCategory": "Pants",
    "sizes": [
      "30",
      "32",
      "34",
      "36"
    ],
    "colors": [
      "Onyx Black",
      "Lavender Smoke",
      "Cream White"
    ],
    "colorImages": {
      "Onyx Black": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 19,
    "rating": 4.9,
    "numReviews": 18,
    "isFeatured": true
  },
  {
    "_id": "prod_8",
    "id": "prod_8",
    "title": "Knit Ribbed Mockneck Luxury Sweater",
    "description": "Fine gauge merino-cotton knit with raglan sleeve construction, ribbed collar, and temperature-regulating natural yarns.",
    "price": 899,
    "category": "Men",
    "subCategory": "Sweaters",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Ink Black",
      "Mauve Purple",
      "Snow White"
    ],
    "colorImages": {
      "Ink Black": "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 25,
    "rating": 4.8,
    "numReviews": 15,
    "isFeatured": false
  },
  {
    "_id": "prod_9",
    "id": "prod_9",
    "title": "Retro Distressed Boxy Vintage Band Tee",
    "description": "Enzyme-washed cotton tee with hand-distressed ribbed neckline and washed vintage neon graphic imprint.",
    "price": 499,
    "category": "Men",
    "subCategory": "T-Shirts",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Charcoal Black",
      "Faded Plum"
    ],
    "colorImages": {
      "Charcoal Black": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 35,
    "rating": 4.8,
    "numReviews": 22,
    "isFeatured": true
  },
  {
    "_id": "prod_10",
    "id": "prod_10",
    "title": "Heavyweight French Terry Joggers",
    "description": "Ultra-dense 420 GSM cotton fleece with deep zippered pockets and elasticated ankle cuffs.",
    "price": 749,
    "category": "Men",
    "subCategory": "Pants",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Midnight Black",
      "Deep Violet"
    ],
    "colorImages": {
      "Midnight Black": "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 40,
    "rating": 4.9,
    "numReviews": 33,
    "isFeatured": false
  },
  {
    "_id": "prod_11",
    "id": "prod_11",
    "title": "Brushed Cotton Buffalo Plaid Overshirt",
    "description": "Substantial brushed heavyweight twill flannel with double chest pockets and horn buttons.",
    "price": 649,
    "category": "Men",
    "subCategory": "Shirts",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black & Plum Plaid",
      "Monochrome Grid"
    ],
    "colorImages": {
      "Black & Plum Plaid": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 28,
    "rating": 4.7,
    "numReviews": 14,
    "isFeatured": false
  },
  {
    "_id": "prod_12",
    "id": "prod_12",
    "title": "Suede Minimalist Zip Harrington Jacket",
    "description": "Buttery soft faux suede shell with satin interior lining and antiqued silver zip hardware.",
    "price": 999,
    "category": "Men",
    "subCategory": "Jackets",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Obsidian Black",
      "Smoke Lilac"
    ],
    "colorImages": {
      "Obsidian Black": "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 18,
    "rating": 4.9,
    "numReviews": 21,
    "isFeatured": true
  },
  {
    "_id": "prod_13",
    "id": "prod_13",
    "title": "Relaxed Drawstring Chino Sweat-Shorts",
    "description": "Double-faced interlock cotton blend shorts with metal aglet drawstrings and raw hem.",
    "price": 499,
    "category": "Men",
    "subCategory": "Shorts",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Pitch Black",
      "Lilac Mist",
      "Pure White"
    ],
    "colorImages": {
      "Pitch Black": "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 35,
    "rating": 4.7,
    "numReviews": 16,
    "isFeatured": false
  },
  {
    "_id": "prod_14",
    "id": "prod_14",
    "title": "Waffle Knit Thermal Longsleeve Base",
    "description": "300 GSM thermal honeycomb knit fabric providing insulation and subtle texture.",
    "price": 499,
    "category": "Men",
    "subCategory": "T-Shirts",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Jet Black",
      "Snow White"
    ],
    "colorImages": {
      "Jet Black": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 30,
    "rating": 4.8,
    "numReviews": 19,
    "isFeatured": false
  },
  {
    "_id": "prod_15",
    "id": "prod_15",
    "title": "Double-Breasted Relaxed Streetwear Blazer",
    "description": "Unstructured shoulders with wide peak lapels cut in breathable tropical wool-blend.",
    "price": 999,
    "category": "Men",
    "subCategory": "Jackets",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Midnight Obsidian",
      "Mauve Twilight"
    ],
    "colorImages": {
      "Midnight Obsidian": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 15,
    "rating": 4.9,
    "numReviews": 27,
    "isFeatured": true
  },
  {
    "_id": "prod_16",
    "id": "prod_16",
    "title": "Textured Ribbed Knit Zipper Polo",
    "description": "Fine ribbed cotton yarn with quarter metal zip collar and banded sleeves.",
    "price": 649,
    "category": "Men",
    "subCategory": "Shirts",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Onyx Black",
      "Violet Ash"
    ],
    "colorImages": {
      "Onyx Black": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 24,
    "rating": 4.8,
    "numReviews": 13,
    "isFeatured": false
  },
  {
    "_id": "prod_17",
    "id": "prod_17",
    "title": "Waterproof Oversized Trench Duster Coat",
    "description": "Storm flap duster coat with adjustable belt waist and deep welted pockets.",
    "price": 999,
    "category": "Men",
    "subCategory": "Jackets",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Carbon Black",
      "Pale Stone"
    ],
    "colorImages": {
      "Carbon Black": "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 12,
    "rating": 5,
    "numReviews": 31,
    "isFeatured": true
  },
  {
    "_id": "prod_18",
    "id": "prod_18",
    "title": "Vintage Bleached Straight-Leg Denim Jeans",
    "description": "100% non-stretch cotton denim with retro faded wash and custom branded metal rivets.",
    "price": 749,
    "category": "Men",
    "subCategory": "Pants",
    "sizes": [
      "30",
      "32",
      "34",
      "36"
    ],
    "colors": [
      "Washed Black",
      "Bleached Lilac"
    ],
    "colorImages": {
      "Washed Black": "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 28,
    "rating": 4.8,
    "numReviews": 24,
    "isFeatured": false
  },
  {
    "_id": "prod_19",
    "id": "prod_19",
    "title": "Noir Silhouette Sculpting Bodycon Dress",
    "description": "Double-layered high-compression modal fabric that gently sculpts every curve. Features a sophisticated square neckline and subtle back vent.",
    "price": 599,
    "category": "Women",
    "subCategory": "Dresses",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Midnight Black",
      "Electric Magenta",
      "Champagne White"
    ],
    "colorImages": {
      "Midnight Black": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
      "Electric Magenta": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 32,
    "rating": 4.9,
    "numReviews": 53,
    "isFeatured": true
  },
  {
    "_id": "prod_20",
    "id": "prod_20",
    "title": "CloudSoft Cashmere Blend Crop Hoodie",
    "description": "Spun from Mongolian cashmere and ultra-fine combed cotton. Features dropped shoulders, a raw unfinished crop hem, and kangaroo front pocket.",
    "price": 899,
    "category": "Women",
    "subCategory": "Hoodies",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Blush Pink",
      "Rich Violet",
      "Pitch Black"
    ],
    "colorImages": {
      "Blush Pink": "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80",
      "Rich Violet": "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=900&q=80",
      "Pitch Black": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 26,
    "rating": 4.8,
    "numReviews": 38,
    "isFeatured": true
  },
  {
    "_id": "prod_21",
    "id": "prod_21",
    "title": "High-Rise Wide-Leg Flowy Pleated Trousers",
    "description": "Designed for fluid movement with clean pressed pleats, discreet side zip closure, and lightweight non-crease twill weave.",
    "price": 749,
    "category": "Women",
    "subCategory": "Pants",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Chalk White",
      "Pastel Pink",
      "Deep Onyx"
    ],
    "colorImages": {
      "Chalk White": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 24,
    "rating": 4.7,
    "numReviews": 22,
    "isFeatured": false
  },
  {
    "_id": "prod_22",
    "id": "prod_22",
    "title": "Oversized Double-Breasted Tailored Blazer",
    "description": "Sharp padded shoulders, notched lapels, and tortoiseshell buttons crafted with structural wool blend for an empowering statement silhouette.",
    "price": 999,
    "category": "Women",
    "subCategory": "Jackets",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Shadow Black",
      "Orchid Purple",
      "Pure Coconut"
    ],
    "colorImages": {
      "Shadow Black": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 15,
    "rating": 4.9,
    "numReviews": 31,
    "isFeatured": true
  },
  {
    "_id": "prod_23",
    "id": "prod_23",
    "title": "Satin Bias Cut Fluid Midi Slip Dress",
    "description": "High-lustre Mulberry silk-satin blend with cowl neckline, delicate adjustable criss-cross straps, and effortless diagonal drape.",
    "price": 599,
    "category": "Women",
    "subCategory": "Dresses",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Neon Rose",
      "Royal Mulberry",
      "Pearl White"
    ],
    "colorImages": {
      "Neon Rose": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 22,
    "rating": 4.8,
    "numReviews": 29,
    "isFeatured": true
  },
  {
    "_id": "prod_24",
    "id": "prod_24",
    "title": "Seamless Ribbed Athleisure Activewear Set",
    "description": "Includes compressive ribbed sports crop top and high-waisted anti-roll sculpting biker shorts. 4-way stretch moisture-wicking technology.",
    "price": 699,
    "category": "Women",
    "subCategory": "Activewear",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Hot Pink",
      "Lavender Mist",
      "Core Black"
    ],
    "colorImages": {
      "Hot Pink": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 35,
    "rating": 4.9,
    "numReviews": 47,
    "isFeatured": false
  },
  {
    "_id": "prod_25",
    "id": "prod_25",
    "title": "Distressed Baggy Boyfriend Denim Jeans",
    "description": "Vintage high-rise fit with loose thigh cut, intentional distressed knee tears, and washed soft cotton denim.",
    "price": 749,
    "category": "Women",
    "subCategory": "Pants",
    "sizes": [
      "26",
      "28",
      "30",
      "32"
    ],
    "colors": [
      "Faded Indigo",
      "Washed Black",
      "Snow Bleach"
    ],
    "colorImages": {
      "Faded Indigo": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 28,
    "rating": 4.7,
    "numReviews": 26,
    "isFeatured": false
  },
  {
    "_id": "prod_26",
    "id": "prod_26",
    "title": "Bohemian Tiered Chiffon Maxi Dress",
    "description": "Airy lightweight chiffon with smocked bodice, ruffled cap sleeves, and romantic tiered floor-skimming skirt with floral accents.",
    "price": 599,
    "category": "Women",
    "subCategory": "Dresses",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Dusty Rose",
      "Deep Amethyst",
      "Ivory Bloom"
    ],
    "colorImages": {
      "Dusty Rose": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 18,
    "rating": 4.9,
    "numReviews": 19,
    "isFeatured": true
  },
  {
    "_id": "prod_27",
    "id": "prod_27",
    "title": "Cropped Ribbed Mockneck Knit Sweater",
    "description": "Ultra-soft chunky ribbed knit sweater featuring bell cuffs and a cropped waist designed to pair with high-waisted bottoms.",
    "price": 899,
    "category": "Women",
    "subCategory": "Sweaters",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Baby Pink",
      "Midnight Violet",
      "Pure Snow"
    ],
    "colorImages": {
      "Baby Pink": "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 26,
    "rating": 4.8,
    "numReviews": 31,
    "isFeatured": false
  },
  {
    "_id": "prod_28",
    "id": "prod_28",
    "title": "Square-Neck Double-Layer Modal Bodysuit",
    "description": "Buttery smooth seamless bodysuit with snap thong closure and supportive double-layered modal front.",
    "price": 599,
    "category": "Women",
    "subCategory": "Tops",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Pitch Black",
      "Fuchsia Glow",
      "Porcelain White"
    ],
    "colorImages": {
      "Pitch Black": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 45,
    "rating": 4.9,
    "numReviews": 44,
    "isFeatured": true
  },
  {
    "_id": "prod_29",
    "id": "prod_29",
    "title": "High-Waisted Knife-Pleated Tennis Skort",
    "description": "Built-in compressive spandex shorts with hidden phone pocket underneath razor-sharp knife pleats.",
    "price": 599,
    "category": "Women",
    "subCategory": "Skirts",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Bright White",
      "Neon Pink",
      "Raven Black"
    ],
    "colorImages": {
      "Bright White": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 30,
    "rating": 4.7,
    "numReviews": 28,
    "isFeatured": false
  },
  {
    "_id": "prod_30",
    "id": "prod_30",
    "title": "Waterproof Oversized Trench Duster Coat",
    "description": "Classic double-breasted trench with tortoiseshell buckle belt and protective storm shoulder shield.",
    "price": 999,
    "category": "Women",
    "subCategory": "Jackets",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Onyx Black",
      "Lavender Smoke"
    ],
    "colorImages": {
      "Onyx Black": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 14,
    "rating": 5,
    "numReviews": 36,
    "isFeatured": true
  },
  {
    "_id": "prod_31",
    "id": "prod_31",
    "title": "Chunky Cable Knit Slouchy Cardigan",
    "description": "Cozy oversized cardigan with horn buttons, drop shoulders, and warm ribbed patch pockets.",
    "price": 899,
    "category": "Women",
    "subCategory": "Sweaters",
    "sizes": [
      "XS/S",
      "M/L"
    ],
    "colors": [
      "Dusty Rose",
      "Violet Melange",
      "Cream"
    ],
    "colorImages": {
      "Dusty Rose": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 20,
    "rating": 4.8,
    "numReviews": 17,
    "isFeatured": false
  },
  {
    "_id": "prod_32",
    "id": "prod_32",
    "title": "Liquid Satin Draped Backless Halter Top",
    "description": "High cowl neckline cascading down with an open back tied with lustrous satin strings.",
    "price": 599,
    "category": "Women",
    "subCategory": "Tops",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Neon Magenta",
      "Black Diamond"
    ],
    "colorImages": {
      "Neon Magenta": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 22,
    "rating": 4.9,
    "numReviews": 25,
    "isFeatured": true
  },
  {
    "_id": "prod_33",
    "id": "prod_33",
    "title": "High-Waisted Tailored Linen Shorts",
    "description": "Pleated front with wide leg cuffs and a matching self-tie fabric belt in European linen.",
    "price": 499,
    "category": "Women",
    "subCategory": "Shorts",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Lilac Dawn",
      "Crisp Chalk",
      "Carbon"
    ],
    "colorImages": {
      "Lilac Dawn": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 25,
    "rating": 4.7,
    "numReviews": 12,
    "isFeatured": false
  },
  {
    "_id": "prod_34",
    "id": "prod_34",
    "title": "Crushed Velvet Boned Corset Mini Dress",
    "description": "Internal structural boning providing hourglass definition with plush stretch crushed velvet.",
    "price": 599,
    "category": "Women",
    "subCategory": "Dresses",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Royal Amethyst",
      "Midnight Black"
    ],
    "colorImages": {
      "Royal Amethyst": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 16,
    "rating": 4.9,
    "numReviews": 39,
    "isFeatured": true
  },
  {
    "_id": "prod_35",
    "id": "prod_35",
    "title": "Retro Boxy Crop Graphic Streetwear Tee",
    "description": "Drop shoulder boxy cut 220 GSM combed cotton with metallic holographic slogan print.",
    "price": 499,
    "category": "Women",
    "subCategory": "T-Shirts",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Vintage Black",
      "Bubblegum Pink"
    ],
    "colorImages": {
      "Vintage Black": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 38,
    "rating": 4.8,
    "numReviews": 20,
    "isFeatured": false
  },
  {
    "_id": "prod_36",
    "id": "prod_36",
    "title": "Wide-Leg Raw-Hem Utility Denim Jumpsuit",
    "description": "Zip-front boiler suit with belted waist, oversized utility chest pockets, and raw ankle hems.",
    "price": 999,
    "category": "Women",
    "subCategory": "Jumpsuits",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Washed Black",
      "Vintage Violet"
    ],
    "colorImages": {
      "Washed Black": "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 15,
    "rating": 4.9,
    "numReviews": 18,
    "isFeatured": true
  },
  {
    "_id": "prod_37",
    "id": "prod_37",
    "title": "Neon Play Active Zip Hoodie & Joggers Set",
    "description": "Ultra-durable anti-pilling organic cotton blend set with vibrant neon colorblock panels, secure zippered pockets, and reinforced knees.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Sets",
    "sizes": [
      "4Y",
      "6Y",
      "8Y",
      "10Y",
      "12Y"
    ],
    "colors": [
      "Hot Pink & Purple",
      "Cyber Black & Pink",
      "Electric Violet"
    ],
    "colorImages": {
      "Hot Pink & Purple": "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 40,
    "rating": 4.9,
    "numReviews": 27,
    "isFeatured": true
  },
  {
    "_id": "prod_38",
    "id": "prod_38",
    "title": "Street Junior Graphic Relaxed Cotton Tee",
    "description": "100% bio-washed breathable hypoallergenic jersey cotton. Soft rib collar and non-scratch heat-transfer inner neck label.",
    "price": 299,
    "category": "Kids",
    "subCategory": "T-Shirts",
    "sizes": [
      "4Y",
      "6Y",
      "8Y",
      "10Y"
    ],
    "colors": [
      "Magenta Glow",
      "Graphic Black",
      "Crisp White"
    ],
    "colorImages": {
      "Magenta Glow": "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 35,
    "rating": 4.8,
    "numReviews": 16,
    "isFeatured": false
  },
  {
    "_id": "prod_39",
    "id": "prod_39",
    "title": "Kids Pastel Colorblock Lightweight Puffer",
    "description": "Down-alternative insulated windproof puffer jacket with storm cuffs, detachable fleece-lined hood, and reflective safety piping.",
    "price": 499,
    "category": "Kids",
    "subCategory": "Jackets",
    "sizes": [
      "4Y",
      "6Y",
      "8Y",
      "10Y"
    ],
    "colors": [
      "Candy Pink & Violet",
      "Midnight & Lilac"
    ],
    "colorImages": {
      "Candy Pink & Violet": "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 25,
    "rating": 4.9,
    "numReviews": 19,
    "isFeatured": true
  },
  {
    "_id": "prod_40",
    "id": "prod_40",
    "title": "Kids Safari Explorer Tee & Shorts Set",
    "description": "100% breathable organic cotton jersey set with cute wildlife embroidery and stretchy drawstring elasticated shorts.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Sets",
    "sizes": [
      "2Y",
      "3Y",
      "4Y",
      "5Y",
      "6Y"
    ],
    "colors": [
      "Lilac Bloom",
      "Graphite Black"
    ],
    "colorImages": {
      "Lilac Bloom": "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 40,
    "rating": 4.7,
    "numReviews": 14,
    "isFeatured": false
  },
  {
    "_id": "prod_41",
    "id": "prod_41",
    "title": "Kids Cozy Fleece Kangaroo Pocket Hoodie",
    "description": "Plush brushed fleece interior hoodie with ribbed cuffs and hem, drop shoulders, and durable double-needle stitching.",
    "price": 499,
    "category": "Kids",
    "subCategory": "Hoodies",
    "sizes": [
      "4Y",
      "6Y",
      "8Y",
      "10Y",
      "12Y"
    ],
    "colors": [
      "Berry Pink",
      "Deep Violet",
      "Pure Snow"
    ],
    "colorImages": {
      "Berry Pink": "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 30,
    "rating": 4.8,
    "numReviews": 21,
    "isFeatured": true
  },
  {
    "_id": "prod_42",
    "id": "prod_42",
    "title": "Kids Stretch Denim Overalls & Tee Set",
    "description": "Soft flexible washed denim overalls with adjustable buckled shoulder straps paired with a classic striped cotton tee.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Sets",
    "sizes": [
      "3Y",
      "4Y",
      "5Y",
      "6Y",
      "7Y"
    ],
    "colors": [
      "Washed Black & White",
      "Vintage Indigo"
    ],
    "colorImages": {
      "Washed Black & White": "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 22,
    "rating": 4.9,
    "numReviews": 18,
    "isFeatured": false
  },
  {
    "_id": "prod_43",
    "id": "prod_43",
    "title": "Kids Starry Sparkle Twirl Tulle Dress",
    "description": "Soft cotton-lined bodice with multi-layer sparkly glitter tulle skirt made for twirling without any itchiness.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Dresses",
    "sizes": [
      "3Y",
      "4Y",
      "5Y",
      "6Y",
      "8Y"
    ],
    "colors": [
      "Cotton Candy Pink",
      "Magical Violet"
    ],
    "colorImages": {
      "Cotton Candy Pink": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 18,
    "rating": 4.9,
    "numReviews": 25,
    "isFeatured": true
  },
  {
    "_id": "prod_44",
    "id": "prod_44",
    "title": "Kids Urban Explorer Elastic Track Pants",
    "description": "Tough double-knee track pants with ribbed cuffs, elasticated waistband, and reflective side stripes.",
    "price": 399,
    "category": "Kids",
    "subCategory": "Pants",
    "sizes": [
      "4Y",
      "6Y",
      "8Y",
      "10Y",
      "12Y"
    ],
    "colors": [
      "Pitch Black",
      "Deep Purple"
    ],
    "colorImages": {
      "Pitch Black": "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 32,
    "rating": 4.7,
    "numReviews": 17,
    "isFeatured": false
  },
  {
    "_id": "prod_45",
    "id": "prod_45",
    "title": "Kids Sherpa-Lined Warm Denim Winter Jacket",
    "description": "Thick cozy faux sherpa fleece interior with rugged washed denim outer and snap button front.",
    "price": 499,
    "category": "Kids",
    "subCategory": "Jackets",
    "sizes": [
      "4Y",
      "6Y",
      "8Y",
      "10Y"
    ],
    "colors": [
      "Washed Black",
      "Indigo Lilac"
    ],
    "colorImages": {
      "Washed Black": "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 20,
    "rating": 4.9,
    "numReviews": 23,
    "isFeatured": true
  },
  {
    "_id": "prod_46",
    "id": "prod_46",
    "title": "Kids Organic Cotton Pocket Graphic Sweatshirt",
    "description": "Pure French terry crewneck sweatshirt with cute pocket character embroidery and ribbed trim.",
    "price": 499,
    "category": "Kids",
    "subCategory": "Hoodies",
    "sizes": [
      "2Y",
      "4Y",
      "6Y",
      "8Y"
    ],
    "colors": [
      "Blush Pink",
      "Violet Twilight"
    ],
    "colorImages": {
      "Blush Pink": "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 30,
    "rating": 4.8,
    "numReviews": 15,
    "isFeatured": false
  },
  {
    "_id": "prod_47",
    "id": "prod_47",
    "title": "Kids Waterproof Hooded Rain Windbreaker",
    "description": "Ultralight water-repellent jacket that packs into its own pocket with reflective safety badges.",
    "price": 499,
    "category": "Kids",
    "subCategory": "Jackets",
    "sizes": [
      "4Y",
      "6Y",
      "8Y",
      "10Y"
    ],
    "colors": [
      "Neon Pink & Violet",
      "Cyber Black"
    ],
    "colorImages": {
      "Neon Pink & Violet": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 25,
    "rating": 4.8,
    "numReviews": 19,
    "isFeatured": false
  },
  {
    "_id": "prod_48",
    "id": "prod_48",
    "title": "Kids Tiered Cotton Play Romper",
    "description": "Breathable lightweight organic cotton gauze romper with flutter ruffle shoulders and snap legs.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Sets",
    "sizes": [
      "1Y",
      "2Y",
      "3Y",
      "4Y"
    ],
    "colors": [
      "Pastel Rose",
      "Lilac Bloom"
    ],
    "colorImages": {
      "Pastel Rose": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 28,
    "rating": 4.9,
    "numReviews": 14,
    "isFeatured": true
  },
  {
    "_id": "prod_49",
    "id": "prod_49",
    "title": "Kids Classic Breton Striped Cotton Crewneck",
    "description": "Heavy combed cotton striped tee that stays soft wash after wash with stretch neck opening.",
    "price": 299,
    "category": "Kids",
    "subCategory": "T-Shirts",
    "sizes": [
      "2Y",
      "4Y",
      "6Y",
      "8Y",
      "10Y"
    ],
    "colors": [
      "Black & White Stripe",
      "Pink & White"
    ],
    "colorImages": {
      "Black & White Stripe": "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 40,
    "rating": 4.7,
    "numReviews": 18,
    "isFeatured": false
  },
  {
    "_id": "prod_50",
    "id": "prod_50",
    "title": "Kids Stretch Ripstop Outdoor Cargo Shorts",
    "description": "Tear-resistant flexible shorts with elastic waistband and 4 deep velcro utility pockets.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Shorts",
    "sizes": [
      "4Y",
      "6Y",
      "8Y",
      "10Y",
      "12Y"
    ],
    "colors": [
      "Pitch Black",
      "Dark Plum"
    ],
    "colorImages": {
      "Pitch Black": "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 35,
    "rating": 4.8,
    "numReviews": 16,
    "isFeatured": false
  },
  {
    "_id": "prod_51",
    "id": "prod_51",
    "title": "Kids Pastel Tie-Dye Cozy Loungewear Set",
    "description": "Custom hand-dipped pastel tie-dye pullover sweatshirt and sweatpants crafted from ultra-soft brushed fleece.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Sets",
    "sizes": [
      "3Y",
      "4Y",
      "6Y",
      "8Y",
      "10Y"
    ],
    "colors": [
      "Pink & Violet Swirl",
      "Obsidian Marble"
    ],
    "colorImages": {
      "Pink & Violet Swirl": "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 25,
    "rating": 4.9,
    "numReviews": 29,
    "isFeatured": true
  },
  {
    "_id": "prod_52",
    "id": "prod_52",
    "title": "Kids Quilted Lightweight Puffer Vest",
    "description": "Sleeveless lightweight insulated puffer vest with mockneck zipper and water-resistant finish.",
    "price": 499,
    "category": "Kids",
    "subCategory": "Jackets",
    "sizes": [
      "4Y",
      "6Y",
      "8Y",
      "10Y"
    ],
    "colors": [
      "Magenta Glow",
      "Jet Black"
    ],
    "colorImages": {
      "Magenta Glow": "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    },
    "images": [
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 20,
    "rating": 4.8,
    "numReviews": 13,
    "isFeatured": false
  },
  {
    "_id": "prod_m_19",
    "id": "prod_m_19",
    "title": "Minimalist Mock Neck Heavyweight Boxy Tee",
    "description": "Constructed from 260 GSM dense cotton with a reinforced 1.5-inch ribbed mock collar and architectural drop-shoulder cut.",
    "price": 499,
    "category": "Men",
    "subCategory": "T-Shirts",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Jet Black",
      "Chalk White",
      "Lilac"
    ],
    "images": [
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 35,
    "rating": 4.8,
    "numReviews": 24,
    "isFeatured": true
  },
  {
    "_id": "prod_m_20",
    "id": "prod_m_20",
    "title": "Heavy Cotton Oversized Flannel Check Overshirt",
    "description": "Thick brushed cotton flannel featuring oversized silhouette, dual buttoned flap chest pockets, and durable horn buttons.",
    "price": 649,
    "category": "Men",
    "subCategory": "Shirts",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Monochrome Black/White",
      "Violet Accent"
    ],
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 28,
    "rating": 4.7,
    "numReviews": 19,
    "isFeatured": false
  },
  {
    "_id": "prod_m_21",
    "id": "prod_m_21",
    "title": "Pleated Relaxed Fluid Dress Trousers",
    "description": "Double front pleats and fluid draping in a luxury crease-resistant twill. Finished with an internal grip waistband.",
    "price": 749,
    "category": "Men",
    "subCategory": "Pants",
    "sizes": [
      "30",
      "32",
      "34",
      "36"
    ],
    "colors": [
      "Pitch Black",
      "Off White"
    ],
    "images": [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 22,
    "rating": 4.9,
    "numReviews": 31,
    "isFeatured": true
  },
  {
    "_id": "prod_m_22",
    "id": "prod_m_22",
    "title": "Technical Waterproof Hooded Street Shell",
    "description": "3-layer bonded technical waterproof breathable fabric with taped seams, aquaguard zippers, and ergonomic articulated sleeves.",
    "price": 999,
    "category": "Men",
    "subCategory": "Jackets",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Obsidian Black",
      "Royal Purple"
    ],
    "images": [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 18,
    "rating": 4.9,
    "numReviews": 45,
    "isFeatured": true
  },
  {
    "_id": "prod_m_23",
    "id": "prod_m_23",
    "title": "Retro Waffle Knit Long-Sleeve Thermal Henley",
    "description": "Soft thermal honeycomb cotton weave with three-button placket and reinforced ribbed cuffs for year-round layering.",
    "price": 499,
    "category": "Men",
    "subCategory": "T-Shirts",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Midnight Violet",
      "Washed White",
      "Jet Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 40,
    "rating": 4.6,
    "numReviews": 18,
    "isFeatured": false
  },
  {
    "_id": "prod_m_24",
    "id": "prod_m_24",
    "title": "Luxury Satin Camp Collar Evening Shirt",
    "description": "Lustrous heavyweight modal satin offering a fluid drape, open notch camp collar, and curved hemline.",
    "price": 649,
    "category": "Men",
    "subCategory": "Shirts",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Onyx Black",
      "Lavender Mist"
    ],
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 25,
    "rating": 4.8,
    "numReviews": 22,
    "isFeatured": false
  },
  {
    "_id": "prod_m_25",
    "id": "prod_m_25",
    "title": "Distressed Carpenter Wide-Leg Denim Trousers",
    "description": "13.5 oz heavy ring-spun denim with utility hammer loop, contrast stitching, reinforced knee patches, and relaxed straight leg.",
    "price": 749,
    "category": "Men",
    "subCategory": "Jeans",
    "sizes": [
      "30",
      "32",
      "34",
      "36"
    ],
    "colors": [
      "Washed Black",
      "Vintage Ecru"
    ],
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 20,
    "rating": 4.7,
    "numReviews": 16,
    "isFeatured": false
  },
  {
    "_id": "prod_m_26",
    "id": "prod_m_26",
    "title": "Structured Wool-Blend Minimalist Overcoat",
    "description": "Tailored single-breasted topcoat made from dense insulating wool blend. Features sharp lapels, satin lining, and back vent.",
    "price": 999,
    "category": "Men",
    "subCategory": "Jackets",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Pitch Black",
      "Pale Lilac"
    ],
    "images": [
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 15,
    "rating": 4.9,
    "numReviews": 38,
    "isFeatured": true
  },
  {
    "_id": "prod_m_27",
    "id": "prod_m_27",
    "title": "Heavy French Terry Streetwear Drop Shorts",
    "description": "400 GSM unbrushed loopback cotton shorts with deep zip pockets, elongated cotton drawstrings, and relaxed knee-length fit.",
    "price": 499,
    "category": "Men",
    "subCategory": "Shorts",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "Bright Violet",
      "Pure White"
    ],
    "images": [
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 45,
    "rating": 4.7,
    "numReviews": 29,
    "isFeatured": false
  },
  {
    "_id": "prod_m_28",
    "id": "prod_m_28",
    "title": "Pique Cotton Athletic Tennis Polo",
    "description": "Breathable combed pique cotton with structured flat-knit collar, two-button placket, and subtle split side vents.",
    "price": 499,
    "category": "Men",
    "subCategory": "Polos",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Crisp White",
      "Midnight Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 30,
    "rating": 4.6,
    "numReviews": 17,
    "isFeatured": false
  },
  {
    "_id": "prod_w_29",
    "id": "prod_w_29",
    "title": "Sculpt High-Neck Ribbed Contour Bodysuit",
    "description": "Double-layered seamless micro-ribbed knit bodysuit with thong back and snap closure. Sculpting fit for clean lines.",
    "price": 599,
    "category": "Women",
    "subCategory": "Tops",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Cyber Pink",
      "Jet Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 35,
    "rating": 4.8,
    "numReviews": 32,
    "isFeatured": true
  },
  {
    "_id": "prod_w_30",
    "id": "prod_w_30",
    "title": "Double-Pleat Wide Leg Fluid Palazzo Pants",
    "description": "Dramatic wide-leg silhouette in breathable fluid crepe. High-rise waist with clean zip fly and slash side pockets.",
    "price": 749,
    "category": "Women",
    "subCategory": "Pants",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Chalk White",
      "Lavender Orchid"
    ],
    "images": [
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 24,
    "rating": 4.9,
    "numReviews": 28,
    "isFeatured": true
  },
  {
    "_id": "prod_w_31",
    "id": "prod_w_31",
    "title": "Draped Cowl Neck Silk Satin Blouse",
    "description": "Pure mulberry silk satin with a delicate cowl neckline, slight cap shoulders, and a lustrous soft drape.",
    "price": 599,
    "category": "Women",
    "subCategory": "Tops",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Soft Pink",
      "Midnight Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 28,
    "rating": 4.7,
    "numReviews": 19,
    "isFeatured": false
  },
  {
    "_id": "prod_w_32",
    "id": "prod_w_32",
    "title": "Vintage Leatherette Relaxed Bomber Jacket",
    "description": "Supple vegan grain leatherette with dropped shoulders, heavyweight metal zipper, and chunky elastic ribbing at collar and cuffs.",
    "price": 999,
    "category": "Women",
    "subCategory": "Jackets",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Pitch Black",
      "Deep Magenta"
    ],
    "images": [
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 18,
    "rating": 4.9,
    "numReviews": 42,
    "isFeatured": true
  },
  {
    "_id": "prod_w_33",
    "id": "prod_w_33",
    "title": "Tiered Ruffle Chiffon Halter Maxi Dress",
    "description": "Ethereal tiered ruffled skirt with a sleek halter neck and keyhole back closure. Includes matching sash tie at waist.",
    "price": 599,
    "category": "Women",
    "subCategory": "Dresses",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Fairy Pink",
      "Starry Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 20,
    "rating": 4.8,
    "numReviews": 26,
    "isFeatured": false
  },
  {
    "_id": "prod_w_34",
    "id": "prod_w_34",
    "title": "Seamless Ribbed Athletic Workout Set",
    "description": "2-piece set featuring high-impact sports bra and sculpting high-waist compressive leggings with 4-way flexibility.",
    "price": 699,
    "category": "Women",
    "subCategory": "Sets",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Neon Pink",
      "Deep Violet",
      "Pure White"
    ],
    "images": [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 40,
    "rating": 4.8,
    "numReviews": 37,
    "isFeatured": true
  },
  {
    "_id": "prod_w_35",
    "id": "prod_w_35",
    "title": "Structured Hourglass Peak Lapel Tuxedo Blazer",
    "description": "Precision tailored hourglass silhouette with satin peak lapels, flap pockets, and single covered-button closure.",
    "price": 999,
    "category": "Women",
    "subCategory": "Blazers",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Jet Black",
      "Chalk White"
    ],
    "images": [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 16,
    "rating": 4.9,
    "numReviews": 51,
    "isFeatured": true
  },
  {
    "_id": "prod_w_36",
    "id": "prod_w_36",
    "title": "Cable Knit Slouchy Oversized Sweater",
    "description": "Plush chunky wool-blend cable knit featuring cozy drop shoulders, ribbed crew collar, and extended cuffs.",
    "price": 899,
    "category": "Women",
    "subCategory": "Sweaters",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Cream White",
      "Pale Lilac"
    ],
    "images": [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 22,
    "rating": 4.7,
    "numReviews": 23,
    "isFeatured": false
  },
  {
    "_id": "prod_w_37",
    "id": "prod_w_37",
    "title": "High-Waist Raw Hem Denim Cutoff Shorts",
    "description": "Classic vintage-inspired 5-pocket non-stretch denim cutoffs with subtle distressing and chewed raw hemline.",
    "price": 499,
    "category": "Women",
    "subCategory": "Shorts",
    "sizes": [
      "25",
      "26",
      "27",
      "28",
      "30"
    ],
    "colors": [
      "Washed Black",
      "Vintage White"
    ],
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 30,
    "rating": 4.6,
    "numReviews": 18,
    "isFeatured": false
  },
  {
    "_id": "prod_w_38",
    "id": "prod_w_38",
    "title": "Silky Strappy Cowl Neck Cami Slip Top",
    "description": "Delicate adjustable spaghetti straps, bias cut silhouette, and cowl neckline for evening layering or standalone elegance.",
    "price": 599,
    "category": "Women",
    "subCategory": "Tops",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Champagne White",
      "Electric Pink"
    ],
    "images": [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 35,
    "rating": 4.8,
    "numReviews": 29,
    "isFeatured": false
  },
  {
    "_id": "prod_k_39",
    "id": "prod_k_39",
    "title": "Cozy Sherpa Lined Full-Zip Streetwear Hoodie",
    "description": "Plush sherpa fleece interior with durable cotton exterior, contrast metal zipper, and split kangaroo pockets.",
    "price": 499,
    "category": "Kids",
    "subCategory": "Hoodies",
    "sizes": [
      "3-4Y",
      "5-6Y",
      "7-8Y",
      "9-10Y"
    ],
    "colors": [
      "Pastel Lilac",
      "Jet Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 32,
    "rating": 4.9,
    "numReviews": 27,
    "isFeatured": true
  },
  {
    "_id": "prod_k_40",
    "id": "prod_k_40",
    "title": "Colorful Dinosaur Skeleton Glow Graphic Tee",
    "description": "Non-toxic glow-in-the-dark print on 100% certified organic breathable combed jersey cotton.",
    "price": 299,
    "category": "Kids",
    "subCategory": "T-Shirts",
    "sizes": [
      "3-4Y",
      "5-6Y",
      "7-8Y",
      "9-10Y"
    ],
    "colors": [
      "Bright Purple",
      "Marshmallow White"
    ],
    "images": [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 45,
    "rating": 4.8,
    "numReviews": 34,
    "isFeatured": false
  },
  {
    "_id": "prod_k_41",
    "id": "prod_k_41",
    "title": "Soft Brushed Cotton Cargo Utility Joggers",
    "description": "Twill cargo joggers with twin side flap pockets, reinforced knee darting, and comfortable elastic drawstring waist.",
    "price": 399,
    "category": "Kids",
    "subCategory": "Pants",
    "sizes": [
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-12Y"
    ],
    "colors": [
      "Black",
      "Dusty Pink"
    ],
    "images": [
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 38,
    "rating": 4.7,
    "numReviews": 21,
    "isFeatured": true
  },
  {
    "_id": "prod_k_42",
    "id": "prod_k_42",
    "title": "Shimmer Star Metallic Tulle Party Skirt",
    "description": "Three tiers of fine shimmer tulle with soft cotton underskirt and glitter elastic waistband for dance and party playtime.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Skirts",
    "sizes": [
      "3-4Y",
      "5-6Y",
      "7-8Y",
      "9-10Y"
    ],
    "colors": [
      "Blush Pink",
      "Starry Purple"
    ],
    "images": [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 28,
    "rating": 4.9,
    "numReviews": 39,
    "isFeatured": true
  },
  {
    "_id": "prod_k_43",
    "id": "prod_k_43",
    "title": "Thermal Waffle Knit 2-Piece Sleep & Play Set",
    "description": "Ultra-breathable waffle knit top and bottoms with flatlock anti-chafing seams and flexible ribbed ankle cuffs.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Sets",
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y"
    ],
    "colors": [
      "Marshmallow White",
      "Soft Pink"
    ],
    "images": [
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 35,
    "rating": 4.8,
    "numReviews": 23,
    "isFeatured": false
  },
  {
    "_id": "prod_k_44",
    "id": "prod_k_44",
    "title": "Waterproof Hooded Colorblock Lightweight Raincoat",
    "description": "Seam-sealed water-repellent shell with storm hood, reflective back safety strip, and easy-slide zipper.",
    "price": 499,
    "category": "Kids",
    "subCategory": "Jackets",
    "sizes": [
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-12Y"
    ],
    "colors": [
      "Pink & Purple",
      "Black & White"
    ],
    "images": [
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 25,
    "rating": 4.7,
    "numReviews": 19,
    "isFeatured": false
  },
  {
    "_id": "prod_k_45",
    "id": "prod_k_45",
    "title": "Classic Stretch Denim Overalls with Pockets",
    "description": "Durable stretch cotton denim overalls with brass hardware, adjustable shoulder straps, and multi-compartment bib pocket.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Overalls",
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y"
    ],
    "colors": [
      "Vintage Black",
      "Classic Indigo"
    ],
    "images": [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 30,
    "rating": 4.8,
    "numReviews": 25,
    "isFeatured": false
  },
  {
    "_id": "prod_k_46",
    "id": "prod_k_46",
    "title": "Bear Ears Plush Fleece Warm Zipper Jacket",
    "description": "Adorable hooded jacket featuring 3D animal ears on hood, ultra-soft sherpa texture, and jersey lining.",
    "price": 499,
    "category": "Kids",
    "subCategory": "Jackets",
    "sizes": [
      "2-3Y",
      "3-4Y",
      "5-6Y"
    ],
    "colors": [
      "Cream White",
      "Soft Pink"
    ],
    "images": [
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 28,
    "rating": 4.9,
    "numReviews": 44,
    "isFeatured": true
  },
  {
    "_id": "prod_k_47",
    "id": "prod_k_47",
    "title": "Everyday Breathable Mesh Athletic Track Shorts",
    "description": "Double-layer lightweight mesh shorts with moisture-wicking technology and comfortable encased elastic waistband.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Shorts",
    "sizes": [
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-12Y"
    ],
    "colors": [
      "Jet Black",
      "Purple Pop"
    ],
    "images": [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 45,
    "rating": 4.6,
    "numReviews": 18,
    "isFeatured": false
  },
  {
    "_id": "prod_k_48",
    "id": "prod_k_48",
    "title": "Striped Organic Cotton Crewneck Sweatshirt",
    "description": "100% GOTS organic French terry sweatshirt with yarn-dyed horizontal stripes and ribbed collar, cuffs, and hem.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Sweaters",
    "sizes": [
      "3-4Y",
      "5-6Y",
      "7-8Y",
      "9-10Y"
    ],
    "colors": [
      "Purple & White Stripes",
      "Black & White"
    ],
    "images": [
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 35,
    "rating": 4.7,
    "numReviews": 22,
    "isFeatured": false
  },
  {
    "_id": "prod_k_49",
    "id": "prod_k_49",
    "title": "Layered Party Flutter Sleeve Birthday Dress",
    "description": "Sweet party dress with ruffled flutter sleeves, satin bow belt, and multi-layered twirl-ready chiffon skirt.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Dresses",
    "sizes": [
      "3-4Y",
      "5-6Y",
      "7-8Y",
      "9-10Y"
    ],
    "colors": [
      "Fairy Pink",
      "Lilac Dream"
    ],
    "images": [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 26,
    "rating": 4.9,
    "numReviews": 36,
    "isFeatured": true
  },
  {
    "_id": "prod_k_50",
    "id": "prod_k_50",
    "title": "Elastic Waist Soft Ribbed Corduroy Pants",
    "description": "Velvety soft micro-corduroy trousers with front patch pockets and pull-on elastic waistband for easy dressing.",
    "price": 399,
    "category": "Kids",
    "subCategory": "Pants",
    "sizes": [
      "3-4Y",
      "5-6Y",
      "7-8Y",
      "9-10Y"
    ],
    "colors": [
      "Deep Plum",
      "Charcoal Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=80"
    ],
    "stock": 30,
    "rating": 4.8,
    "numReviews": 20,
    "isFeatured": false
  },
  {
    "_id": "prod_m_29",
    "id": "prod_m_29",
    "title": "Oversized Acid-Wash Cyberpunk Hoodie",
    "description": "Vintage distressed wash aesthetic with heavyweight 360 GSM brushback cotton fleece, oversized double-layered hood, and metal drawstring aglets.",
    "price": 899,
    "category": "Men",
    "subCategory": "Hoodies",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Acid Purple",
      "Faded Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
    ],
    "colorImages": {
      "Acid Purple": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      "Faded Black": "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80"
    },
    "stock": 28,
    "rating": 4.9,
    "numReviews": 44,
    "isFeatured": true
  },
  {
    "_id": "prod_m_30",
    "id": "prod_m_30",
    "title": "Drop-Shoulder Heavy Terry Crewneck",
    "description": "Refined minimalist luxury crewneck crafted from French terry cotton with subtle high-density tonal embroidery and ribbed side gussets.",
    "price": 649,
    "category": "Men",
    "subCategory": "Sweatshirts",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Charcoal Black",
      "Pure White"
    ],
    "images": [
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80"
    ],
    "colorImages": {
      "Charcoal Black": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80",
      "Pure White": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80"
    },
    "stock": 35,
    "rating": 4.8,
    "numReviews": 31,
    "isFeatured": false
  },
  {
    "_id": "prod_m_31",
    "id": "prod_m_31",
    "title": "Tactical Multi-Pocket Cargo Trousers",
    "description": "Engineered with reinforced ripstop cotton, modular 3D utility cargo pockets, articulated knees, and custom adjustable ankle ties.",
    "price": 749,
    "category": "Men",
    "subCategory": "Pants",
    "sizes": [
      "30",
      "32",
      "34",
      "36"
    ],
    "colors": [
      "Shadow Black",
      "Military Olive"
    ],
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80"
    ],
    "colorImages": {
      "Shadow Black": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80"
    },
    "stock": 22,
    "rating": 4.9,
    "numReviews": 53,
    "isFeatured": true
  },
  {
    "_id": "prod_m_32",
    "id": "prod_m_32",
    "title": "Vintage Washed Boxy Denim Jacket",
    "description": "Authentic 13.5 oz selvedge denim jacket in a cropped boxy silhouette with antique silver hardware and custom interior pocketing.",
    "price": 999,
    "category": "Men",
    "subCategory": "Jackets",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Washed Black",
      "Indigo Blue"
    ],
    "images": [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 19,
    "rating": 4.8,
    "numReviews": 29,
    "isFeatured": true
  },
  {
    "_id": "prod_m_33",
    "id": "prod_m_33",
    "title": "Minimalist Relaxed Fit Corduroy Overshirt",
    "description": "Thick wide-wale corduroy shirt jacket with dual chest flap pockets, horn button closures, and straight hemline.",
    "price": 649,
    "category": "Men",
    "subCategory": "Shirts",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Plum Purple",
      "Sand Beige"
    ],
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 30,
    "rating": 4.7,
    "numReviews": 24,
    "isFeatured": false
  },
  {
    "_id": "prod_m_34",
    "id": "prod_m_34",
    "title": "Streetwear Graphic Mesh Athletic Shorts",
    "description": "Double-layered heavyweight athletic mesh with retro side taping, zip secure pockets, and exaggerated thick contrast drawstrings.",
    "price": 399,
    "category": "Men",
    "subCategory": "Shorts",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Jet Black",
      "Hot Pink"
    ],
    "images": [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 45,
    "rating": 4.8,
    "numReviews": 38,
    "isFeatured": false
  },
  {
    "_id": "prod_m_35",
    "id": "prod_m_35",
    "title": "Technical Wind-Resistant Shell Parka",
    "description": "Ultralight technical membrane fabric designed to block harsh gusts while maintaining supreme breathability and modern urban drape.",
    "price": 999,
    "category": "Men",
    "subCategory": "Jackets",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Matte Black",
      "Deep Violet"
    ],
    "images": [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 16,
    "rating": 4.9,
    "numReviews": 47,
    "isFeatured": true
  },
  {
    "_id": "prod_m_36",
    "id": "prod_m_36",
    "title": "Raw Hem Oversized Vintage Skate Tee",
    "description": "Heavy 260 GSM organic combed cotton with raw distressed neckline, vintage garment dye finish, and drop shoulders.",
    "price": 499,
    "category": "Men",
    "subCategory": "T-Shirts",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Chalk White",
      "Onyx Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 50,
    "rating": 4.8,
    "numReviews": 62,
    "isFeatured": false
  },
  {
    "_id": "prod_m_37",
    "id": "prod_m_37",
    "title": "Premium Knit Ribbed Polo Sweater",
    "description": "Fine merino wool and modal blend with buttonless Johnny collar and clean ribbed hems for understated luxury styling.",
    "price": 899,
    "category": "Men",
    "subCategory": "Sweaters",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Obsidian Black",
      "Pale Lilac"
    ],
    "images": [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 25,
    "rating": 4.9,
    "numReviews": 28,
    "isFeatured": false
  },
  {
    "_id": "prod_m_38",
    "id": "prod_m_38",
    "title": "Cyber Streetwear Reflective Joggers",
    "description": "Tapered technical fleece sweatpants with 3M reflective line piping, waterproof bonded zip pockets, and snug ribbed ankle cuffs.",
    "price": 749,
    "category": "Men",
    "subCategory": "Pants",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Night Black",
      "Neon Violet"
    ],
    "images": [
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 32,
    "rating": 4.8,
    "numReviews": 41,
    "isFeatured": true
  },
  {
    "_id": "prod_m_39",
    "id": "prod_m_39",
    "title": "Distressed Hem Heavy Fleece Zip Hoodie",
    "description": "Two-way luxury front zipper, hand-distressed cuffs and hemline, with plush thermal fleece lining.",
    "price": 899,
    "category": "Men",
    "subCategory": "Hoodies",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "colors": [
      "Washed Pink",
      "Washed Purple"
    ],
    "images": [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 20,
    "rating": 4.9,
    "numReviews": 33,
    "isFeatured": false
  },
  {
    "_id": "prod_m_40",
    "id": "prod_m_40",
    "title": "Tailored Relaxed Fit Wool-Blend Overcoat",
    "description": "Single-breasted architectural winter coat featuring wide notched lapels, interior horn buttons, and deep welt pockets.",
    "price": 999,
    "category": "Men",
    "subCategory": "Jackets",
    "sizes": [
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Midnight Black",
      "Heather Gray"
    ],
    "images": [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 14,
    "rating": 5,
    "numReviews": 39,
    "isFeatured": true
  },
  {
    "_id": "prod_w_29",
    "id": "prod_w_29",
    "title": "High-Waisted Parachute Cargo Street Pants",
    "description": "Crisp water-repellent poplin nylon with billowy silhouette, toggle adjustable bungee waist and hems, and signature deep side cargo pockets.",
    "price": 749,
    "category": "Women",
    "subCategory": "Pants",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Rose Pink",
      "Jet Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 35,
    "rating": 4.9,
    "numReviews": 52,
    "isFeatured": true
  },
  {
    "_id": "prod_w_30",
    "id": "prod_w_30",
    "title": "Oversized Boyfriend Tailored Blazer",
    "description": "Structured shoulders with relaxed drape, interior satin lining, and tortoiseshell button closure for effortlessly elevated layering.",
    "price": 999,
    "category": "Women",
    "subCategory": "Jackets",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Midnight Black",
      "Pale Pink"
    ],
    "images": [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 24,
    "rating": 4.8,
    "numReviews": 36,
    "isFeatured": true
  },
  {
    "_id": "prod_w_31",
    "id": "prod_w_31",
    "title": "Ribbed Seamless Contour Crop Top",
    "description": "Double-layered 4-way stretch performance rib knit designed for all-day comfort, flattering square neckline, and zero chafing.",
    "price": 599,
    "category": "Women",
    "subCategory": "Tops",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Magenta Pink",
      "Chalk White"
    ],
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 50,
    "rating": 4.9,
    "numReviews": 68,
    "isFeatured": false
  },
  {
    "_id": "prod_w_32",
    "id": "prod_w_32",
    "title": "Satin Cowl-Neck Slip Midi Dress",
    "description": "Fluid heavyweight silk-feel satin with delicate adjustable spaghetti straps, bias cut drape, and seductive side leg slit.",
    "price": 599,
    "category": "Women",
    "subCategory": "Dresses",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Electric Purple",
      "Obsidian Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 20,
    "rating": 4.9,
    "numReviews": 43,
    "isFeatured": true
  },
  {
    "_id": "prod_w_33",
    "id": "prod_w_33",
    "title": "Velour Y2K Zip-Up Track Jacket",
    "description": "Plush velvet velour with silver rhinestone zipper pull, ribbed funnel collar, and fitted retro athletic silhouette.",
    "price": 999,
    "category": "Women",
    "subCategory": "Jackets",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Hot Pink",
      "Dark Plum"
    ],
    "images": [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 28,
    "rating": 4.8,
    "numReviews": 35,
    "isFeatured": false
  },
  {
    "_id": "prod_w_34",
    "id": "prod_w_34",
    "title": "Wide-Leg Pleated Tailored Trousers",
    "description": "High-rise tailored trousers with double front pleats, slant pockets, and a floor-skimming elegant wide silhouette.",
    "price": 749,
    "category": "Women",
    "subCategory": "Pants",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Eggshell White",
      "Jet Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 32,
    "rating": 4.9,
    "numReviews": 49,
    "isFeatured": true
  },
  {
    "_id": "prod_w_35",
    "id": "prod_w_35",
    "title": "Chunky Knit Cable-Pattern Cropped Cardigan",
    "description": "Handcrafted feel cable knit with oversized marbled buttons, slouchy dropped sleeves, and flattering cropped hem.",
    "price": 899,
    "category": "Women",
    "subCategory": "Sweaters",
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Pastel Lilac",
      "Cream White"
    ],
    "images": [
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 26,
    "rating": 4.8,
    "numReviews": 31,
    "isFeatured": false
  },
  {
    "_id": "prod_w_36",
    "id": "prod_w_36",
    "title": "Cropped Puffer Vest with High Collar",
    "description": "Waterproof glossy nylon shell filled with thermal down alternative, bungee cinch waist, and heavy-duty storm flap.",
    "price": 699,
    "category": "Women",
    "subCategory": "Outerwear",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Glossy Black",
      "Fuchsia Pink"
    ],
    "images": [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 25,
    "rating": 4.9,
    "numReviews": 44,
    "isFeatured": true
  },
  {
    "_id": "prod_w_37",
    "id": "prod_w_37",
    "title": "High-Waist Tennis Pleated Mini Skirt",
    "description": "Classic sporty pleated skirt with built-in compression stretch shorts, hidden zip pocket, and comfortable high-rise waistband.",
    "price": 599,
    "category": "Women",
    "subCategory": "Skirts",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Pure White",
      "Violet Purple"
    ],
    "images": [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 40,
    "rating": 4.8,
    "numReviews": 58,
    "isFeatured": false
  },
  {
    "_id": "prod_w_38",
    "id": "prod_w_38",
    "title": "Sculpting Flare High-Rise Yoga Leggings",
    "description": "Buttery soft second-skin fabric with zero front seam, gentle tummy-control waistband, and modern split flare hems.",
    "price": 499,
    "category": "Women",
    "subCategory": "Activewear",
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Midnight Plum",
      "Onyx Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 38,
    "rating": 4.9,
    "numReviews": 63,
    "isFeatured": true
  },
  {
    "_id": "prod_w_39",
    "id": "prod_w_39",
    "title": "Graphic Aesthetic Oversized Vintage Sweatshirt",
    "description": "Retro collegiate puff print graphics across the chest, relaxed boxy drop-shoulder cut, and pre-washed vintage touch.",
    "price": 649,
    "category": "Women",
    "subCategory": "Sweatshirts",
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Bubblegum Pink",
      "Charcoal Gray"
    ],
    "images": [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 30,
    "rating": 4.8,
    "numReviews": 40,
    "isFeatured": false
  },
  {
    "_id": "prod_w_40",
    "id": "prod_w_40",
    "title": "Off-Shoulder Ribbed Knit Bodycon Dress",
    "description": "Sophisticated foldover off-the-shoulder neckline in a curve-hugging heavy rib knit with midi length hemline.",
    "price": 599,
    "category": "Women",
    "subCategory": "Dresses",
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Royal Purple",
      "Classic Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 22,
    "rating": 5,
    "numReviews": 37,
    "isFeatured": true
  },
  {
    "_id": "prod_k_51",
    "id": "prod_k_51",
    "title": "Colorblock Retro Fleece Zip Jacket",
    "description": "Extra cozy colorblocked fleece with high neck warmer, contrast chest zipper pocket, and soft elastic wristbands.",
    "price": 499,
    "category": "Kids",
    "subCategory": "Jackets",
    "sizes": [
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "colors": [
      "Purple & Pink",
      "Navy & Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 34,
    "rating": 4.9,
    "numReviews": 29,
    "isFeatured": true
  },
  {
    "_id": "prod_k_52",
    "id": "prod_k_52",
    "title": "Organic Cotton Graphic Skate Hoodie",
    "description": "Breathable 100% GOTS certified organic cotton with fun street skate graphics, kangaroo pocket, and ribbed trims.",
    "price": 499,
    "category": "Kids",
    "subCategory": "Hoodies",
    "sizes": [
      "3-4Y",
      "5-6Y",
      "7-8Y",
      "9-10Y"
    ],
    "colors": [
      "Lilac Dream",
      "Midnight Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 42,
    "rating": 4.8,
    "numReviews": 38,
    "isFeatured": false
  },
  {
    "_id": "prod_k_53",
    "id": "prod_k_53",
    "title": "Durable Stretch Denim Overalls & Dungarees",
    "description": "Sturdy yet flexible cotton stretch denim with adjustable metal clasps, multiple utility pockets, and classic side buttoning.",
    "price": 399,
    "category": "Kids",
    "subCategory": "Pants",
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y"
    ],
    "colors": [
      "Washed Denim Blue",
      "Black Onyx"
    ],
    "images": [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 28,
    "rating": 4.9,
    "numReviews": 45,
    "isFeatured": true
  },
  {
    "_id": "prod_k_54",
    "id": "prod_k_54",
    "title": "Tie-Dye Pastel Streetwear Sweatpants",
    "description": "Individually hand-dyed pastel French terry with elasticized waistband, deep pockets, and stretchy ribbed ankle cuffs.",
    "price": 399,
    "category": "Kids",
    "subCategory": "Pants",
    "sizes": [
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "colors": [
      "Pastel Swirl",
      "Purple Mist"
    ],
    "images": [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 36,
    "rating": 4.8,
    "numReviews": 32,
    "isFeatured": false
  },
  {
    "_id": "prod_k_55",
    "id": "prod_k_55",
    "title": "Waterproof Hooded Rain Parka",
    "description": "Taped seams with durable water-repellent shell, reflective safety accents on sleeves, and breathable mesh lining.",
    "price": 499,
    "category": "Kids",
    "subCategory": "Jackets",
    "sizes": [
      "3-4Y",
      "5-6Y",
      "7-8Y",
      "9-10Y"
    ],
    "colors": [
      "Bright Pink",
      "Deep Violet"
    ],
    "images": [
      "https://images.unsplash.com/photo-1471286174890-9c112ffca564?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 25,
    "rating": 4.9,
    "numReviews": 41,
    "isFeatured": true
  },
  {
    "_id": "prod_k_56",
    "id": "prod_k_56",
    "title": "Puff-Print Dino Streetwear Crewneck",
    "description": "Cute textured 3D puff-print dinosaur design on super-soft combed cotton with reinforced double-needle seams.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Sweatshirts",
    "sizes": [
      "3-4Y",
      "5-6Y",
      "7-8Y",
      "9-10Y"
    ],
    "colors": [
      "Cloud White",
      "Charcoal Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 45,
    "rating": 4.8,
    "numReviews": 50,
    "isFeatured": false
  },
  {
    "_id": "prod_k_57",
    "id": "prod_k_57",
    "title": "Warm Sherpa-Lined Teddy Fleece Vest",
    "description": "High-loft sherpa fleece with durable woven contrast collar and secure zipper pockets, great for brisk outdoor play.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Vests",
    "sizes": [
      "3-4Y",
      "5-6Y",
      "7-8Y",
      "9-10Y"
    ],
    "colors": [
      "Cream Pink",
      "Plum Purple"
    ],
    "images": [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 30,
    "rating": 4.9,
    "numReviews": 27,
    "isFeatured": false
  },
  {
    "_id": "prod_k_58",
    "id": "prod_k_58",
    "title": "Everyday Soft Cotton 2-Pack Graphic Tees",
    "description": "Value bundle containing two ultra-comfortable pure cotton tees with tag-free labels for sensitive young skin.",
    "price": 299,
    "category": "Kids",
    "subCategory": "T-Shirts",
    "sizes": [
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "colors": [
      "Black & Pink",
      "Purple & White"
    ],
    "images": [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 55,
    "rating": 4.8,
    "numReviews": 64,
    "isFeatured": false
  },
  {
    "_id": "prod_k_59",
    "id": "prod_k_59",
    "title": "Sporty Tricot Track Pants with Side Stripes",
    "description": "Lightweight track pants with retro dual side piping, zip leg openings, and moisture-wicking athletic finish.",
    "price": 399,
    "category": "Kids",
    "subCategory": "Pants",
    "sizes": [
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "colors": [
      "Jet Black",
      "Hot Pink"
    ],
    "images": [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 38,
    "rating": 4.8,
    "numReviews": 33,
    "isFeatured": false
  },
  {
    "_id": "prod_k_60",
    "id": "prod_k_60",
    "title": "Glitter Star Tulle Party Tiered Dress",
    "description": "Magical layered tulle skirt sprinkled with sparkling star accents over a soft jersey cotton lining for twirl-ready comfort.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Dresses",
    "sizes": [
      "3-4Y",
      "5-6Y",
      "7-8Y",
      "9-10Y"
    ],
    "colors": [
      "Fairy Pink",
      "Galaxy Violet"
    ],
    "images": [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 22,
    "rating": 5,
    "numReviews": 48,
    "isFeatured": true
  },
  {
    "_id": "prod_k_61",
    "id": "prod_k_61",
    "title": "Cozy Waffle Knit Long-Sleeve Henley",
    "description": "Thermal textured waffle cotton with 3-button placket and soft rib cuffs for cozy layering in cool weather.",
    "price": 299,
    "category": "Kids",
    "subCategory": "Tops",
    "sizes": [
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "colors": [
      "Lilac Bloom",
      "Deep Charcoal"
    ],
    "images": [
      "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 40,
    "rating": 4.8,
    "numReviews": 25,
    "isFeatured": false
  },
  {
    "_id": "prod_k_62",
    "id": "prod_k_62",
    "title": "Heavy Padded Winter Puffer Jacket",
    "description": "Ultra-warm quilted puffer jacket with insulated fleece-lined hood, storm cuffs, and vibrant high-visibility colors.",
    "price": 499,
    "category": "Kids",
    "subCategory": "Jackets",
    "sizes": [
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "colors": [
      "Neon Fuchsia",
      "Obsidian Black"
    ],
    "images": [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80"
    ],
    "stock": 24,
    "rating": 4.9,
    "numReviews": 39,
    "isFeatured": true
  }
];

module.exports = { sampleCategories, sampleProducts };
