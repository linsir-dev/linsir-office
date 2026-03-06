// nav导航栏配置
export const Nav = [
  { text: "🏡 首页", link: "/" },
  { text: "🌍 游记", link: "/travel/" },
  { 
    text: "📍 目的地",
    items: [
      { text: "🇯🇵 日本", link: "/travel/japan-sakura" },
      { text: "🇨🇳 云南", link: "/travel/yunnan-dali" },
      { text: "🇨🇳 西藏", link: "/travel/tibet-pilgrimage" },
    ]
  },
  { text: "👤 关于", link: "/about/" },
];
