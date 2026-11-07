// data for the browse page (same 6 listings as the midterm)

// array 1: the listings
var listings = [
  {
    id: 1,
    slug: "board-games",
    title: "Game night collection",
    category: "Board games",
    condition: "Like new",
    price: 35,
    city: "Astana",
    trade: true,
    image: "images/board-games.jpg",
    alt: "Board games and components arranged on a table",
    info: "A selection for your next game night. Components checked and ready to play."
  },
  {
    id: 2,
    slug: "chess",
    title: "Classic chess set",
    category: "Strategy",
    condition: "Good",
    price: 18,
    city: "Astana",
    trade: false,
    image: "images/chess.jpg",
    alt: "Chess pieces on a chessboard",
    info: "A classic two-player strategy set. All 32 pieces included; light wear on the board."
  },
  {
    id: 3,
    slug: "dice",
    title: "Adventure dice set",
    category: "Accessories",
    condition: "New",
    price: 12,
    city: "Astana",
    trade: false,
    image: "images/dice.jpg",
    alt: "Tabletop gaming dice",
    info: "A set of dice for tabletop adventures. A simple addition to your gaming bag."
  },
  {
    id: 4,
    slug: "starter",
    title: "Weekend starter bundle",
    category: "Board games",
    condition: "Good",
    price: 28,
    city: "Astana",
    trade: true,
    image: "images/board-games.jpg",
    alt: "A collection of tabletop games",
    info: "An accessible bundle for a relaxed weekend. Some shelf wear; all playing pieces included."
  },
  {
    id: 5,
    slug: "club-chess",
    title: "Club chess set",
    category: "Strategy",
    condition: "Like new",
    price: 24,
    city: "Astana",
    trade: false,
    image: "images/chess.jpg",
    alt: "A chessboard set up for a game",
    info: "A spare set for a club or study room. Clean pieces and a board in excellent condition."
  },
  {
    id: 6,
    slug: "spare-dice",
    title: "Spare dice collection",
    category: "Accessories",
    condition: "Good",
    price: 8,
    city: "Astana",
    trade: true,
    image: "images/dice.jpg",
    alt: "Dice for a tabletop game",
    info: "Extra dice for a growing group. Light signs of use, with clearly readable numbers."
  }
];

// array 2: categories used for the filter dropdown
var categories = ["Board games", "Strategy", "Accessories"];
