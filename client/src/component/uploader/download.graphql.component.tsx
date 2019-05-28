import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import download from 'downloadjs';

interface DownloadProps {}

const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export const DownloadGraphqlComponent: React.SFC<DownloadProps> = props => {
  const [name, setName] = useState<any>(null);
  const [base64, setBase64] = useState<any>('');

  const handleSubmit = async (downloadFn: Function) => {
    const content = await downloadFn({
      variables: {
        name
      }
    });

    if (content && content.data && content.data.donwloadFile) {
      let {
        data: { donwloadFile }
      } = content;

      setBase64(donwloadFile);

      // First form: With Blob
      // Works with everything so far
      const toBlob = b64toBlob(donwloadFile, 'application/pdf'); //Make sure to also bring correct myme for data to be downloaded, right now we are testing with pdfs only
      const url = window.URL.createObjectURL(toBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name}`);
      link.click();
      console.log(link);
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }

      // Second form: Base64, 
      // It seems it doesn't work with files that have a big size, greater than 1Mb
      const mymetype = 'application/pdf'; //Make sure to also bring correct myme for data to be downloaded, right now we are testing with pdfs only
      // const link2 = document.createElement('a');
      // link2.href = `data:${mymetype};base64,${donwloadFile}`;
      // link2.setAttribute('download', `${name}`);
      // link2.click();
      // // document.getElementsByClassName('files')[0].append(link2);
      // console.log(link2);
      // if (link2.parentNode) {
      //   link2.parentNode.removeChild(link);
      // }

      // But if we use a base64 format with a library like 'downloadjs' it works,
      // why? well it seems that downloadjs inside is internally calling a method named dataUrlToBlob() 
      // which converts our base64 to a blob content (yeah like our first form)
      download(`data:${mymetype};base64,${donwloadFile}`, name, mymetype);
    }
  };

  return (
    <div>
      <h3>Download File Graphql with Base64</h3>

      <h5>
        Graphql Note: Since Graphql returns always a JSON, there is no way to
        use it in order to download a file, so you need to use a normal REST
        endpoint as the case above
      </h5>

      {/* <div className="files">
        <a href="./test/test2.pdf" download="PDF">
          Click para descargar archivo
        </a>
      </div> */}

      <Mutation mutation={DOWNLOAD_FILE}>
        {(downloadFile: any) => (
          <React.Fragment>
            <input
              type="text"
              name="file"
              size={100}
              onChange={e => {
                setName(e.target.value);
              }}
            />
            <br />
            <br />

            <button
              type="button"
              onClick={e => {
                handleSubmit(downloadFile);
              }}
            >
              Submit
            </button>

            {base64 !== '' && <img src={`data:image/png;base64, ${base64}`} />}
          </React.Fragment>
        )}
      </Mutation>
    </div>
  );
};

const DOWNLOAD_FILE = gql`
  mutation DonwloadFile($name: String!) {
    donwloadFile(name: $name)
  }
`;
