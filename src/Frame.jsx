export function Frame({
  selectedFile,
  loadFileContent,
  lastHTMLFile,
  setShowHtmlPages,
  showHtmlPages,
  entries,
  toggleFile,
}) {
  const file = loadFileContent(selectedFile);
  function toggleHtmlPages() {
    setShowHtmlPages(!showHtmlPages);
  }



  return (
    <div className="frame-container">
      <div className="nav-bar">
        <button onClick={() => toggleHtmlPages()} className="pages-button">
          {`Page: ${file.title}`}
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
                      className={'html-button'
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
      <iframe
        srcDoc={
          file.value && file.title.endsWith(".html")
            ? file.value
            : loadFileContent(lastHTMLFile).value
        }
        id="live-preview"
      ></iframe>
    </div>
  );
}
