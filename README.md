# markdown-convertor 

Markdown檔案轉換工具，包含以下常用轉換器：
  - generate-html.js



---

## generate-html.js

`generate-html.js` 是一個 Node.js 腳本，用於將 Markdown 文件轉換為 HTML 文件，並處理圖片和超連結。這個腳本遞迴地處理指定資料夾中的所有 Markdown 文件，並將它們轉換為格式化的 HTML 文件，同時支持表格和程式碼區塊的漂亮顯示。

安裝最新NodeJS，並設定為預設node

```bash
nvm install --lts
nvm alias default node
```

在使用 `generate-html.js` 之前，您需要安裝以下 Node.js 套件：

- `markdown-it`：Markdown 轉換器，用於將 Markdown 轉換為 HTML。
- `mkdirp`：用於遞迴創建目錄的工具。

您可以使用以下命令來安裝這些套件：

```bash
npm install markdown-it mkdirp markdown-it-highlightjs
```

## 使用說明

### 準備工作

1. 確保您已安裝 Node.js 和 npm。
2. 安裝所需的 Node.js 套件（見上方安裝說明）。

### 使用腳本

1. **創建輸入和輸出資料夾**：準備好包含 Markdown 文件的輸入資料夾，以及您希望保存生成 HTML 文件的輸出資料夾。

2. **執行腳本**：使用以下命令來執行腳本，並指定輸入和輸出資料夾的路徑：

   ```bash
   node generate-html.js <inputDir> <outputDir>
   ```

   例如，如果您的 Markdown 文件位於 `docs` 資料夾中，並且您希望將生成的 HTML 文件保存到 `html_output` 資料夾中，則可以使用以下命令：

   ```bash
   node generate-html.js docs html_output
   ```

### 功能

- **轉換 Markdown 為 HTML**：將 Markdown 文件轉換為 HTML 文件。
- **處理圖片**：圖片會被複製到 `images` 子資料夾中，並在 HTML 文件中使用正確的相對路徑顯示。
- **修正超連結**：Markdown 文件中的連結會被正確地轉換為 HTML 格式的連結。
- **表格樣式**：生成的 HTML 文件中的表格會套用預設的 CSS 樣式，讓表格看起來更美觀。

### 注意事項

- 確保所有 Markdown 文件和圖片的路徑都是正確的，以便它們能夠被正確處理和轉換。
- 請確保您的 Markdown 文件中使用的圖片路徑是相對於 Markdown 文件的路徑。

---
