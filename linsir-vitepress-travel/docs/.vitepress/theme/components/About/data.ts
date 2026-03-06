import {
  VscodeDark,
  WebstormDark,
  Postman,
  Html,
  Css,
  Javascript,
  Typescript,
  Sass,
  LessDark,
  TailwindcssDark,
  VuejsDark,
  ViteDark,
  PiniaDark,
  Electron,
  LinuxDark,
  Nginx,
  NodejsDark,
  MysqlDark,
  PnpmDark,
  ReactDark,
  Git,
  GithubDark,
  GitlabDark,
  Docker,
  JAVA,
  IDEA,
  DataGrip,
  RedisDark,
  RabbitMqDark,
  SpringDark,
  SpringBootDark,
  NpmDark,
  Android,
  MavenDark,
  Star,
  Fork,
  View,
} from "./TechIcons";

export const profile = {
  title: "你好，我是",
  name: "Linsir",
  desc: "用脚步丈量世界，用文字记录时光",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", //头像
  buttons: [
    { text: "联系我", link: "mailto:your@email.com", type: "primary" },
    { text: "查看游记", link: "/travel/", type: "default" },
  ],
};

// 旅行技能 - 改为旅行相关的能力
export const majorSkills = [
  {
    name: "旅行规划",
    percent: 95,
    color: "#f25e62",
    tags: [
      { name: "路线设计", bg: "#ffeaea", color: "#f25e62" },
      { name: "预算控制", bg: "#f3eaff", color: "#88619a" },
      { name: "住宿预订", bg: "#eaf6ff", color: "#4298b4" },
      { name: "交通安排", bg: "#eafff3", color: "#33a474" },
      { name: "签证办理", bg: "#fff7ea", color: "#e4ae3a" },
      { name: "保险购买", bg: "#f3ffe9", color: "#96b466" },
    ],
  },
  {
    name: "摄影记录",
    percent: 90,
    color: "#33a474",
    tags: [
      { name: "风景摄影", bg: "#eaf6ff", color: "#4298b4" },
      { name: "人像拍摄", bg: "#e3edfa", color: "#3976c6" },
      { name: "后期修图", bg: "#ffeaf6", color: "#d72660" },
      { name: "视频剪辑", bg: "#f3eaff", color: "#88619a" },
      { name: "航拍", bg: "#fffbe6", color: "#e4ae3a" },
    ],
  },
  {
    name: "语言沟通",
    percent: 85,
    color: "#4298b4",
    tags: [
      { name: "英语", bg: "#eaf6ff", color: "#4298b4" },
      { name: "日语", bg: "#e3edfa", color: "#3976c6" },
      { name: "韩语", bg: "#ffeaea", color: "#f25e62" },
      { name: "手语", bg: "#f3ffe9", color: "#96b466" },
    ],
  },
  {
    name: "户外生存",
    percent: 80,
    color: "#e4ae3a",
    tags: [
      { name: "徒步", bg: "#fffbe6", color: "#e4ae3a" },
      { name: "露营", bg: "#e3edfa", color: "#3976c6" },
      { name: "登山", bg: "#f3eaff", color: "#88619a" },
      { name: "潜水", bg: "#eafff3", color: "#33a474" },
    ],
  },
  {
    name: "美食探索",
    percent: 95,
    color: "#96b466",
    tags: [
      { name: "当地美食", bg: "#e3edfa", color: "#3976c6" },
      { name: "街头小吃", bg: "#ffeaea", color: "#f25e62" },
      { name: "特色餐厅", bg: "#eafff3", color: "#33a474" },
      { name: "咖啡探店", bg: "#f3eaff", color: "#88619a" },
      { name: "夜市文化", bg: "#fffbe6", color: "#e4ae3a" },
    ],
  },
];

// 旅行装备 - 改为旅行装备图标
export const techStackIcons = [
  // 第一行，首尾空
  {},
  { name: "相机", icon: JAVA },
  { name: "无人机", icon: IDEA },
  { name: "手机", icon: WebstormDark },
  { name: "笔记本", icon: DataGrip },
  { name: "充电宝", icon: SpringDark },
  { name: "三脚架", icon: SpringBootDark },
  {},
  // 第二行
  { name: "背包", icon: MysqlDark },
  { name: "登山鞋", icon: RedisDark },
  { name: "冲锋衣", icon: RabbitMqDark },
  { name: "睡袋", icon: Html },
  { name: "帐篷", icon: Css },
  { name: "指南针", icon: Javascript },
  { name: "地图", icon: Typescript },
  { name: "头灯", icon: VscodeDark },
  // 第三行
  { name: "护照", icon: VuejsDark },
  { name: "签证", icon: ViteDark },
  { name: "机票", icon: PiniaDark },
  { name: "火车票", icon: LinuxDark },
  { name: "酒店", icon: Nginx },
  { name: "租车", icon: NodejsDark },
  { name: "导航", icon: ReactDark },
  { name: "翻译", icon: TailwindcssDark },
  // 第四行，首尾空
  {},
  { name: "防晒霜", icon: NpmDark },
  { name: "墨镜", icon: Git },
  { name: "水壶", icon: GithubDark },
  { name: "急救包", icon: Postman },
  { name: "雨具", icon: Docker },
  { name: "收纳袋", icon: MavenDark },
  {},
  // 第五行，缩小行
  {},
  { name: "耳机", icon: Android, small: true },
  { name: "转换插头", icon: PnpmDark, small: true },
  { name: "U型枕", icon: Electron, small: true },
  { name: "眼罩", icon: Sass, small: true },
  { name: "耳塞", icon: LessDark, small: true },
  { name: "行李牌", icon: GitlabDark, small: true },
  {},
];

// 精选游记
export const ossProjects = [
  {
    name: "日本樱花之旅",
    desc: "🌸 东京、京都、大阪的樱花之旅，记录最美的春日时光",
    tag: { name: "日本", bg: "#ffeaea", color: "#f25e62" },
    projectsimg: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800",
    Star: "3.5k",
    Fork: "1.2k",
    View: "12.6k",
    github: "/travel/japan-sakura",
  },
  {
    name: "云南大理慢时光",
    desc: "🏔️ 苍山洱海间的慢生活，感受云南的诗意与远方",
    tag: { name: "云南", bg: "#eafff3", color: "#33a474" },
    projectsimg: "https://images.unsplash.com/photo-1513415756790-2ac1db1297d0?w=800",
    Star: "2.8k",
    Fork: "0.9k",
    View: "9.8k",
    github: "/travel/yunnan-dali",
  },
  {
    name: "西藏朝圣之路",
    desc: "🙏 拉萨、林芝、纳木错的信仰之旅，心灵的洗礼",
    tag: { name: "西藏", bg: "#fff7ea", color: "#e4ae3a" },
    projectsimg: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800",
    Star: "2.2k",
    Fork: "0.8k",
    View: "8.5k",
    github: "/travel/tibet-pilgrimage",
  },
];

// 导出图标用于子组件
export { Star, Fork, View };
