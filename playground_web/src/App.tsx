import React, { useEffect, useState } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Input,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";

const extractData = ({ data }) => {
  let { generateFileUploadRequest } = data;

  return {
    fields: generateFileUploadRequest.fields,
    url: generateFileUploadRequest.url,
  };
};

function makeRequest(xhr, data) {
  return new Promise(function (resolve, reject) {
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText,
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

  let request = new XMLHttpRequest();
  request.open("POST", url);

  request.upload.addEventListener("progress", onProgress);

  return makeRequest(request, formData);
};

const Footer = (): any => {
  return (
    <BottomNavigation showLabels>
      <BottomNavigationAction
        label="Minio dashboard"
        href="http://localhost:9001"
        target="_blank"
      />
    </BottomNavigation>
  );
};

const App = (): any => {
  const [data, setData] = useState(null);
  const [url, setUrl] = useState(null);
  const [fields, setFields] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  let [success, setSuccess] = useState<boolean | null>(null);
  let [progress, setProgress] = useState(0);

  const func = ({ target: target }) => {
    // console.log({txt: target.value})
    try {
      let d = JSON.parse(target.value);
      setData(d);
    } catch (e) {
      setData(null);
      setUrl(null);
      setFields(null);
    }
  };

  useEffect(() => {
    if (data) {
      let { fields, url } = extractData(data);

      setUrl(url);
      setFields(fields);
    }
  }, [data]);

  let input = <></>;
  if (url) {
    let onFileChange = ({ target: target }) => {
      setCurrentFile(target.files[0]);
    };
    input = <Input type="file" onChange={onFileChange}></Input>;
  }

  let progressbar = <></>;
  if (progress) {
    if (!success) {
      progressbar = (
        <LinearProgress variant="determinate" value={progress}></LinearProgress>
      );
    } else {
      progressbar = <></>;
    }
  }

  useEffect(() => {
    if (currentFile && fields) {
      (async function anyNameFunction() {
        try {
          let response = await uploadFile(currentFile, fields, url, (e) => {
            setProgress((e.loaded / e.total) * 100);
          });
          if (response.status == 204) {
            setSuccess(true);
          } else {
            setSuccess(false);
          }
        } catch (error) {
          console.error(error);
          setSuccess(false);
        }
      })();
    }
  }, [currentFile]);

  return (
    <Box>
      <Typography variant="h2">Upload file</Typography>
      <Typography>
        Upload a file using the result of a generateFileUploadRequest mutation
        like:
      </Typography>
      <pre>
        {`
mutation {
  generateFileUploadRequest(modelName: "Modelname", propertyName: "myimage", contentType: "image/png", fileName: "test.png") {
    ... on PresignedPostRequest {
      reference
      fields
      url
    }
  }
}
`}
      </pre>
      <TextField
        id="standard-basic"
        label="Standard"
        variant="outlined"
        multiline
        minRows={10}
        fullWidth
        onChange={func}
      />
      {input}
      {progressbar}
      <Footer />
    </Box>
  );
};

export default App;
