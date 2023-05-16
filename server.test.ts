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

  it('returns an array containing a country string', async () => {
    mockedAxios.get.mockResolvedValue(mockCountryData);
    const countries : string[] = await server.getCountryList();
    expect(countries).toContain('Australia');
  });
});
