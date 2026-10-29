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

導覽／頁尾各有一個來源，由 build 同步到所有頁面。只修改 src，不修改 dist。推送 main 會在測試、建置與連結檢查通過後部署；也可手動執行工作流程。功能開發請使用分支，本機 commit 不會發布。

提交訊息使用中文，例如「新增：浮標挑戰與開發工具箱」或「修正：羅盤停止位置」。

個人紀錄與收藏保存在 localStorage，沒有全站訪客追蹤。工具輸入不會上傳。字型從 Google Fonts 載入。
