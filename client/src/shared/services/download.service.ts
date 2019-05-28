const API_URL = 'http://localhost:4001/api';

export class DownloadService {
  public static download = async (fileName: String): Promise<any> => {
    const bo = JSON.stringify({
      name2: 'aaa'
    }) as any;

    try {
      const response = await fetch(`${API_URL}/download/?name=${fileName}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // if the type is json return, interpret it as json
      if (
        response.headers.get('Content-Type') &&
        response.headers.get('Content-Type')!.indexOf('application/json') > -1
      ) {
        const jsonContent = await response.json();
        if (jsonContent.error) {
          throw jsonContent.error;
        }
        return {
          data: jsonContent,
          isFile: false
        };
      }

      const blobContent = await response.blob();
      return {
        data: blobContent,
        isFile: true
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
