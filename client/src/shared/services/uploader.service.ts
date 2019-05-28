const API_URL = 'http://localhost:4001/api';

export class UploaderService {
  public static doUpload = async (data: FormData): Promise<any> => {
    const bo = JSON.stringify({
      name2: 'aaa'
    }) as any;

    try {
      const response = await fetch(`${API_URL}/uploader/add`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          //'Content-Type': 'application/json' // Don't add it FormData doesn't work with 'application/json' because data is not a json
          //'Content-Type': 'multipart/form-data;' // Not needed when using FormData
        },
        body: data
      });
      const content = await response.json();
      return {
        data: content.data
      };
    } catch (e) {
      console.log('error', e);
      return {
        error: {
          name: e.name,
          message: e.message,
          details: e.details ? e.details : null
        }
      };
    }
  };

  public static doMultipleUploads = async (data: FormData): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/uploader/addMultiple`, {
        method: 'POST',
        mode: 'cors',
        body: data
      });
      const content = await response.json();
      return {
        data: content.data
      };
    } catch (e) {
      console.log('error', e);
      return {
        error: {
          name: e.name,
          message: e.message,
          details: e.details ? e.details : null
        }
      };
    }
  };
}
