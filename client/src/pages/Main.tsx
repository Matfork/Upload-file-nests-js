import React, { Component } from 'react';
import { UploaderComponent } from '../component/uploader/uploader.component';
import { UploaderGraphqlComponent } from '../component/uploader/uploader.graphql.component';
import { DownloadComponent } from '../component/uploader/download.component';
import { DownloadGraphqlComponent } from '../component/uploader/download.graphql.component';

class MainPage extends Component {
  render() {
    return (
      <div>
        <h1>Uploader Page</h1>
        <UploaderComponent />
        <br />
        <br />
        <br />
        <UploaderGraphqlComponent />

        <br />
        <br />
        <br />

        <DownloadComponent />

        <br />
        <br />
        <br />

        <DownloadGraphqlComponent />
      </div>
    );
  }
}

export default MainPage;
