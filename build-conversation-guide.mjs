import fs from "node:fs";
import path from "node:path";

const root = path.dirname(new URL(import.meta.url).pathname);
const assetDir = path.join(root, "assets-src");
const outPath = path.join(root, "cruise-conversation-guide.html");
const publicDir = path.join(root, "public");
const publicIndexPath = path.join(publicDir, "index.html");

function text(name) {
  return fs.readFileSync(path.join(assetDir, name), "utf8");
}

function dataUri(name, mime = "image/jpeg") {
  const data = fs.readFileSync(path.join(assetDir, name)).toString("base64");
  return `data:${mime};base64,${data}`;
}

const leafletCss = text("leaflet.css").replace(/url\((images\/[^)]+)\)/g, "none");
const leafletJs = text("leaflet.js");

const images = {
  busanPort: dataUri("busan_port.jpg"),
  songdo: dataUri("songdo.jpg"),
  jeonpo: dataUri("jeonpo.jpg"),
  gamcheon: dataUri("gamcheon.jpg"),
  jusang: dataUri("jusang.jpg"),
  orange: dataUri("jeju_orange.jpg"),
  olle: dataUri("olle.jpg"),
};

const busanPoints = [
  { n: 1, time: "6月22日 09:00", name: "釜山港国际客运码头", lat: 35.1148, lng: 129.0488, note: "2026年6月22日釜山靠岸，靠岸窗口 07:00-18:00，下船集合后确认最晚回船时间。" },
  { n: 2, time: "09:40-11:10", name: "松岛海上缆车", lat: 35.07619, lng: 129.01803, note: "水晶车厢看海，票价约 24,000 韩元。" },
  { n: 3, time: "12:00-13:20", name: "田浦洞肉合家烤肉", lat: 35.1577, lng: 129.0632, note: "午餐吃烤肉，热门时段先取号。" },
  { n: 4, time: "13:20-14:30", name: "田浦洞逛街", lat: 35.1588, lng: 129.0648, note: "咖啡、小店、服饰，控制停留时间。" },
  { n: 5, time: "15:10-16:30", name: "甘川文化村", lat: 35.0975, lng: 129.0107, note: "彩色山坡村落，上下坡多。" },
  { n: 6, time: "6月22日 16:30", name: "返回釜山港", lat: 35.1148, lng: 129.0488, note: "2026年6月22日釜山 18:00 离港，建议至少提前 1.5 小时回到码头。" },
];

const jejuPoints = [
  { n: 1, time: "6月21日 09:00", name: "济州港/邮轮码头", lat: 33.5198, lng: 126.5432, note: "2026年6月21日济州靠岸，靠岸窗口 07:00-18:00，Kakao T 叫车并确认回船时间。" },
  { n: 2, time: "10:00-11:10", name: "柱状节理带", lat: 33.2379, lng: 126.4252, note: "火山岩柱状地貌，上午看海更舒服。" },
  { n: 3, time: "11:20-12:30", name: "橘子咖啡馆", lat: 33.2498, lng: 126.5588, note: "搜索西归浦/中门附近橘子咖啡馆，可替换店名。" },
  { n: 4, time: "12:50-14:30", name: "西归浦每日偶来市场", lat: 33.2486, lng: 126.5643, note: "午餐、小吃和伴手礼一起解决。" },
  { n: 5, time: "6月21日 16:00", name: "返回济州港/邮轮码头", lat: 33.5198, lng: 126.5432, note: "2026年6月21日济州 18:00 离港，车程较长，务必提前出发。" },
];

const allMapData = { busan: busanPoints, jeju: jejuPoints };

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>韩国邮轮靠岸一日游｜离线图文手册</title>
  <meta name="description" content="从整段对话整理生成的韩国邮轮靠岸一日游手机手册，包含釜山、济州岛行程、真实图片、评分、时间线、食物推荐和交互地图。">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230e8a9a'/%3E%3Cpath d='M8 44c10-6 20-6 31 0 7 4 12 3 17 0v10H8Z' fill='%23fff7e8'/%3E%3Cpath d='M10 29 54 14' stroke='%23fff' stroke-width='4' stroke-linecap='round'/%3E%3Crect x='29' y='18' width='17' height='12' rx='4' fill='%23ef6658'/%3E%3C/svg%3E">
  <style>${leafletCss}</style>
  <style>
    :root {
      --ink: #18222d;
      --muted: #687383;
      --paper: #fff8ee;
      --surface: #ffffff;
      --line: #e5ded3;
      --sea: #0e8a9a;
      --deep: #103d4a;
      --coral: #ef6658;
      --gold: #f1ad42;
      --leaf: #3e8b63;
      --shadow: 0 18px 40px rgba(30, 44, 55, .14);
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background: #ece7dd;
      color: var(--ink);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      line-height: 1.65;
    }
    a { color: inherit; }
    .shell { max-width: 980px; margin: 0 auto; background: var(--paper); box-shadow: 0 0 0 1px rgba(24,34,45,.06); }
    .hero {
      min-height: 92vh;
      padding: 22px 18px 28px;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background:
        linear-gradient(180deg, rgba(16,61,74,.08), rgba(16,61,74,.62)),
        url("${images.songdo}") center/cover;
    }
    .toprow, .chips, .route-tabs { display: flex; gap: 10px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .toprow { justify-content: space-between; align-items: center; }
    .badge, .chip, .tab-btn {
      flex: 0 0 auto;
      border: 1px solid rgba(255,255,255,.55);
      border-radius: 999px;
      padding: 8px 12px;
      background: rgba(255,255,255,.18);
      color: #fff;
      backdrop-filter: blur(12px);
      font-size: 13px;
      font-weight: 800;
      text-decoration: none;
    }
    .hero h1 { margin: 18px 0 10px; max-width: 780px; font-size: clamp(38px, 11vw, 76px); line-height: 1.04; letter-spacing: 0; }
    .hero p { max-width: 640px; margin: 0; color: rgba(255,255,255,.92); font-size: 17px; font-weight: 650; }
    .chips { margin-top: 24px; padding-bottom: 3px; }
    .chip { background: rgba(255,255,255,.94); color: #162330; border-color: transparent; box-shadow: 0 10px 24px rgba(0,0,0,.18); }
    section { padding: 30px 18px; }
    main { display: flex; flex-direction: column; }
    #status { order: 1; }
    main > section:nth-of-type(2) { order: 2; }
    #map-section { order: 3; }
    #jeju { order: 4; }
    #busan { order: 5; }
    #korean { order: 6; }
    section + section { border-top: 1px solid var(--line); }
    h2 { margin: 0 0 12px; font-size: 29px; line-height: 1.16; letter-spacing: 0; }
    h3 { margin: 0 0 8px; font-size: 20px; line-height: 1.22; letter-spacing: 0; }
    p { margin: 0; }
    .lead { color: var(--muted); margin-bottom: 18px; }
    .notice-grid, .app-grid, .place-grid, .food-grid { display: grid; gap: 12px; }
    .notice-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .app-grid, .food-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .place-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .card {
      overflow: hidden;
      border: 1px solid rgba(83,104,126,.18);
      border-radius: 8px;
      background: var(--surface);
      box-shadow: 0 10px 26px rgba(32,45,58,.09);
    }
    .status-card { padding: 16px; border-left: 6px solid var(--coral); }
    .status-card.booked { border-left-color: var(--leaf); background: #f4fbf6; }
    .status-card strong, .app-card strong { display: block; margin-bottom: 4px; font-size: 17px; }
    .status-card span, .app-card span, .meta, .source-note { color: var(--muted); font-size: 14px; }
    .cruise-table-wrap { margin-top: 14px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .cruise-table { width: 100%; min-width: 620px; border-collapse: collapse; background: #fff; border: 1px solid rgba(83,104,126,.18); border-radius: 8px; overflow: hidden; box-shadow: 0 10px 26px rgba(32,45,58,.08); }
    .cruise-table th, .cruise-table td { border-bottom: 1px solid rgba(83,104,126,.15); padding: 10px 12px; text-align: left; font-size: 14px; vertical-align: middle; }
    .cruise-table th { background: #edf5f5; color: var(--deep); font-weight: 900; }
    .cruise-table tr:last-child td { border-bottom: 0; }
    .cruise-table .highlight-row td { background: #fff8e7; font-weight: 850; }
    .app-card { padding: 16px; }
    .app-icon { width: 42px; height: 42px; display: grid; place-items: center; margin-bottom: 10px; border-radius: 12px; color: #fff; font-weight: 900; }
    .n { background: var(--leaf); } .k { background: var(--gold); color: #312412; } .p { background: var(--sea); }
    .map-wrap { padding: 0; background: #fff; }
    .map-head { padding: 22px 18px 14px; }
    .route-tabs { padding-top: 8px; }
    .tab-btn { border: 0; background: #edf5f5; color: var(--deep); cursor: pointer; }
    .tab-btn.active { background: var(--deep); color: #fff; }
    #map { width: 100%; height: min(72vh, 620px); min-height: 420px; background: #dce7e5; }
    .map-tip { padding: 12px 18px 20px; color: var(--muted); font-size: 13px; background: #fff; }
    .num-marker {
      width: 30px; height: 30px; display: grid; place-items: center;
      border: 3px solid #fff; border-radius: 50%;
      background: var(--coral); color: #fff; font-size: 13px; font-weight: 900;
      box-shadow: 0 8px 18px rgba(0,0,0,.24);
    }
    .leaflet-popup-content { margin: 12px 14px; min-width: 180px; }
    .popup-title { font-weight: 900; margin-bottom: 4px; }
    .popup-time { color: var(--sea); font-weight: 800; margin-bottom: 8px; }
    .popup-link { display: inline-block; margin: 8px 5px 0 0; border-radius: 999px; padding: 7px 10px; background: var(--deep); color: #fff; text-decoration: none; font-weight: 800; }
    .popup-link.naver-link { background: #03c75a; }
    .day { padding: 0; background: #fff; }
    .day-cover {
      min-height: 360px;
      padding: 26px 18px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      color: #fff;
      background-position: center;
      background-size: cover;
    }
    .busan-cover { background-image: linear-gradient(180deg, rgba(15,38,48,.08), rgba(15,38,48,.72)), url("${images.gamcheon}"); }
    .jeju-cover { background-image: linear-gradient(180deg, rgba(15,38,48,.08), rgba(15,38,48,.72)), url("${images.jusang}"); }
    .day-cover h2 { font-size: clamp(36px, 9vw, 60px); color: #fff; }
    .route-line { display: flex; gap: 8px; overflow-x: auto; margin-top: 16px; padding-bottom: 4px; }
    .route-line span { flex: 0 0 auto; border-radius: 999px; padding: 7px 10px; background: rgba(255,255,255,.92); color: var(--ink); font-size: 13px; font-weight: 850; }
    .day-body { padding: 24px 18px 32px; }
    .place-img { height: 210px; background: #dde8e8 center/cover; }
    .place-body { padding: 15px; }
    .rating { display: inline-flex; align-items: center; gap: 5px; margin-bottom: 10px; border-radius: 999px; padding: 5px 9px; background: #fff4d6; color: #6e4b06; font-weight: 900; font-size: 13px; }
    .quote { margin-top: 8px; color: var(--muted); font-size: 14px; }
    .navlinks { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
    .navlinks a { border-radius: 999px; padding: 7px 10px; background: #edf5f5; color: var(--deep); text-decoration: none; font-size: 13px; font-weight: 850; }
    .navlinks .naver-link { background: #e8f9ef; color: #087a3b; }
    .timeline { margin-top: 22px; display: grid; gap: 10px; }
    .slot { display: grid; grid-template-columns: 78px 1fr; border: 1px solid rgba(83,104,126,.18); border-radius: 8px; overflow: hidden; background: #fff; }
    .slot-time { display: grid; place-items: center; padding: 12px 8px; background: #edf5f5; color: var(--sea); font-weight: 950; text-align: center; }
    .slot-body { padding: 13px 14px; }
    .slot-body strong { display: block; }
    .food-card { padding: 16px; }
    .food-card b { display: block; font-size: 17px; margin-bottom: 5px; }
    code { display: inline-block; padding: 4px 7px; border-radius: 7px; background: #f2f5f7; color: #344456; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; }
    .quick-list { columns: 2; column-gap: 18px; }
    .quick-list p { break-inside: avoid; margin: 0 0 12px; }
    footer { padding: 30px 18px 42px; background: #17242d; color: #fff; }
    footer p { color: rgba(255,255,255,.76); }
    @media (max-width: 760px) {
      .shell { max-width: none; }
      .notice-grid, .app-grid, .place-grid, .food-grid { grid-template-columns: 1fr; }
      .place-card { display: grid; grid-template-columns: 42% 1fr; min-height: 176px; }
      .place-img { height: 100%; min-height: 176px; }
      #map { height: 520px; min-height: 520px; }
      .quick-list { columns: 1; }
    }
    @media (max-width: 430px) {
      section, .hero, .map-head, .map-tip, .day-cover, .day-body, footer { padding-left: 14px; padding-right: 14px; }
      .hero { min-height: 88vh; }
      .place-card { grid-template-columns: 1fr; }
      .place-img { height: 170px; }
      .slot { grid-template-columns: 72px 1fr; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="hero">
      <div class="toprow">
        <span class="badge">离线单文件</span>
        <span class="badge">韩国邮轮靠岸</span>
      </div>
      <div>
        <h1>釜山 + 济州岛，一天靠岸也能玩完整</h1>
        <p>根据整段对话整理：图文景点卡、早中晚时间线、当地食物、已预订信息高亮和可交互 Leaflet 地图。</p>
        <nav class="chips" aria-label="页面导航">
          <a class="chip" href="#status">航班酒店</a>
          <a class="chip" href="#map-section">交互地图</a>
          <a class="chip" href="#jeju">6/21 济州岛</a>
          <a class="chip" href="#busan">6/22 釜山</a>
          <a class="chip" href="#korean">韩文速查</a>
        </nav>
      </div>
    </header>

    <main>
      <section id="status">
        <h2>航班与酒店信息</h2>
        <p class="lead">已按邮轮时刻表更新：2026年6月21日济州 07:00 抵达、18:00 离港；2026年6月22日釜山 07:00 抵达、18:00 离港。具体航班号和陆地酒店名称尚未提供，页面保留可补充高亮卡。</p>
        <div class="notice-grid">
          <article class="card status-card booked">
            <strong>邮轮靠岸：已确认</strong>
            <span>济州岛：2026年6月21日 07:00-18:00；釜山：2026年6月22日 07:00-18:00。每日行程都按靠岸当天游玩并回船安排。</span>
          </article>
          <article class="card status-card">
            <strong>航班信息：待补充</strong>
            <span>需要补充航班号、日期、起降机场、起降时间、是否已预订。补完后可替换为“已预订”高亮。</span>
          </article>
          <article class="card status-card booked">
            <strong>住宿/酒店：邮轮船舱为主</strong>
            <span>按当前对话判断，行程是靠岸当天游玩并回船。陆地酒店名称、评分和图片待你补充后可加入。</span>
          </article>
        </div>
        <div class="cruise-table-wrap">
          <table class="cruise-table" aria-label="邮轮航程时刻表">
            <thead>
              <tr>
                <th>日期</th>
                <th>星期</th>
                <th>停靠港口</th>
                <th>抵达</th>
                <th>离港</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2026/06/19</td>
                <td>星期五</td>
                <td>上海，中国</td>
                <td>-</td>
                <td>16:00</td>
              </tr>
              <tr>
                <td>2026/06/20</td>
                <td>星期六</td>
                <td>海上巡游</td>
                <td>-</td>
                <td>-</td>
              </tr>
              <tr class="highlight-row">
                <td>2026/06/21</td>
                <td>星期日</td>
                <td>济州（西归浦），韩国</td>
                <td>07:00</td>
                <td>18:00</td>
              </tr>
              <tr class="highlight-row">
                <td>2026/06/22</td>
                <td>星期一</td>
                <td>釜山，韩国</td>
                <td>07:00</td>
                <td>18:00</td>
              </tr>
              <tr>
                <td>2026/06/23</td>
                <td>星期二</td>
                <td>海上巡游</td>
                <td>-</td>
                <td>-</td>
              </tr>
              <tr>
                <td>2026/06/24</td>
                <td>星期三</td>
                <td>上海，中国</td>
                <td>06:30</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>出行 App</h2>
        <p class="lead">韩国旅行最省心组合：Naver Map 看路线，Kakao T 打车，Papago 翻译。</p>
        <div class="app-grid">
          <article class="card app-card"><div class="app-icon n">N</div><strong>Naver Map</strong><span>查地铁、公交、步行、韩文地点，比 Google Maps 更适合韩国。</span></article>
          <article class="card app-card"><div class="app-icon k">T</div><strong>Kakao T</strong><span>主力打车软件。济州岛景点分散，优先用它叫车或考虑包车。</span></article>
          <article class="card app-card"><div class="app-icon p">P</div><strong>Papago</strong><span>韩语菜单、问路、给司机看文字都很好用。</span></article>
        </div>
      </section>

      <section class="map-wrap" id="map-section">
        <div class="map-head">
          <h2>交互地图</h2>
          <p class="lead">点编号标记可看名字、时间和导航链接；路线按顺序用虚线连接。底图使用 OpenStreetMap 免费瓦片，联网时显示，离线时行程内容和标记数据仍保存在本文件里。</p>
          <div class="route-tabs">
            <button class="tab-btn active" data-route="jeju">6/21 济州岛路线</button>
            <button class="tab-btn" data-route="busan">6/22 釜山路线</button>
          </div>
        </div>
        <div id="map"></div>
        <p class="map-tip">导航链接优先使用 Google Maps 通用链接；Kakao Map 链接适合手机已安装 Kakao 系列 App 时打开。</p>
      </section>

      <section class="day" id="busan">
        <div class="day-cover busan-cover">
          <span class="badge">2026年6月22日 07:00-18:00 · Busan</span>
          <h2>釜山经典一日游</h2>
          <p>上午海上缆车，中午田浦洞烤肉，下午甘川文化村，最后稳稳回船。</p>
          <div class="route-line"><span>邮轮码头</span><span>松岛海上缆车</span><span>田浦洞烤肉</span><span>田浦洞逛街</span><span>甘川文化村</span><span>回船</span></div>
        </div>
        <div class="day-body">
          <h2>景点详情</h2>
          <div class="place-grid">
            ${placeCard("松岛海上缆车", images.songdo, "4.4/5", "海景体验最强的一站，水晶车厢适合第一次来釜山的人。", "09:40-11:10", "송도해상케이블카", busanPoints[1])}
            ${placeCard("田浦洞街区", images.jeonpo, "4.3/5", "烤肉、咖啡和小店集中，午餐后逛一小时刚好。", "12:00-14:30", "전포동", busanPoints[3])}
            ${placeCard("甘川文化村", images.gamcheon, "4.4/5", "彩色山坡房子很出片，但上下坡多，别穿难走的鞋。", "15:10-16:30", "감천문화마을", busanPoints[4])}
            ${placeCard("釜山港国际客运码头", images.busanPort, "靠岸点", "邮轮靠岸窗口 07:00-18:00；回船时间永远优先，建议至少提前 1.5 小时抵达。", "2026.6.22 07:00-18:00", "부산항국제여객터미널", busanPoints[0])}
          </div>

          <h2 style="margin-top:26px;">早中晚时间线</h2>
          <div class="timeline">
            ${slot("早", "09:00-11:10", "下船 → 松岛海上缆车", "打车最省时间；水晶车厢票价约 24,000 韩元。")}
            ${slot("中", "12:00-14:30", "田浦洞肉合家烤肉 + 逛街", "午餐后逛咖啡馆和服饰小店，控制停留不超过 1 小时。")}
            ${slot("晚", "15:10-16:30+", "甘川文化村 → 回船", "村落上下坡多，拍照后立刻按船方时间回码头。")}
          </div>

          <h2 style="margin-top:26px;">今日当地食物</h2>
          <div class="food-grid">
            ${food("烤肉", "田浦洞午餐主菜，适合补体力。")}
            ${food("釜山鱼糕", "回船前可买小吃或伴手礼。")}
            ${food("씨앗호떡", "南浦洞一带常见甜点，时间有余再安排。")}
          </div>
        </div>
      </section>

      <section class="day" id="jeju">
        <div class="day-cover jeju-cover">
          <span class="badge">2026年6月21日 07:00-18:00 · Jeju</span>
          <h2>济州岛经典一日游</h2>
          <p>Kakao T 串起自然景观、橘子咖啡馆和偶来市场。济州车程长，回船时间要保守。</p>
          <div class="route-line"><span>邮轮码头</span><span>柱状节理带</span><span>橘子咖啡馆</span><span>偶来市场</span><span>回船</span></div>
        </div>
        <div class="day-body">
          <h2>景点详情</h2>
          <div class="place-grid">
            ${placeCard("柱状节理带", images.jusang, "4.3/5", "济州火山地貌代表，黑色岩柱配海浪很有辨识度。", "10:00-11:10", "주상절리대", jejuPoints[1])}
            ${placeCard("橘子咖啡馆", images.orange, "4.5/5", "用作顺路休息点；可搜索西归浦/中门附近的橘子主题咖啡馆替换。", "11:20-12:30", "제주 귤 카페", jejuPoints[2])}
            ${placeCard("西归浦每日偶来市场", images.olle, "4.2/5", "午餐、小吃和伴手礼一次解决，橘子和黑猪肉小吃都值得看。", "12:50-14:30", "서귀포매일올레시장", jejuPoints[3])}
            ${placeCard("济州邮轮码头", images.busanPort, "靠岸点", "邮轮靠岸窗口 07:00-18:00；若实际靠江汀邮轮港，回程路线会更顺。", "2026.6.21 07:00-18:00", "제주항", jejuPoints[0])}
          </div>

          <h2 style="margin-top:26px;">早中晚时间线</h2>
          <div class="timeline">
            ${slot("早", "09:00-11:10", "下船 → 柱状节理带", "Kakao T 叫车，尽量减少换乘。")}
            ${slot("中", "11:20-14:30", "橘子咖啡馆 → 偶来市场", "咖啡馆休息拍照，市场吃午餐并买伴手礼。")}
            ${slot("晚", "16:00 前", "开始回船", "济州岛距离感很强，18:00 离港，宁可少买一点也别压线。")}
          </div>

          <h2 style="margin-top:26px;">今日当地食物</h2>
          <div class="food-grid">
            ${food("黑猪肉小吃", "偶来市场内常见，适合边走边吃。")}
            ${food("橘子/汉拿峰饮品", "济州标志性水果，咖啡馆和市场都容易买到。")}
            ${food("海鲜小吃", "市场里可以看烤海鲜、鱼饼、海鲜饼。")}
          </div>
        </div>
      </section>

      <section id="korean">
        <h2>韩文速查</h2>
        <p class="lead">复制到 Naver Map 或 Kakao T 搜索，比中文名更稳。</p>
        <div class="quick-list">
          <p>松岛海上缆车<br><code>송도해상케이블카</code></p>
          <p>南浦站<br><code>남포역</code></p>
          <p>扎嘎其站<br><code>자갈치역</code></p>
          <p>田浦洞<br><code>전포동</code></p>
          <p>甘川文化村<br><code>감천문화마을</code></p>
          <p>柱状节理带<br><code>주상절리대</code></p>
          <p>济州橘子咖啡馆<br><code>제주 귤 카페</code></p>
          <p>西归浦每日偶来市场<br><code>서귀포매일올레시장</code></p>
        </div>
        <p class="source-note">图片来自 Wikimedia Commons 公共媒体；评分为旅行平台常见参考分，建议出发前在 Naver Map/Kakao Map 再核对一次。</p>
      </section>
    </main>

    <footer>
      <h2>使用提醒</h2>
      <p>这份 HTML 是单文件，离线可打开查看文字、图片、行程和地图点位。OSM 地图瓦片需要网络；没有网络时，底图可能不显示，但路线数据和导航链接仍在页面内。</p>
    </footer>
  </div>

  <script>${leafletJs}</script>
  <script>
    const routes = ${JSON.stringify(allMapData)};

    function googleNav(p) {
      return "https://www.google.com/maps/dir/?api=1&destination=" + p.lat + "," + p.lng;
    }

    function kakaoNav(p) {
      return "https://map.kakao.com/link/to/" + encodeURIComponent(p.name) + "," + p.lat + "," + p.lng;
    }

    function naverNav(p) {
      return "https://map.naver.com/p/search/" + encodeURIComponent(p.name);
    }

    const map = L.map("map", { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    let layerGroup = L.layerGroup().addTo(map);
    let line;

    function renderRoute(key) {
      layerGroup.clearLayers();
      if (line) line.remove();
      const points = routes[key];
      const latlngs = points.map(p => [p.lat, p.lng]);
      line = L.polyline(latlngs, {
        color: key === "busan" ? "#ef6658" : "#0e8a9a",
        weight: 4,
        opacity: .95,
        dashArray: "8 10"
      }).addTo(map);
      points.forEach(p => {
        const icon = L.divIcon({
          html: '<div class="num-marker">' + p.n + '</div>',
          className: "",
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        L.marker([p.lat, p.lng], { icon }).addTo(layerGroup).bindPopup(
          '<div class="popup-title">' + p.n + '. ' + p.name + '</div>' +
          '<div class="popup-time">' + p.time + '</div>' +
          '<div>' + p.note + '</div>' +
          '<a class="popup-link" href="' + googleNav(p) + '" target="_blank" rel="noopener">Google</a>' +
          '<a class="popup-link naver-link" href="' + naverNav(p) + '" target="_blank" rel="noopener">NAVER Map</a>'
        );
      });
      map.fitBounds(line.getBounds(), { padding: [30, 30] });
      document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.route === key));
    }

    document.querySelectorAll(".tab-btn").forEach(btn => btn.addEventListener("click", () => renderRoute(btn.dataset.route)));
    renderRoute("jeju");
  </script>
</body>
</html>`;

function navLinks(point) {
  const google = `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
  const kakao = `https://map.kakao.com/link/to/${encodeURIComponent(point.name)},${point.lat},${point.lng}`;
  const naver = `https://map.naver.com/p/search/${encodeURIComponent(point.name)}`;
  return `<div class="navlinks"><a class="naver-link" href="${naver}" target="_blank" rel="noopener">NAVER Map</a><a href="${kakao}" target="_blank" rel="noopener">Kakao 导航</a><a href="${google}" target="_blank" rel="noopener">Google 导航</a></div>`;
}

function placeCard(name, img, rating, quote, time, korean, point) {
  return `<article class="card place-card">
    <div class="place-img" role="img" aria-label="${name}真实图片" style="background-image:url('${img}')"></div>
    <div class="place-body">
      <span class="rating">★ ${rating}</span>
      <h3>${name}</h3>
      <p class="meta">${time} · <code>${korean}</code></p>
      <p class="quote">${quote}</p>
      ${navLinks(point)}
    </div>
  </article>`;
}

function slot(label, time, title, body) {
  return `<div class="slot"><div class="slot-time">${label}<br>${time}</div><div class="slot-body"><strong>${title}</strong><span class="meta">${body}</span></div></div>`;
}

function food(name, body) {
  return `<article class="card food-card"><b>${name}</b><span class="meta">${body}</span></article>`;
}

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(outPath, html);
fs.writeFileSync(publicIndexPath, html);
console.log(outPath);
console.log(publicIndexPath);
