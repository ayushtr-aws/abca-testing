export interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  nationality: string;
  age: number;
  goals: number;
  assists: number;
  imageUrl: string;
}

export interface TeamStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  country: string;
  league: string;
  founded: number;
  stadium: string;
  stadiumCapacity: number;
  manager: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  stats: TeamStats;
  players: Player[];
}

export const teams: Team[] = [
  {
    id: 1,
    name: "Real Madrid",
    shortName: "RMA",
    country: "Spain",
    league: "La Liga",
    founded: 1902,
    stadium: "Santiago Bernabéu",
    stadiumCapacity: 81044,
    manager: "Carlo Ancelotti",
    primaryColor: "#FFFFFF",
    secondaryColor: "#00529F",
    logo: "⚪",
    stats: {
      played: 34,
      won: 27,
      drawn: 4,
      lost: 3,
      goalsFor: 87,
      goalsAgainst: 26,
      points: 85,
    },
    players: [
      { id: 1, name: "Thibaut Courtois", number: 1, position: "GK", nationality: "Belgium", age: 32, goals: 0, assists: 0, imageUrl: "https://ui-avatars.com/api/?name=Thibaut+Courtois&background=002395&color=ffffff&size=64&bold=true" },
      { id: 2, name: "Dani Carvajal", number: 2, position: "RB", nationality: "Spain", age: 32, goals: 2, assists: 5, imageUrl: "https://ui-avatars.com/api/?name=Dani+Carvajal&background=c60b1e&color=ffffff&size=64&bold=true" },
      { id: 3, name: "Éder Militão", number: 3, position: "CB", nationality: "Brazil", age: 26, goals: 3, assists: 1, imageUrl: "https://ui-avatars.com/api/?name=Eder+Militao&background=009c3b&color=ffffff&size=64&bold=true" },
      { id: 4, name: "David Alaba", number: 4, position: "CB", nationality: "Austria", age: 31, goals: 1, assists: 2, imageUrl: "https://ui-avatars.com/api/?name=David+Alaba&background=ed2939&color=ffffff&size=64&bold=true" },
      { id: 5, name: "Ferland Mendy", number: 23, position: "LB", nationality: "France", age: 29, goals: 0, assists: 3, imageUrl: "https://ui-avatars.com/api/?name=Ferland+Mendy&background=002395&color=ffffff&size=64&bold=true" },
      { id: 6, name: "Tchouaméni", number: 8, position: "CDM", nationality: "France", age: 24, goals: 4, assists: 3, imageUrl: "https://ui-avatars.com/api/?name=Aurelien+Tchouameni&background=002395&color=ffffff&size=64&bold=true" },
      { id: 7, name: "Luka Modrić", number: 10, position: "CM", nationality: "Croatia", age: 38, goals: 5, assists: 8, imageUrl: "https://ui-avatars.com/api/?name=Luka+Modric&background=ff0000&color=ffffff&size=64&bold=true" },
      { id: 8, name: "Toni Kroos", number: 8, position: "CM", nationality: "Germany", age: 34, goals: 3, assists: 11, imageUrl: "https://ui-avatars.com/api/?name=Toni+Kroos&background=000000&color=ffffff&size=64&bold=true" },
      { id: 9, name: "Vinicius Jr.", number: 7, position: "LW", nationality: "Brazil", age: 23, goals: 24, assists: 9, imageUrl: "https://ui-avatars.com/api/?name=Vinicius+Junior&background=009c3b&color=ffffff&size=64&bold=true" },
      { id: 10, name: "Rodrygo", number: 11, position: "RW", nationality: "Brazil", age: 23, goals: 15, assists: 7, imageUrl: "https://ui-avatars.com/api/?name=Rodrygo+Goes&background=009c3b&color=ffffff&size=64&bold=true" },
      { id: 11, name: "Jude Bellingham", number: 5, position: "AM", nationality: "England", age: 20, goals: 23, assists: 13, imageUrl: "https://ui-avatars.com/api/?name=Jude+Bellingham&background=cf1020&color=ffffff&size=64&bold=true" },
    ],
  },
  {
    id: 2,
    name: "Manchester City",
    shortName: "MCI",
    country: "England",
    league: "Premier League",
    founded: 1880,
    stadium: "Etihad Stadium",
    stadiumCapacity: 53400,
    manager: "Pep Guardiola",
    primaryColor: "#6CABDD",
    secondaryColor: "#FFFFFF",
    logo: "🔵",
    stats: {
      played: 36,
      won: 25,
      drawn: 7,
      lost: 4,
      goalsFor: 91,
      goalsAgainst: 40,
      points: 82,
    },
    players: [
      { id: 12, name: "Ederson", number: 31, position: "GK", nationality: "Brazil", age: 30, goals: 0, assists: 0, imageUrl: "https://ui-avatars.com/api/?name=Ederson+Moraes&background=009c3b&color=ffffff&size=64&bold=true" },
      { id: 13, name: "Kyle Walker", number: 2, position: "RB", nationality: "England", age: 33, goals: 1, assists: 4, imageUrl: "https://ui-avatars.com/api/?name=Kyle+Walker&background=cf1020&color=ffffff&size=64&bold=true" },
      { id: 14, name: "Rúben Dias", number: 3, position: "CB", nationality: "Portugal", age: 26, goals: 2, assists: 1, imageUrl: "https://ui-avatars.com/api/?name=Ruben+Dias&background=006600&color=ffffff&size=64&bold=true" },
      { id: 15, name: "Manuel Akanji", number: 25, position: "CB", nationality: "Switzerland", age: 28, goals: 1, assists: 0, imageUrl: "https://ui-avatars.com/api/?name=Manuel+Akanji&background=d52b1e&color=ffffff&size=64&bold=true" },
      { id: 16, name: "Josko Gvardiol", number: 24, position: "LB", nationality: "Croatia", age: 22, goals: 8, assists: 5, imageUrl: "https://ui-avatars.com/api/?name=Josko+Gvardiol&background=ff0000&color=ffffff&size=64&bold=true" },
      { id: 17, name: "Rodri", number: 16, position: "CDM", nationality: "Spain", age: 27, goals: 8, assists: 9, imageUrl: "https://ui-avatars.com/api/?name=Rodri+Hernandez&background=c60b1e&color=ffffff&size=64&bold=true" },
      { id: 18, name: "Kevin De Bruyne", number: 17, position: "CM", nationality: "Belgium", age: 32, goals: 7, assists: 15, imageUrl: "https://ui-avatars.com/api/?name=Kevin+De+Bruyne&background=002395&color=ffffff&size=64&bold=true" },
      { id: 19, name: "Bernardo Silva", number: 20, position: "CM", nationality: "Portugal", age: 29, goals: 10, assists: 8, imageUrl: "https://ui-avatars.com/api/?name=Bernardo+Silva&background=006600&color=ffffff&size=64&bold=true" },
      { id: 20, name: "Phil Foden", number: 47, position: "AM", nationality: "England", age: 23, goals: 19, assists: 8, imageUrl: "https://ui-avatars.com/api/?name=Phil+Foden&background=cf1020&color=ffffff&size=64&bold=true" },
      { id: 21, name: "Jeremy Doku", number: 11, position: "LW", nationality: "Belgium", age: 22, goals: 8, assists: 10, imageUrl: "https://ui-avatars.com/api/?name=Jeremy+Doku&background=002395&color=ffffff&size=64&bold=true" },
      { id: 22, name: "Erling Haaland", number: 9, position: "ST", nationality: "Norway", age: 23, goals: 36, assists: 8, imageUrl: "https://ui-avatars.com/api/?name=Erling+Haaland&background=ef2b2d&color=ffffff&size=64&bold=true" },
    ],
  },
  {
    id: 3,
    name: "FC Barcelona",
    shortName: "FCB",
    country: "Spain",
    league: "La Liga",
    founded: 1899,
    stadium: "Spotify Camp Nou",
    stadiumCapacity: 99354,
    manager: "Hansi Flick",
    primaryColor: "#004D98",
    secondaryColor: "#A50044",
    logo: "🔴",
    stats: {
      played: 34,
      won: 24,
      drawn: 4,
      lost: 6,
      goalsFor: 79,
      goalsAgainst: 38,
      points: 76,
    },
    players: [
      { id: 23, name: "Marc-André ter Stegen", number: 1, position: "GK", nationality: "Germany", age: 31, goals: 0, assists: 0, imageUrl: "https://ui-avatars.com/api/?name=Marc+ter+Stegen&background=000000&color=ffffff&size=64&bold=true" },
      { id: 24, name: "Héctor Bellerín", number: 2, position: "RB", nationality: "Spain", age: 29, goals: 0, assists: 3, imageUrl: "https://ui-avatars.com/api/?name=Hector+Bellerin&background=c60b1e&color=ffffff&size=64&bold=true" },
      { id: 25, name: "Ronald Araújo", number: 4, position: "CB", nationality: "Uruguay", age: 25, goals: 3, assists: 1, imageUrl: "https://ui-avatars.com/api/?name=Ronald+Araujo&background=75aadb&color=ffffff&size=64&bold=true" },
      { id: 26, name: "Pau Cubarsí", number: 34, position: "CB", nationality: "Spain", age: 17, goals: 1, assists: 0, imageUrl: "https://ui-avatars.com/api/?name=Pau+Cubarsi&background=c60b1e&color=ffffff&size=64&bold=true" },
      { id: 27, name: "Alejandro Balde", number: 3, position: "LB", nationality: "Spain", age: 20, goals: 2, assists: 7, imageUrl: "https://ui-avatars.com/api/?name=Alejandro+Balde&background=c60b1e&color=ffffff&size=64&bold=true" },
      { id: 28, name: "Frenkie de Jong", number: 21, position: "CDM", nationality: "Netherlands", age: 26, goals: 3, assists: 6, imageUrl: "https://ui-avatars.com/api/?name=Frenkie+de+Jong&background=ff6600&color=ffffff&size=64&bold=true" },
      { id: 29, name: "Pedri", number: 8, position: "CM", nationality: "Spain", age: 21, goals: 9, assists: 7, imageUrl: "https://ui-avatars.com/api/?name=Pedri+Gonzalez&background=c60b1e&color=ffffff&size=64&bold=true" },
      { id: 30, name: "Gavi", number: 6, position: "CM", nationality: "Spain", age: 19, goals: 5, assists: 9, imageUrl: "https://ui-avatars.com/api/?name=Gavi+Paez&background=c60b1e&color=ffffff&size=64&bold=true" },
      { id: 31, name: "Lamine Yamal", number: 27, position: "RW", nationality: "Spain", age: 16, goals: 15, assists: 18, imageUrl: "https://ui-avatars.com/api/?name=Lamine+Yamal&background=c60b1e&color=ffffff&size=64&bold=true" },
      { id: 32, name: "Raphinha", number: 11, position: "LW", nationality: "Brazil", age: 27, goals: 27, assists: 12, imageUrl: "/raphinha.jpeg" },
      { id: 33, name: "Robert Lewandowski", number: 9, position: "ST", nationality: "Poland", age: 35, goals: 24, assists: 10, imageUrl: "https://ui-avatars.com/api/?name=Robert+Lewandowski&background=dc143c&color=ffffff&size=64&bold=true" },
    ],
  },
  {
    id: 4,
    name: "Bayern Munich",
    shortName: "FCB",
    country: "Germany",
    league: "Bundesliga",
    founded: 1900,
    stadium: "Allianz Arena",
    stadiumCapacity: 75024,
    manager: "Vincent Kompany",
    primaryColor: "#DC052D",
    secondaryColor: "#0066B2",
    logo: "🔴",
    stats: {
      played: 34,
      won: 24,
      drawn: 5,
      lost: 5,
      goalsFor: 94,
      goalsAgainst: 45,
      points: 77,
    },
    players: [
      { id: 34, name: "Manuel Neuer", number: 1, position: "GK", nationality: "Germany", age: 37, goals: 0, assists: 0, imageUrl: "https://ui-avatars.com/api/?name=Manuel+Neuer&background=000000&color=ffffff&size=64&bold=true" },
      { id: 35, name: "Noussair Mazraoui", number: 40, position: "RB", nationality: "Morocco", age: 26, goals: 2, assists: 4, imageUrl: "https://ui-avatars.com/api/?name=Noussair+Mazraoui&background=c1272d&color=ffffff&size=64&bold=true" },
      { id: 36, name: "Matthijs de Ligt", number: 4, position: "CB", nationality: "Netherlands", age: 24, goals: 2, assists: 0, imageUrl: "https://ui-avatars.com/api/?name=Matthijs+de+Ligt&background=ff6600&color=ffffff&size=64&bold=true" },
      { id: 37, name: "Min-Jae Kim", number: 3, position: "CB", nationality: "South Korea", age: 27, goals: 1, assists: 1, imageUrl: "https://ui-avatars.com/api/?name=Min+Jae+Kim&background=003478&color=ffffff&size=64&bold=true" },
      { id: 38, name: "Alphonso Davies", number: 19, position: "LB", nationality: "Canada", age: 23, goals: 4, assists: 9, imageUrl: "https://ui-avatars.com/api/?name=Alphonso+Davies&background=ff0000&color=ffffff&size=64&bold=true" },
      { id: 39, name: "Joshua Kimmich", number: 6, position: "CDM", nationality: "Germany", age: 29, goals: 5, assists: 11, imageUrl: "https://ui-avatars.com/api/?name=Joshua+Kimmich&background=000000&color=ffffff&size=64&bold=true" },
      { id: 40, name: "Leon Goretzka", number: 8, position: "CM", nationality: "Germany", age: 29, goals: 8, assists: 6, imageUrl: "https://ui-avatars.com/api/?name=Leon+Goretzka&background=000000&color=ffffff&size=64&bold=true" },
      { id: 41, name: "Jamal Musiala", number: 42, position: "AM", nationality: "Germany", age: 21, goals: 18, assists: 10, imageUrl: "https://ui-avatars.com/api/?name=Jamal+Musiala&background=000000&color=ffffff&size=64&bold=true" },
      { id: 42, name: "Leroy Sané", number: 10, position: "RW", nationality: "Germany", age: 28, goals: 14, assists: 11, imageUrl: "https://ui-avatars.com/api/?name=Leroy+Sane&background=000000&color=ffffff&size=64&bold=true" },
      { id: 43, name: "Serge Gnabry", number: 7, position: "LW", nationality: "Germany", age: 28, goals: 11, assists: 6, imageUrl: "https://ui-avatars.com/api/?name=Serge+Gnabry&background=000000&color=ffffff&size=64&bold=true" },
      { id: 44, name: "Harry Kane", number: 9, position: "ST", nationality: "England", age: 30, goals: 44, assists: 12, imageUrl: "/harry-kane.jpeg" },
    ],
  },
  {
    id: 5,
    name: "PSG",
    shortName: "PSG",
    country: "France",
    league: "Ligue 1",
    founded: 1970,
    stadium: "Parc des Princes",
    stadiumCapacity: 47929,
    manager: "Luis Enrique",
    primaryColor: "#004170",
    secondaryColor: "#DA291C",
    logo: "🔵",
    stats: {
      played: 34,
      won: 26,
      drawn: 5,
      lost: 3,
      goalsFor: 89,
      goalsAgainst: 33,
      points: 83,
    },
    players: [
      { id: 45, name: "Gianluigi Donnarumma", number: 99, position: "GK", nationality: "Italy", age: 25, goals: 0, assists: 0, imageUrl: "https://ui-avatars.com/api/?name=Gianluigi+Donnarumma&background=009246&color=ffffff&size=64&bold=true" },
      { id: 46, name: "Achraf Hakimi", number: 2, position: "RB", nationality: "Morocco", age: 25, goals: 4, assists: 10, imageUrl: "https://ui-avatars.com/api/?name=Achraf+Hakimi&background=c1272d&color=ffffff&size=64&bold=true" },
      { id: 47, name: "Marquinhos", number: 5, position: "CB", nationality: "Brazil", age: 29, goals: 3, assists: 2, imageUrl: "https://ui-avatars.com/api/?name=Marquinhos+Correa&background=009c3b&color=ffffff&size=64&bold=true" },
      { id: 48, name: "Lucas Hernández", number: 21, position: "CB", nationality: "France", age: 28, goals: 0, assists: 1, imageUrl: "https://ui-avatars.com/api/?name=Lucas+Hernandez&background=002395&color=ffffff&size=64&bold=true" },
      { id: 49, name: "Nuno Mendes", number: 25, position: "LB", nationality: "Portugal", age: 21, goals: 3, assists: 7, imageUrl: "https://ui-avatars.com/api/?name=Nuno+Mendes&background=006600&color=ffffff&size=64&bold=true" },
      { id: 50, name: "Vitinha", number: 17, position: "CDM", nationality: "Portugal", age: 24, goals: 7, assists: 8, imageUrl: "https://ui-avatars.com/api/?name=Vitinha+Ferreira&background=006600&color=ffffff&size=64&bold=true" },
      { id: 51, name: "Warren Zaïre-Emery", number: 33, position: "CM", nationality: "France", age: 18, goals: 9, assists: 5, imageUrl: "https://ui-avatars.com/api/?name=Warren+Zaire+Emery&background=002395&color=ffffff&size=64&bold=true" },
      { id: 52, name: "Fabian Ruiz", number: 8, position: "CM", nationality: "Spain", age: 27, goals: 10, assists: 9, imageUrl: "https://ui-avatars.com/api/?name=Fabian+Ruiz&background=c60b1e&color=ffffff&size=64&bold=true" },
      { id: 53, name: "Bradley Barcola", number: 29, position: "LW", nationality: "France", age: 21, goals: 20, assists: 8, imageUrl: "https://ui-avatars.com/api/?name=Bradley+Barcola&background=002395&color=ffffff&size=64&bold=true" },
      { id: 54, name: "Désiré Doué", number: 23, position: "RW", nationality: "France", age: 19, goals: 14, assists: 11, imageUrl: "https://ui-avatars.com/api/?name=Desire+Doue&background=002395&color=ffffff&size=64&bold=true" },
      { id: 55, name: "Gonçalo Ramos", number: 9, position: "ST", nationality: "Portugal", age: 23, goals: 18, assists: 7, imageUrl: "https://ui-avatars.com/api/?name=Goncalo+Ramos&background=006600&color=ffffff&size=64&bold=true" },
    ],
  },
];
