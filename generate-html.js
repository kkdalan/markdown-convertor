const MarkdownIt = require('markdown-it');
const hljs = require('markdown-it-highlightjs');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

// 初始化 markdown-it 並使用 highlight.js
const md = new MarkdownIt().use(hljs);

// 取得參數
const inputDir = process.argv[2];
const outputDir = process.argv[3];

// 檢查參數
if (!inputDir || !outputDir) {
    console.error('請提供輸入資料夾和輸出資料夾作為參數');
    console.error('使用方式: node generate-html.js <inputDir> <outputDir>');
    process.exit(1);
}

// 確保輸出資料夾存在
mkdirp.sync(outputDir);

// 遞迴處理 Markdown 檔案和其他檔案
function processDirectory(inputDir, outputDir) {
    fs.readdir(inputDir, (err, files) => {
        if (err) {
            console.error('無法列出目錄中的檔案', err);
            process.exit(1);
        }

        files.forEach(file => {
            const inputFilePath = path.join(inputDir, file);
            const outputFilePath = path.join(outputDir, file);

            fs.stat(inputFilePath, (err, stats) => {
                if (err) {
                    console.error('無法讀取檔案狀態', err);
                    return;
                }

                if (stats.isDirectory()) {
                    // 如果是資料夾，遞迴處理
                    const newOutputDir = path.join(outputDir, file);
                    mkdirp.sync(newOutputDir);
                    processDirectory(inputFilePath, newOutputDir);
                } else if (file.endsWith('.md')) {
                    // 如果是 Markdown 檔案，處理圖片並轉換為 HTML
                    processMarkdownFile(inputFilePath, outputFilePath.replace(/\.md$/, '.html'));
                } else {
                    // 複製其他檔案
                    mkdirp.sync(path.dirname(outputFilePath)); // 確保目錄存在
                    fs.copyFile(inputFilePath, outputFilePath, err => {
                        if (err) {
                            console.error('複製檔案失敗', err);
                        }
                    });
                }
            });
        });
    });
}

// 處理 Markdown 檔案中的圖片和連結，並轉換為 HTML
function processMarkdownFile(inputFilePath, outputFilePath) {
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('讀取 Markdown 檔案失敗', err);
            return;
        }

        const baseDir = path.dirname(inputFilePath);
        const relativeOutputDir = path.relative(baseDir, outputDir);

        // 更新圖片路徑
        data = data.replace(/!\[.*?\]\((.*?)\)/g, (match, p1) => {
            const imagePath = path.resolve(baseDir, p1);
            const imageName = path.basename(imagePath);
            const relativeImagePath = path.relative(path.dirname(outputFilePath), path.join(outputDir, 'images', imageName));

            // 複製圖片檔案
            fs.copyFile(imagePath, path.join(outputDir, 'images', imageName), err => {
                if (err) {
                    console.error('複製圖片檔案失敗', err);
                }
            });

            return `![${imageName}](${relativeImagePath})`;
        });

        // 更新 Markdown 檔案中的連結
        data = data.replace(/\[.*?\]\((.*?\.md)\)/g, (match, p1) => {
            const htmlPath = p1.replace(/\.md$/, '.html');
            const relativeHtmlPath = path.relative(path.dirname(outputFilePath), path.join(outputDir, htmlPath));
            return match.replace(p1, relativeHtmlPath);
        });

        // 修正超連結目錄層級
        data = data.replace(/<a href="([^"]*\.html)">/g, (match, p1) => {
            const correctedPath = path.relative(path.dirname(outputFilePath), path.join(outputDir, p1));
            return `<a href="${correctedPath}">`;
        });

        // 使用 markdown-it 進行轉換
        const htmlContent = md.render(data);

        // 增加 CSS 樣式
        const styledHtmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; color: #333; }
                table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
                th, td { border: 1px solid #ddd; padding: 8px; }
                th { background-color: #f2f2f2; text-align: left; }
                tr:nth-child(even) { background-color: #f9f9f9; }
                tr:hover { background-color: #ddd; }
                img { max-width: 100%; height: auto; }
                pre { background: #f4f4f4; padding: 1em; border: 1px solid #ddd; }
                code { font-family: Monaco, Menlo, Consolas, "Courier New", monospace; }
                /* Code block */
                pre code { display: block; overflow-x: auto; padding: 1em; color: #333; background: #f8f8f8; border-radius: 5px; }
                .hljs-comment {
                    color: #6a9955;
                    font-style: italic;
                }
                .hljs-keyword,
                .hljs-operator,
                .hljs-builtin-name,
                .hljs-title,
                .hljs-type {
                    color: #569cd6;
                    font-weight: bold;
                }
                .hljs-variable,
                .hljs-string,
                .hljs-class .hljs-title,
                .hljs-function,
                .hljs-param {
                    color: #d69d85;
                }
                .hljs-number,
                .hljs-literal {
                    color: #b5cea8;
                }
                .hljs-tag,
                .hljs-name,
                .hljs-attribute {
                    color: #9cdcfe;
                }
                .hljs-regexp,
                .hljs-symbol {
                    color: #d4d4d4;
                }
                .hljs-deletion {
                    color: #f44747;
                }
                .hljs-addition {
                    color: #b5cea8;
                }
            </style>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/default.min.css">
        </head>
        <body>
            ${htmlContent}
        </body>
        </html>`;

        // 保存為 HTML 檔案
        fs.writeFile(outputFilePath, styledHtmlContent, 'utf8', err => {
            if (err) {
                console.error('寫入 HTML 檔案失敗', err);
                return;
            }

            console.log(`已將 ${inputFilePath} 轉換為 HTML.`);
        });
    });
}

// 開始處理
console.log('HTML 轉換處理中...');
processDirectory(inputDir, outputDir);
