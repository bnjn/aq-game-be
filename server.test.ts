const server = require('./server');
import axios from 'axios';

const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('axios');

describe('getCountryList', () => {
  const mockCountryDataSuccess : object = {
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

  const mockCountryDataError : object = {
    "status": "too_many_requests"
  }

  it('returns a country', async () => {
    mockedAxios.get.mockResolvedValue(mockCountryDataSuccess);
    const countries: string = await server.getCountryList();
    expect(countries).toContain('Australia');
  });

  it('returns an array of at least one country', async () => {
    mockedAxios.get.mockResolvedValue(mockCountryDataSuccess);
    const countries: string[] = await server.getCountryList();
    expect(countries).toBeInstanceOf(Array);
    expect(countries.length).toBeGreaterThan(0);
  });

  it('returns another country', async () => {
    mockedAxios.get.mockResolvedValue(mockCountryDataSuccess);
    const countries: string[] = await server.getCountryList();
    expect(countries).toContain('Argentina');
  });

  it('throws error when response status is not success', async () => {
    mockedAxios.get.mockResolvedValue(mockCountryDataError);
    await expect(async () => await server.getCountryList())
        .rejects.toThrow('too_many_requests')
  });
});
