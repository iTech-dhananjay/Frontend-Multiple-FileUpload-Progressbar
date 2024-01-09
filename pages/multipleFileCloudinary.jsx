import React, { useEffect, useState } from "react";

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileStatus, setFileStatus] = useState([]);
  const [overallStatus, setOverallStatus] = useState("");
  const [overallProgress, setOverallProgress] = useState(0);

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(files);
    // setFileStatus(Array.from({ length: files.length }, () => ""));
    setFileStatus(Array.from({ length: files.length }, () => ({ status: "", progress: 0 })));
  };

//   const uploadFile = async (file, index) => {
//     const chunkSize = 100 * 1024; // 100KB (adjust based on your requirements)
//     const totalChunks = Math.ceil(file.size / chunkSize);
//     const chunkProgress = 100 / totalChunks;

//     let chunkNumber = 0;
//     let start = 0;
//     let end = 0;

//     const uploadNextChunk = async () => {
//       if (end <= file.size) {
//         const chunk = file.slice(start, end);

//         const formData = new FormData();
//         formData.append("file", chunk);
//         formData.append("chunkNumber", chunkNumber);
//         formData.append("totalChunks", totalChunks);
//         formData.append("originalname", file.name);

//         try {
//           const response = await fetch("http://localhost:6001/upload", {
//             method: "POST",
//             body: formData,
//           });

//           if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }

//           const data = await response.json();

//         //   const temp = `File ${index + 1} - Chunk ${
//         //     chunkNumber + 1
//         //   }/${totalChunks} uploaded successfully`;
        
//           const tempStatus = `File ${index + 1} - Chunk ${chunkNumber + 1}/${totalChunks} uploaded successfully`;
//           setFileStatus((prevStatus) => {
//             const newStatus = [...prevStatus];
//             newStatus[index] = { status: tempStatus, progress: (chunkNumber + 1) * chunkProgress };
//             return newStatus;
//           });
//           setOverallStatus(temp);
//           setOverallProgress((index + 1) * chunkProgress + (chunkNumber + 1) * (chunkProgress / totalChunks));

//           console.log(temp);

//           chunkNumber++;
//           start = end;
//           end = start + chunkSize;

//           uploadNextChunk();
//         } catch (error) {
//           console.error("Error uploading chunk:", error);
//         }
//       } else {
//         setOverallProgress((index + 1) * chunkProgress);
//         console.log(`File ${index + 1} upload completed`);
//       }
//     };

//     uploadNextChunk();
//   };


const uploadFile = async (file, index) => {
    const chunkSize = 100 * 1024; // 100KB (adjust based on your requirements)
    const totalChunks = Math.ceil(file.size / chunkSize);
    const chunkProgress = 100 / totalChunks;

    let chunkNumber = 0;
    let start = 0;
    let end = 0;

    const uploadNextChunk = async () => {
      if (end <= file.size) {
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('chunkNumber', chunkNumber);
        formData.append('totalChunks', totalChunks);
        formData.append('originalname', file.name);

        try {
          const response = await fetch('http://localhost:6001/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();

          const tempStatus = `File ${index + 1} - Chunk ${chunkNumber + 1}/${totalChunks} uploaded successfully`;
          setFileStatus((prevStatus) => {
            const newStatus = [...prevStatus];
            newStatus[index] = { status: tempStatus, progress: (chunkNumber + 1) * chunkProgress };
            return newStatus;
          });

          chunkNumber++;
          start = end;
          end = start + chunkSize;

          uploadNextChunk();
        } catch (error) {
          console.error('Error uploading chunk:', error);
        }
      } else {
        const finalStatus = `File ${index + 1} upload completed`;
        setFileStatus((prevStatus) => {
          const newStatus = [...prevStatus];
          newStatus[index] = { status: finalStatus, progress: 100 };
          return newStatus;
        });
        setOverallStatus(finalStatus);
        setOverallProgress((index + 1) * chunkProgress);
      }
    };

    uploadNextChunk();
  };


  const handleFileUpload = () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    Object.entries(selectedFiles).map(([key,value])=>{
        // console.log(key,value)
        uploadFile(value, key);
    })

    // selectedFiles.forEach((file, index) => {
    //     // const blob = new Blob([file]);
    //     // log(blob,index)
    // //   uploadFile(file, index);
    // });
  };


  
  useEffect(()=>{
     console.log(fileStatus,'staus')
  },[fileStatus])

  return (
    <div>
      <h2>Multiple File Upload</h2>
      <div>
        {/* {fileStatus.map((status, index) => (
          <p key={index}>{status}</p>
        ))} */}
        {fileStatus.map(({ status, progress }, index) => (
          <div key={index}>
            <p>{status}</p>
            <div style={{ width: `${progress}%`, height: '20px', backgroundColor: 'green' }}></div>
          </div>
        ))}

      </div>
      {/* <h3>{overallStatus}</h3> */}
      <p>{`Overall Progress at ${overallProgress.toFixed(2)}%`}</p>
      <input type="file" onChange={handleFileChange} multiple />
      <button className="bg-blue-400 border px-2" onClick={handleFileUpload}>Upload Files</button>
    </div>
  );
};

export default FileUpload;