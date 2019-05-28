import React, { useState } from 'react';
import { UploaderService } from './../../shared/services/uploader.service';

interface UploaderProps {}

export const UploaderComponent: React.SFC<UploaderProps> = props => {
  const [selectedFile, setSelectedFiled] = useState<any>(null);
  const [multipleUpload, setMultipleUpload] = useState(false);

  const handleUploader = async () => {
    // FormData uses the same format a form would use if the encoding type were set to "multipart/form-data"
    // Guess we use this for ajax, it will automatically set
    // Content-Type: multipart/form-data; boundary=...
    // If using this, do not add headers: {'Content-Type': 'application/json'}, it is unnecessary  and also
    // will change Formdata payload a little bit

    const data = new FormData();
    data.append('name', 'Juan Perez');
    data.append('age', '25');

    if (!multipleUpload) {
      data.append('single_file', selectedFile);
      await UploaderService.doUpload(data);
    } else {
      for (var x = 0; x < selectedFile.length; x++) {
        data.append('multiple_files', selectedFile[x]);
      }
      await UploaderService.doMultipleUploads(data);
    }
  };

  const handleChangeHandler = (event: any, multiple: boolean = false) => {
    // if (
    //   validateMaxSelectFile(event) &&
    //   validateFileType(event) &&
    //   validateMaxSize(event)
    // ) {
    const files = !!multiple ? event.target.files : event.target.files[0];
    setSelectedFiled(files);
    setMultipleUpload(multiple);
    console.log(files);
    // }
  };

  const validateMaxSelectFile = (event: any) => {
    const maxFilesSelected = 3;
    const files = event.target.files;
    if (files.length > maxFilesSelected) {
      const msg = `Only ${maxFilesSelected} images can be uploaded at a time`;
      event.target.value = null; // discard selected file
      console.log(msg);
      return false;
    }
    return true;
  };

  const validateFileType = (event: any) => {
    const allowMimetypes = ['image/png', 'image/jpeg', 'image/gif'];
    const files = event.target.files;
    let err = '';

    for (var x = 0; x < files.length; x++) {
      if (allowMimetypes.every(type => files[x].type !== type)) {
        // create error message and assign to container
        err += `${files[x].type} is not a supported format\n`;
      }
    }

    if (err !== '') {
      // if message not same old that mean has error
      event.target.value = null; // discard selected file
      console.log(err);
      return false;
    }
    return true;
  };

  const validateMaxSize = (event: any) => {
    const maxSizeInMb: number = 1.5;
    const files = event.target.files;

    let err = '';
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > maxSizeInMb * 1000000) {
        err += `${files[x].type} is too large, please pick a smaller file\n`;
      }
    }
    if (err !== '') {
      event.target.value = null;
      console.log(err);
      return false;
    }

    return true;
  };

  return (
    <div>
      <h3>Uploader process</h3>

      <form
        onSubmit={e => {
          e.preventDefault();
          handleUploader();
        }}
        noValidate={true}
      >
        <h5>Single upload</h5>
        <input type="file" name="avatar" onChange={handleChangeHandler} />
        <br />
        <br />

        <h5>Multiple upload</h5>
        <input
          type="file"
          name="second_avatar"
          multiple
          onChange={e => handleChangeHandler(e, true)}
        />
        <br />
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
