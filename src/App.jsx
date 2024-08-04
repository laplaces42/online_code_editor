import { useState } from "react";
// import "./style.css";
import { FileExplorer } from "./FileExplorer";
import { TextEditor } from "./TextEditor";
import { Frame } from "./Frame";

export default function App() {
  const htmlText = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

</body>
</html>`;

  const [newItem, setNewItem] = useState("");
  const [entries, setEntries] = useState([
    {
      id: crypto.randomUUID(),
      title: "index.html",
      type: "file",
      value: htmlText,
    },
    { id: crypto.randomUUID(), title: "script.js", type: "file", value: "" },
    { id: crypto.randomUUID(), title: "style.css", type: "file", value: "" },
    {
      id: crypto.randomUUID(),
      title: "folder1",
      type: "folder",
      isOpen: false,
      children: [
        { id: crypto.randomUUID(), title: "blank.html", type: "file", value: htmlText },
        { id: crypto.randomUUID(), title: "file2", type: "file", value: "" },
        {
          id: crypto.randomUUID(),
          title: "folder1",
          type: "folder",
          isOpen: false,
          children: [
            {
              id: crypto.randomUUID(),
              title: "file3",
              type: "file",
              value: "",
            },
            {
              id: crypto.randomUUID(),
              title: "file4",
              type: "file",
              value: "",
            },
          ],
        },
      ],
    },
  ]);

  const [selectedFile, setSelectedFile] = useState(() => {
    return entries.find((entry) => entry.title === "index.html").id;
  });
  const [lastHTMLFile, setLastHTMLFile] = useState(() => {
    return entries.find((entry) => entry.title === "index.html").id;
  });
  const [showHtmlPages, setShowHtmlPages] = useState(false);


  function newEntry(entryType) {
    if (newItem !== "") {
      const newEntry = {
        id: crypto.randomUUID(),
        title: newItem,
        type: entryType,
        isOpen: false,
        value: newItem.endsWith(".html") ? htmlText : "",
      };

      if (entryType === "folder") {
        newEntry.children = [];
      }
      setEntries((currentEntries) => {
        return [...currentEntries, newEntry];
      });
      setNewItem("");
      toggleFile(newEntry.id)
    }
  }

  function toggleFolder(id) {
    setEntries((currentEntries) => {
      return currentEntries.map((entry) => {
        if (entry.id === id) {
          return { ...entry, isOpen: !entry.isOpen };
        } else if (entry.type === "folder" && entry.children) {
          return { ...entry, children: toggleNestedFolder(entry.children, id) };
        } else {
          return entry;
        }
      });
    });
  }

  function toggleNestedFolder(children, id) {
    return children.map((child) => {
      if (child.id === id) {
        return { ...child, isOpen: !child.isOpen };
      } else if (child.type === "folder" && child.children) {
        return { ...child, children: toggleNestedFolder(child.children, id) };
      } else {
        return child;
      }
    });
  }

  function toggleFile(id) {
    setSelectedFile(id);
    const file = loadFileContent(id);
    if (file && file.title.endsWith(".html")) {
      setLastHTMLFile(id);
    }
  }

  function togglePages(fileType) {
    const pages = []
    for (const entry of entries) {
      if (entry.title.endsWith(fileType)) {
        pages.push(entry)
      } else if (entry.type === 'folder') {
        toggleNestedPages(fileType, entry.children, pages)
      }
    }
    return pages
  }

  function toggleNestedPages(fileType, children, pages) {
    for (const entry of children) {
      if (entry.title.endsWith(fileType)) {
        pages.push(entry)
      } else if (entry.type === 'folder') {
        toggleNestedPages(fileType, entry.children, pages)
      }
    }
    return pages
  }

  

  function displayEditors(entries) {
    return entries.map((entry) => {
      if (entry.type === "file") {
        return (
          <textarea
            //name="index-text-editor"
            key={entry.id}
            id={`${entry.title.replace(".", "_")}Editor`}
            className={`${
              entry.id === selectedFile ? "text-editor-selected" : "text-editor"
            }`}
            defaultValue={entry.value}
            onChange={(e) => updateTextArea(entry.id, e.target.value)}
            //defaultValue={entry.value}
          ></textarea>
        );
      } else if (entry.type === "folder") {
        return <>{displayEditors(entry.children)}</>;
      }
    });
  }


  function updateTextArea(id, value = "") {
    const updateEntryValue = (entries) => {
      return entries.map((entry) => {
        if (entry.id === id) {
          return { ...entry, value };
        } else if (entry.type === "folder" && entry.children) {
          return { ...entry, children: updateEntryValue(entry.children) };
        } else {
          return entry;
        }
      });
    };

    setEntries((currentEntries) => updateEntryValue(currentEntries));
  }

  function loadFileContent(selectedFile) {
    for (const entry of entries) {
      if (entry.id === selectedFile) {
        return entry;
      } else if (entry.type === "folder") {
        const nestedEntry = loadNestedFileContent(selectedFile, entry.children);
        if (nestedEntry) return nestedEntry;
      }
    }
  }

  function loadNestedFileContent(selectedFile, children) {
    for (const entry of children) {
      if (entry.id === selectedFile) {
        return entry;
      } else if (entry.type === "folder") {
        const nestedEntry = loadNestedFileContent(selectedFile, entry.children);
        if (nestedEntry) return nestedEntry;
      }
    }
  }

  function loadFileContentName(fileName) {
    for (const entry of entries) {
      if (entry.title === fileName) {
        return entry
      } else if (entry.type === 'folder') {
        const nestedEntry = loadNestedFileContentName(fileName, entry.children)
        if (nestedEntry) return nestedEntry
      }
    }
  }

  function loadNestedFileContentName(fileName, children) {
    for (const entry of children) {
      if (entry.title === fileName) {
        return entry
      } else if (entry.type === 'folder') {
        const nestedEntry = loadNestedFileContentName(fileName, entry.children)
        if (nestedEntry) return nestedEntry
      }
    }
  }

  return (
    <div className="app">
      <FileExplorer
        entries={entries}
        newItem={newItem}
        toggleFile={toggleFile}
        toggleFolder={toggleFolder}
        selectedFile={selectedFile}
        setNewItem={setNewItem}
        newEntry={newEntry}
      />
      <div className="frame-editor">
        <TextEditor
          entries={entries}
          selectedFile={selectedFile}
          displayEditors={displayEditors}
        />
        <Frame
          selectedFile={selectedFile}
          loadFileContent={loadFileContent}
          lastHTMLFile={lastHTMLFile}
          setShowHtmlPages={setShowHtmlPages}
          showHtmlPages={showHtmlPages}
          entries={entries}
          toggleFile={toggleFile}
          loadFileContentName={loadFileContentName}
          togglePages={togglePages}
        />
      </div>
    </div>
  );
}
