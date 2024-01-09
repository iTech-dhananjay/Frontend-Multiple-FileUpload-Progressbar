import React, { useState } from "react";

// import { Button } from "@mui/material";
// import Progress from "../../components/progress";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    console.log(event.target.files,'event')
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const chunkSize =  100 * 1024; // 5MB (adjust based on your requirements)
    const totalChunks = Math.ceil(selectedFile.size / chunkSize);
    const chunkProgress = 100 / totalChunks;
    let chunkNumber = 0;
    let start = 0;
    let end = 0;
    console.log(totalChunks,chunkProgress,'test')
    const uploadNextChunk = async () => {
      if (end <= selectedFile.size) {
        const chunk = selectedFile.slice(start, end);
        console.log(chunk)
        const formData = new FormData();
        formData.append("file", chunk);
        formData.append("chunkNumber", chunkNumber);
        formData.append("totalChunks", totalChunks);
        formData.append("originalname", selectedFile.name);

        fetch("http://localhost:6001/upload", {
            // mode: 'no-cors',
            method: "POST",
            body: formData,
          })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json();
            })
            .then((data) => {
              console.log({ data });
              const temp = `Chunk ${
                chunkNumber + 1
              }/${totalChunks} uploaded successfully`;
              setStatus(temp);
              setProgress(Number((chunkNumber + 1) * chunkProgress));
              console.log(temp);
              chunkNumber++;
              start = end;
              end = start + chunkSize;
              uploadNextChunk();
            })
            .catch((error) => {
              console.error("Error uploading chunk:", error);
            });
        } else {
          setProgress(100);
          setSelectedFile(null);
          setStatus("File upload completed");
        }
      };
  
      uploadNextChunk();
    };

    return (
        <div>
          <h2>Resumable File Upload</h2>
          <h3>{status}</h3>
          <p>{`progess  at ${progress}`}</p>
          {/* {progress > 0 && <Progress value={progress} />} */}
          <div style={{ width: `${progress}%`, height: '20px', backgroundColor: 'green' }}></div>

          <input type="file" onChange={handleFileChange}  multiple/>
          <button onClick={handleFileUpload}>Upload File</button>
        </div>
      );
    };
    
    export default FileUpload;
    
