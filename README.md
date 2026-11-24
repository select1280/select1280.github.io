# select1280 個人網站

海洋主題的個人靜態網站，包含每日漂流瓶、航行日誌、4 款遊戲與 8 款工具。

## 開發

需要 Node.js 20 以上，不需要安裝第三方套件。

```sh
npm run dev
npm test
npm run build
npm run check
```

## 結構

- src/pages：五個頁面的內容模板。
- src/shared：共用導覽、頁尾與本機儲存。
- src/features：遊戲、工具、海洋互動與漂流瓶。
- src/styles：唯一樣式來源。
- public：靜態資源。
- scripts：無依賴的建置、檢查與預覽。
- tests：輸入邊界、時間轉換、文字比較等測試。
- dist：自動產生的發布檔案，不手動修改、不提交。

## 修改與發布

定期維護與每次發布的檢查方式見 [維護約定](docs/maintenance.md)：每次發布檢查、每月一次健康檢查、每季一次技術與內容檢視。

導覽／頁尾各有一個來源，由 build 同步到所有頁面。只修改 src，不修改 dist。推送 main 會在測試、建置與連結檢查通過後部署；也可手動執行工作流程。功能開發請使用分支，本機 commit 不會發布。

首頁日誌預覽由 scripts/journal-preview.mjs 讀取 src/pages/journal.html 的前三篇文章產生；新增日誌請放在頁面最前面，保留標題、日期與文章 ID。天氣元件位於 src/shared/weather.html，互動在 src/features/weather，海洋天氣與日誌預覽的樣式集中在 src/styles/atmosphere.css。

提交訊息使用中文，例如「新增：浮標挑戰與開發工具箱」或「修正：羅盤停止位置」。

個人紀錄與收藏保存在 localStorage，沒有全站訪客追蹤。工具輸入不會上傳。字型從 Google Fonts 載入。

海洋探索圖鑑分成 atlas-data.js（事件、解鎖與抽取規則）、atlas.js（互動與儲存）、atlas.html（介面）及 ocean-atlas.css（插圖動畫與響應版面）。新增事件需同時檢查區域門檻、收藏總數及測試。圖鑑使用獨立的 littlebreak:ocean-atlas-v1 儲存鍵，不影響舊遊戲紀錄或漂流瓶收藏。
