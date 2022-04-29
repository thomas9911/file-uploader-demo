import React, { useEffect, useState } from "react";
import Input from '@mui/material/Input';
import LinearProgressWithLabel from "@mui/material/LinearProgress";
import { Box } from "@mui/material";

function makeRequest(xhr, data) {
    return new Promise(function (resolve, reject) {
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(data);
    });
}

const uploadFile = async (
    file: File,
  fields: Record<string, string>,
  url: string,
  onProgress: (e: ProgressEvent<XMLHttpRequestEventTarget>) => void
): Promise<any> => {
  const formData = new FormData();

  for (const name in fields) {
    formData.append(name, fields[name]);
  }
  formData.append("file", file);

  //   const response = await fetch(url, {
  //     method: "POST",
  //     body: formData,
  //   });

  let request = new XMLHttpRequest();
  request.open("POST", url);

  request.upload.addEventListener("progress", onProgress);

  return makeRequest(request, formData);
};

const App = (): any => {
  let [currentFile, setCurrentFile] = useState<File>();
  let [fileFields, setfileFields] = useState<any>();
  let [success, setSuccess] = useState<boolean | null>(null);
  let [progress, setProgress] = useState(0);
  let onChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    let [file] = (e.target as HTMLInputElement).files;
    if (file) {
      setCurrentFile(file);
      fetch(`http://localhost:4040/api/${file.name}/${file.type}`)
        .then((x) => x.json())
        .then(setfileFields);
    }
  };

  useEffect(() => {
    if (currentFile && fileFields) {
      let { url, fields } = fileFields;
      (async function anyNameFunction() {
          let response = await uploadFile(currentFile, fields, url, (e) => {
              setProgress((e.loaded / e.total) * 100);
        });
        if (response.status == 204) {
          setSuccess(true);
        } else {
          setSuccess(false);
        }
      })();
    }
  }, [fileFields, currentFile]);

  if (currentFile && fileFields) {
    if (success === true) {
      return (
        <Box>
          <p>Uploading complete</p>
          <a target="_self" href="/">
            Again
          </a>
        </Box>
      );
    }
    if (success === false) {
      return (
        <Box>
          <p>Error uploading :'(</p>
          <a target="_self" href="/">
            Try Again
          </a>
        </Box>
      );
    } else {
      return <Box>
          <p>Uploading ....</p>
           <LinearProgressWithLabel variant="determinate" value={progress} />
          </Box>
    }
  } else {
    return (
      <Input
        type="file"
        id="lname"
        name="lname"
        inputProps={{accept: "image/*"}}
        onChange={onChange}
      />
    );
  }
};

export default App;
