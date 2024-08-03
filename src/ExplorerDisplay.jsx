export function ExplorerDisplay({
  entry,
  toggleFile,
  toggleFolder,
  selectedFile,
}) {
  if (entry.type === "file") {
    return (
      <li key={entry.id} className={entry.type}>
        <button
          onClick={() => toggleFile(entry.id)}
          className={`${
            entry.id === selectedFile ? "file-button-selected" : "folder-button"
          }`}
        >
          {entry.title}
        </button>
      </li>
    );
  } else if (entry.type === "folder") {
    return (
      <li key={entry.id} className={entry.type}>
        <button
          onClick={() => toggleFolder(entry.id)}
          className="folder-button"
        >
          {entry.title}
        </button>
        {entry.isOpen && (
          <ul className="folder-contents">
            {entry.children.map((child) => (
              <ExplorerDisplay
                key={child.id}
                entry={child}
                toggleFile={toggleFile}
                toggleFolder={toggleFolder}
                selectedFile={selectedFile}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }
}
