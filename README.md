# Korea Cruise Day Trip

韩国邮轮靠岸一日游离线图文手册，结构与 `ths-navigation-page` 类似，可部署到 Cloudflare Pages。

## Commands

```bash
npm run build
npm run preview
npm run pages:deploy
```

`npm run build` 会读取 `assets-src/` 内的图片和 Leaflet 资源，生成：

- `public/index.html`：部署入口
- `cruise-conversation-guide.html`：本地直接打开的同内容文件
