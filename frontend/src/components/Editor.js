import React, { useRef, useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
// import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/en.js';
// import '@ckeditor/ckeditor5-build-decoupled-document/build/styles.css';
import '@ckeditor/ckeditor5-theme-lark/theme/theme.css';


import "../App.css"

function MyUploadAdapter(loader) {
  return {
    upload: async () => {
      const file = await loader.file;
      const formData = new FormData();
      formData.append("upload", file);

      try {
        const res = await fetch("http://localhost:5000/api/uploads",  {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        // ✅ Check if server responded OK
        if (!res.ok) {
          const errorText = await res.text(); // read text if not JSON
          console.error("Upload failed:", errorText);
          throw new Error(`Upload failed with status ${res.status}`);
        }

        const result = await res.json();
        console.log("Upload result:", result);

        // ✅ Make sure backend sends result.url
        return { default: result.url };
      } catch (err) {
        console.error("Upload error:", err);
        throw err;
      }
    },
  };
}

function MyCustomUploadPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
    new MyUploadAdapter(loader);
}


const Editor = ({ data, onChange }) => {
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  const config = {
    extraPlugins: [MyCustomUploadPlugin],
    toolbar: [
      'heading', '|',
      'bold', 'italic', 'underline', 'link', '|',
      'bulletedList', 'numberedList', 'blockQuote', '|',
      'insertTable', 'mediaEmbed', 'imageUpload', '|',
      'undo', 'redo',
    ],
    placeholder: 'Type your campaign content here...',
  };


  return (
    <div className="editor-wrapper">
      <div ref={toolbarRef} />
      {ready && (
        <CKEditor
          editor={DecoupledEditor}
          data={data}
          config={config}
          onReady={(editor) => {
            toolbarRef.current.appendChild(editor.ui.view.toolbar.element);
            editorRef.current = editor;
          }}
          onChange={(event, editor) => onChange(editor.getData())}
        />
      )}
    </div>
  );
};

export default Editor;
