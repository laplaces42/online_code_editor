import { useState } from "react";
import "./style.css";
import { ExplorerDisplay } from "./ExplorerDisplay";

export function FileExplorer({entries, newItem, toggleFile, toggleFolder, selectedFile, setNewItem, newEntry}) {

  return (
    <div className="file-explorer">
      <div className="new-entry-menu">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          type="text"
          id="new-entry-input"
          placeholder="Enter name here:"
        />
        <button className="new-file" onClick={() => newEntry("file")}>
          New File
        </button>
        <button className="new-folder" onClick={() => newEntry("folder")}>
          New Folder
        </button>
      </div>
      <ul className="editor-files">
        {
          entries.map((entry) => (
            <ExplorerDisplay
              key={entry.id}
              entry={entry}
              toggleFile={toggleFile}
              toggleFolder={toggleFolder}
              selectedFile={selectedFile}
            />
          ))

        }
      </ul>
    </div>
  );
}

