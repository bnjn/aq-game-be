const server = require('./server');
import axios from 'axios';

const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('axios');

describe('getCountryList', () => {
  const mockCountryData : object = {
    "status": "success",
    "data": [
      {
        "country": "Andorra"
      },
      {
        "country": "Argentina"
      },
      {
        "country": "Australia"
      },
      {
        "country": "Austria"
      }
    ]
  }

  it('returns a list of available countries from AirVisual API', async () => {
    mockedAxios.get.mockResolvedValue(mockCountryData);
    const country : string = await server.getCountryList();
    expect(country).toContain('Australia');
  });
});
