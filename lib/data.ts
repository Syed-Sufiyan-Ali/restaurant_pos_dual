import { Product, Category, Deal } from "@/types";

export const categories: Category[] = [
  { id: "pizza",   name: "Pizzas",   icon: "🍕", description: "16 signature flavors",  image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80" },
  { id: "burgers", name: "Burgers",  icon: "🍔", description: "Juicy & loaded",         image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id: "deals",   name: "Deals",    icon: "🔥", description: "Best value combos",      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80" },
  { id: "sides",   name: "Sides",    icon: "🍟", description: "Fries, dips & more",     image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80" },
  { id: "drinks",  name: "Drinks",   icon: "🥤", description: "Cold & refreshing",      image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400&q=80" },
];

const pizzaSizes = [
  { id: "s-sm", label: "Small",   price: 0,   serves: "1–2 persons · 4 pcs" },
  { id: "s-reg", label: "Regular", price: 150, serves: "2–3 persons · 6 pcs" },
  { id: "s-lg", label: "Large",   price: 350, serves: "3–4 persons · 8 pcs" },
];
const pizzaExtras = [
  { id: "cheese",   label: "Extra Cheese",  price: 80  },
  { id: "sauce",    label: "Extra Sauce",   price: 50  },
  { id: "chicken",  label: "Extra Chicken", price: 120 },
  { id: "jalapeno", label: "Jalapeños",     price: 40  },
];
const burgerExtras = [
  { id: "cheese", label: "Extra Cheese",  price: 60  },
  { id: "sauce",  label: "Extra Sauce",   price: 40  },
  { id: "patty",  label: "Double Patty",  price: 150 },
  { id: "bacon",  label: "Crispy Strips", price: 80  },
];

export const products: Product[] = [
  { id:"p1",  name:"Pizza Town Special",  description:"Our signature masterpiece loaded with premium toppings.",        category:"pizza",   image:"https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80", basePrice:650, sizes:pizzaSizes, extras:pizzaExtras, tag:"bestseller", ingredients:["Special Sauce","Mozzarella","Chicken Tikka","Bell Peppers","Olives","Mushrooms"] },
  { id:"p2",  name:"Shawarma Pizza",       description:"Middle Eastern meets Italian — tender shawarma with garlic mayo.", category:"pizza",   image:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80", basePrice:600, sizes:pizzaSizes, extras:pizzaExtras, tag:"new",        ingredients:["Garlic Mayo","Shawarma Chicken","Pickles","Onion","Mozzarella"] },
  { id:"p3",  name:"Tikka Pizza",          description:"Desi-style spicy chicken tikka with green chutney.",             category:"pizza",   image:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80", basePrice:580, sizes:pizzaSizes, extras:pizzaExtras, tag:"spicy",      ingredients:["Green Chutney","Tikka Chicken","Onions","Tomato","Mozzarella"] },
  { id:"p4",  name:"BBQ Supreme",          description:"Smoky BBQ sauce with grilled chicken and caramelised onions.",   category:"pizza",   image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80", basePrice:620, sizes:pizzaSizes, extras:pizzaExtras, ingredients:["BBQ Sauce","Grilled Chicken","Caramelised Onions","Mozzarella","Cheddar"] },
  { id:"p5",  name:"Hot & Spicy",          description:"For the brave ones — jalapeños, hot sauce, and fiery chicken.",  category:"pizza",   image:"https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&q=80", basePrice:590, sizes:pizzaSizes, extras:pizzaExtras, tag:"spicy",      ingredients:["Hot Sauce","Spiced Chicken","Jalapeños","Red Chilli","Mozzarella"] },
  { id:"p6",  name:"Kabab Hunter",         description:"Juicy seekh kabab chunks with achari masala.",                   category:"pizza",   image:"https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&q=80", basePrice:640, sizes:pizzaSizes, extras:pizzaExtras, tag:"new",        ingredients:["Achari Sauce","Seekh Kabab","Onions","Capsicum","Mozzarella"] },
  { id:"p7",  name:"Malai Tikka",          description:"Creamy malai tikka chicken with a luscious white sauce base.",   category:"pizza",   image:"https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80", basePrice:620, sizes:pizzaSizes, extras:pizzaExtras, ingredients:["White Sauce","Malai Tikka","Capsicum","Mozzarella","Cream"] },
  { id:"p8",  name:"Cheese Lover",         description:"Triple cheese blend — mozzarella, cheddar, and gouda.",          category:"pizza",   image:"https://images.unsplash.com/photo-1548369937-47519962c11a?w=600&q=80", basePrice:560, sizes:pizzaSizes, extras:pizzaExtras, ingredients:["Tomato Sauce","Mozzarella","Cheddar","Gouda","Herbs"] },
  { id:"p9",  name:"Chicken Karahi",       description:"Karahi masala chicken on a golden pizza base.",                  category:"pizza",   image:"https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&q=80", basePrice:610, sizes:pizzaSizes, extras:pizzaExtras, tag:"spicy",      ingredients:["Karahi Sauce","Chicken","Tomatoes","Green Chilli","Mozzarella"] },
  { id:"p10", name:"Achari Pizza",         description:"Tangy pickle spice blend with tender chicken.",                  category:"pizza",   image:"https://images.unsplash.com/photo-1576458088443-04a19bb13da6?w=600&q=80", basePrice:580, sizes:pizzaSizes, extras:pizzaExtras, ingredients:["Achari Sauce","Chicken","Tomatoes","Onions","Mozzarella"] },
  { id:"b1",  name:"Zinger Burger",        description:"Crispy fried chicken fillet with zinger sauce in a toasted bun.",category:"burgers", image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", basePrice:320, extras:burgerExtras, tag:"bestseller", ingredients:["Brioche Bun","Crispy Chicken","Coleslaw","Zinger Sauce","Lettuce"] },
  { id:"b2",  name:"Double Beef Smash",    description:"Two smashed beef patties, American cheese, pickles.",            category:"burgers", image:"https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&q=80", basePrice:380, extras:burgerExtras, tag:"new",        ingredients:["Sesame Bun","Double Beef Patty","American Cheese","Pickles","Secret Sauce"] },
  { id:"b3",  name:"Crispy Chicken Burger",description:"Golden crispy chicken with tomatoes, lettuce, and mayo.",        category:"burgers", image:"https://images.unsplash.com/photo-1596956470007-2bf6095e7e16?w=600&q=80", basePrice:290, extras:burgerExtras, ingredients:["Sesame Bun","Crispy Chicken","Lettuce","Tomato","Mayo"] },
  { id:"b4",  name:"BBQ Chicken Burger",   description:"Smoky BBQ glazed chicken with crispy onions and cheddar.",       category:"burgers", image:"https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80", basePrice:340, extras:burgerExtras, ingredients:["Brioche Bun","BBQ Chicken","Crispy Onions","Cheddar","BBQ Sauce"] },
  { id:"s1",  name:"Loaded Fries",         description:"Crispy fries topped with cheese sauce and jalapeños.",           category:"sides",   image:"https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&q=80", basePrice:180, tag:"bestseller", ingredients:["Fries","Cheese Sauce","Jalapeños","Seasoning"] },
  { id:"s2",  name:"Garlic Bread",         description:"Toasted garlic butter bread with herbs.",                        category:"sides",   image:"https://images.unsplash.com/photo-1619535860434-cf9b902bdce1?w=600&q=80", basePrice:120, ingredients:["Bread","Garlic Butter","Mixed Herbs"] },
  { id:"s3",  name:"Chicken Wings (6 pcs)",description:"Crispy spiced chicken wings with dipping sauce.",                category:"sides",   image:"https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80", basePrice:280, ingredients:["Chicken Wings","Spice Rub","Dipping Sauce"] },
  { id:"d1",  name:"Pepsi (1.5L)",         description:"Ice-cold Pepsi to wash it all down.",                            category:"drinks",  image:"https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=600&q=80", basePrice:150, ingredients:["Pepsi"] },
  { id:"d2",  name:"7UP (1.5L)",           description:"Chilled 7UP — crisp and refreshing.",                            category:"drinks",  image:"https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=600&q=80", basePrice:150, ingredients:["7UP"] },
  { id:"d3",  name:"Mineral Water",        description:"Fresh chilled mineral water.",                                   category:"drinks",  image:"https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&q=80", basePrice:60,  ingredients:["Water"] },
];

export const deals: Deal[] = [
  { id:"deal1", title:"Family Feast",   description:"1 Large Pizza + 4 Burgers + 1.5L Drink", originalPrice:1800, salePrice:1299, image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80", badge:"28% OFF", items:["1x Large Pizza (any flavor)","4x Burgers","1x 1.5L Pepsi"] },
  { id:"deal2", title:"Pizza Duo",      description:"2 Regular Pizzas + 1.5L Drink",          originalPrice:1350, salePrice:999,  image:"https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&q=80", badge:"26% OFF", items:["2x Regular Pizzas","1x 1.5L Pepsi"] },
  { id:"deal3", title:"Student Saver",  description:"1 Small Pizza + 1 Burger + Drink",        originalPrice:750,  salePrice:549,  image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", badge:"27% OFF", items:["1x Small Pizza","1x Burger","1x 500ml Drink"] },
  { id:"deal4", title:"Party Pack",     description:"2 Large Pizzas + 8 Wings + 2x 1.5L",     originalPrice:2800, salePrice:1999, image:"https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80", badge:"29% OFF", items:["2x Large Pizzas","8x Chicken Wings","2x 1.5L Pepsi"] },
];

export const getProductsByCategory = (category: string) => products.filter((p) => p.category === category);
export const getProductById = (id: string) => products.find((p) => p.id === id);
