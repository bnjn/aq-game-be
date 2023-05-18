const server = require('./server');
import axios from 'axios';

const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('axios');

describe('getCountryList', () => {
  const mockCountryDataSuccess : object = {
    "data": {
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
  }

  const mockCountryDataError : object = {
    "response": {
      "data": {
        "status": "fail",
        "data": {
          "message": "too_many_requests"
        }
      }
    }
  }

  it('returns a country', async () => {
    mockedAxios.get.mockResolvedValue(mockCountryDataSuccess);
    const countries: string[] = await server.getCountryList();
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
    mockedAxios.get.mockRejectedValue(mockCountryDataError);
    await expect(server.getCountryList()).rejects.toThrow('too_many_requests')
  });
});

describe('getStateList', () => {
  const mockChinaStateDataSuccess : object = {
    "data": {
      "status": "success",
      "data": [
        {
          "state": "Anhui"
        },
        {
          "state": "Beijing"
        },
        {
          "state": "Chongqing"
        },
        {
          "state": "Fujian"
        }
      ]
    }
  }

  const mockChinaStateDataNotFound : object = {
    "response": {
      "data": {
        "status": "fail",
        "data": {
          "message": "country_not_found"
        }
      }
    }
  }

  const mockChinaStateDataError : object = {
    "response": {
      "data": {
        "status": "fail",
        "data": {
          "message": "incorrect_api_key"
        }
      }
    }
  }

  it('returns a state when passed a country', async () => {
    mockedAxios.get.mockResolvedValue(mockChinaStateDataSuccess);
    const states: string[] = await server.getStateList('China');
    expect(states).toContain('Beijing');
  });

  it('returns an array of at least one state when passed a country', async () => {
    mockedAxios.get.mockResolvedValue(mockChinaStateDataSuccess);
    const states: string[] = await server.getStateList('China');
    expect(states).toBeInstanceOf(Array);
    expect(states.length).toBeGreaterThan(0);
  });

  it('returns another state when passed a country', async () => {
    mockedAxios.get.mockResolvedValue(mockChinaStateDataSuccess);
    const states: string[] = await server.getStateList('China');
    expect(states).toContain('Fujian');
  });

  it('throws error when input country not found', async () => {
    mockedAxios.get.mockRejectedValue(mockChinaStateDataNotFound);
    await expect(server.getStateList('Imagination Land')).rejects.toThrow('country not found "Imagination Land"')
  });

  it('throws error on other API error', async () => {
    mockedAxios.get.mockRejectedValue(mockChinaStateDataError);
    await expect(server.getStateList('China')).rejects.toThrow('incorrect_api_key')
  });
});

describe('getCityList', () => {
  const mockUkCityDataSuccess: object = {
    "data": {
      "status": "success",
      "data": [
        {
          "city": "Ascot"
        },
        {
          "city": "Ashford"
        },
        {
          "city": "Ashton in Makerfield"
        },
        {
          "city": "Ashton-under-Lyne"
        },
        {
          "city": "Barnsbury"
        }
      ]
    }
  }

  it('returns a list of cities when given a country and state.', async () => {
    mockedAxios.get.mockResolvedValue(mockUkCityDataSuccess);
    const cities: string[] = await server.getCityList('United Kingdom', 'England');
    expect(cities).toContain('Barnsbury');
  });

  it('returns an array of at least one city when passed a country and state', async () => {
    mockedAxios.get.mockResolvedValue(mockUkCityDataSuccess);
    const cities: string[] = await server.getCityList('United Kingdom', 'England');
    expect(cities).toBeInstanceOf(Array);
    expect(cities.length).toBeGreaterThan(0);
  });

  it('returns a different city.', async () => {
    mockedAxios.get.mockResolvedValue(mockUkCityDataSuccess);
    const cities: string[] = await server.getCityList('United Kingdom', 'England');
    expect(cities).toContain('Ashford');
  });
});