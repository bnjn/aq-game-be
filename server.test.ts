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

  it('returns a country', async () => {
    mockedAxios.get.mockResolvedValue(mockCountryData);
    const countries: string = await server.getCountryList();
    expect(countries).toContain('Australia');
  });

  it('returns an array of at least one country', async () => {
    mockedAxios.get.mockResolvedValue(mockCountryData);
    const countries: string[] = await server.getCountryList();
    expect(countries).toBeInstanceOf(Array);
    expect(countries.length).toBeGreaterThan(0);
  });
});
