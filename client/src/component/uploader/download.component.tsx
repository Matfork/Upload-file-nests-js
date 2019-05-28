import React, { useState } from 'react';
import { DownloadService } from '../../shared/services/download.service';

interface DownloadProps {}

export const DownloadComponent: React.SFC<DownloadProps> = props => {
  const [name, setName] = useState<any>(null);

  const handleSubmit = async () => {
    const content = await DownloadService.download(name);

    if (!!content.isFile) {
      const url = window.URL.createObjectURL(new Blob([content.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sample.${name}`);
      link.click();
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    }
  };

  return (
    <div>
      <h3>Download File</h3>

      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
        noValidate={true}
      >
        <h5>Donwload file</h5>
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
