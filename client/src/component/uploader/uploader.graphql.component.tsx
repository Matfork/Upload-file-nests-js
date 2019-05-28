import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';

interface UploaderGraphqlProps {}

export const UploaderGraphqlComponent: React.SFC<
  UploaderGraphqlProps
> = props => {
  const [selectedFile, setSelectedFiled] = useState<any>(null);
  const [multipleUpload, setMultipleUpload] = useState(false);

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
      <h3>Graphql Uploader process</h3>
      <Query query={QUERY_TEST}>
        {({ data, loading }: any) => {
          if (loading !== true) {
            console.log('data from graphql', data);
          }

          return <h3>TESTING GRAPHQL CONNECTION</h3>;
        }}
      </Query>

      <Mutation mutation={UPLOAD_SINGLE_FILE}>
        {(uploadSingleFile: any) => (
          <Mutation mutation={UPLOAD_MULTIPLE_FILE}>
            {(uploadMultipleFile: any) => (
              <React.Fragment>
                <h5>Single Upload</h5>
                <input type="file" required onChange={handleChangeHandler} />
                <br />
                <br />
                <h5>Multiple Upload</h5>
                <input
                  type="file"
                  required
                  multiple
                  onChange={e => handleChangeHandler(e, true)}
                />
                <br />
                <br />
                <button
                  type="button"
                  onClick={() => {
                    const variables = {
                      file: selectedFile,
                      name: 'Jhon perez',
                      age: 25
                    };

                    if (!multipleUpload) {
                      uploadSingleFile({
                        variables
                      });
                    } else {
                      uploadMultipleFile({
                        variables
                      });
                    }
                  }}
                >
                  Submit
                </button>
              </React.Fragment>
            )}
          </Mutation>
        )}
      </Mutation>
    </div>
  );
};

const UPLOAD_SINGLE_FILE = gql`
  mutation singleUpload($file: Upload!, $name: String, $age: Int) {
    singleUpload(file: $file, name: $name, age: $age) {
      filename
    }
  }
`;

const UPLOAD_MULTIPLE_FILE = gql`
  mutation multipleUpload($file: Upload!, $name: String, $age: Int) {
    multipleUpload(file: $file, name: $name, age: $age) {
      filename
    }
  }
`;

const QUERY_TEST = gql`
  query {
    test
  }
`;
