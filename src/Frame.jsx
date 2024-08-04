import { useEffect, useRef, useState } from "react";

export function Frame({
  selectedFile,
  loadFileContent,
  lastHTMLFile,
  setShowHtmlPages,
  showHtmlPages,
  entries,
  toggleFile,
  loadFileContentName,
  togglePages,
}) {
  const cssFiles = togglePages(".css");

  const jsFiles = togglePages(".js");

  const file = loadFileContent(selectedFile);
  function toggleHtmlPages() {
    setShowHtmlPages(!showHtmlPages);
  }

  const iframeRef = useRef(null);

  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    if (file) {
      let htmlContent = loadFileContent(lastHTMLFile).value;
      // let cssMatches = cssRegex.exec(fileContent)
      let match;
      let cssContent = '';
      let jsContent = '';
      const cssRegex = /<link rel="stylesheet" href="(.*?)" \/>/g;
      while ((match = cssRegex.exec(htmlContent)) !== null) {
        const cssFile = loadFileContentName(match[1]);
        if (cssFile) {
          htmlContent += `<style>${cssFile.value}</style>`;
          //cssContent += `<style>${cssFile.value}</style>`;
        }
      }

      

      const jsRegex = /<script src="(.*?)"><\/script>/g;
      while ((match = jsRegex.exec(htmlContent)) !== null) {
        const jsFile = loadFileContentName(match[1]);
        if (jsFile) {
          htmlContent += `<script>${jsFile.value}</script>`;
          
        }
      }
      // console.log(`${htmlContent}${cssContent}${jsContent}`)
      setFileContent(htmlContent);
    }
  }, [file, ...cssFiles, ...jsFiles]);

  // const cssRegex = /<link rel="stylesheet" href="(.*?)" \/>/g;

  // const jsRegex = /<script src="(.*?)"><\/script>/g;

  // let cssMatch = cssRegex.exec(file.value);

  // if (cssMatch) {
  //   let cssTitle = cssMatch[1];
  //   let cssFile = loadFileContentName(cssTitle);
  //   if (cssFile) {
  //     file.value = file.value.replace(
  //       cssRegex,
  //       `<style>${cssFile.value}</style>`
  //     );
  //   }
  // }

  // let jsMatch = jsRegex.exec(file.value);

  // if (jsMatch) {
  //   let jsTitle = jsMatch[1];
  //   let jsFile = loadFileContentName(jsTitle);
  //   if (jsFile) {
  //     file.value = file.value.replace(
  //       jsRegex,
  //       `<script>${jsFile.value}</script>`
  //     );
  //   }
  // }

  return (
    <div className="frame-container">
      <div className="nav-bar">
        <button onClick={() => toggleHtmlPages()} className="pages-button">
          {`Page: ${loadFileContent(lastHTMLFile).title}`}
        </button>
        {showHtmlPages && (
          <ul className="html-files">
            {entries.map((entry) => {
              function htmlButton() {
                setShowHtmlPages(!showHtmlPages);
                toggleFile(entry.id);
              }

              if (entry.title.endsWith(".html")) {
                return (
                  <li className="html-file">
                    <button
                      className={
                        "html-button"
                        //entry.id === selectedFile ? "html-button-selected" : "html-button"
                      }
                      onClick={() => htmlButton()}
                    >
                      {entry.title}
                    </button>
                  </li>
                );
              }
            })}
          </ul>
        )}
      </div>

      <iframe srcDoc={fileContent} id="live-preview"></iframe>
    </div>
  );
}
