const api = require('./api');
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
    const countries: string[] = await api.getCountryList();
    expect(countries).toContain('Australia');
  });

  it('returns an array of at least one country', async () => {
    mockedAxios.get.mockResolvedValue(mockCountryDataSuccess);
    const countries: string[] = await api.getCountryList();
    expect(countries).toBeInstanceOf(Array);
    expect(countries.length).toBeGreaterThan(0);
  });

  it('returns another country', async () => {
    mockedAxios.get.mockResolvedValue(mockCountryDataSuccess);
    const countries: string[] = await api.getCountryList();
    expect(countries).toContain('Argentina');
  });

  it('throws error when response status is not success', async () => {
    mockedAxios.get.mockRejectedValue(mockCountryDataError);
    await expect(api.getCountryList()).rejects.toThrow('too_many_requests')
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
    const states: string[] = await api.getStateList('China');
    expect(states).toContain('Beijing');
  });

  it('returns an array of at least one state when passed a country', async () => {
    mockedAxios.get.mockResolvedValue(mockChinaStateDataSuccess);
    const states: string[] = await api.getStateList('China');
    expect(states).toBeInstanceOf(Array);
    expect(states.length).toBeGreaterThan(0);
  });

  it('returns another state when passed a country', async () => {
    mockedAxios.get.mockResolvedValue(mockChinaStateDataSuccess);
    const states: string[] = await api.getStateList('China');
    expect(states).toContain('Fujian');
  });

  it('throws error when input country not found', async () => {
    mockedAxios.get.mockRejectedValue(mockChinaStateDataNotFound);
    await expect(api.getStateList('Imagination Land')).rejects.toThrow('country not found "Imagination Land"')
  });

  it('throws error on other API error', async () => {
    mockedAxios.get.mockRejectedValue(mockChinaStateDataError);
    await expect(api.getStateList('China')).rejects.toThrow('incorrect_api_key')
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

  const mockUkCityDataNotFound : object = {
    "response": {
      "data": {
        "status": "fail",
        "data": {
          "message": "country_not_found"
        }
      }
    }
  }

  const mockUkCityDataError : object = {
    "response": {
      "data": {
        "status": "fail",
        "data": {
          "message": "incorrect_api_key"
        }
      }
    }
  }

  it('returns a list of cities when given a country and state.', async () => {
    mockedAxios.get.mockResolvedValue(mockUkCityDataSuccess);
    const cities: string[] = await api.getCityList('United Kingdom', 'England');
    expect(cities).toContain('Barnsbury');
  });

  it('returns an array of at least one city when passed a country and state', async () => {
    mockedAxios.get.mockResolvedValue(mockUkCityDataSuccess);
    const cities: string[] = await api.getCityList('United Kingdom', 'England');
    expect(cities).toBeInstanceOf(Array);
    expect(cities.length).toBeGreaterThan(0);
  });

  it('returns a different city.', async () => {
    mockedAxios.get.mockResolvedValue(mockUkCityDataSuccess);
    const cities: string[] = await api.getCityList('United Kingdom', 'England');
    expect(cities).toContain('Ashford');
  });

  it('throws error when input country and/or state not found', async () => {
    mockedAxios.get.mockRejectedValue(mockUkCityDataNotFound);
    await expect(api.getCityList('Imagination Land', 'Nowhere')).rejects.toThrow('country/state not found "Imagination Land"/"Nowhere"')
  });

  it('throws error on other API error', async () => {
    mockedAxios.get.mockRejectedValue(mockUkCityDataError);
    await expect(api.getStateList('China')).rejects.toThrow('incorrect_api_key')
  });
});

describe('getPollutionData', () => {
  const mockedPollutionData: object = {
    "data": {
      "status": "success",
      "data": {
        "city": "Los Angeles",
        "state": "California",
        "country": "USA",
        "current": {
          "pollution": {
            "ts": "2023-06-06T12:00:00.000Z",
            "aqius": 32
          }
        }
      }
    }
  }

  const otherMockedPollutionData: object = {
    "data": {
      "status": "success",
      "data": {
        "city": "Bristol",
        "state": "England",
        "country": "United Kingdom",
        "current": {
          "pollution": {
            "ts": "2023-06-06T12:00:00.000Z",
            "aqius": 20
          }
        }
      }
    }
  }

  const mockPollutionDataNotFound : object = {
    "response": {
      "data": {
        "status": "fail",
        "data": {
          "message": "country_not_found"
        }
      }
    }
  }

  const mockPollutionDataError : object = {
    "response": {
      "data": {
        "status": "fail",
        "data": {
          "message": "incorrect_api_key"
        }
      }
    }
  }

  type PollutionData = {
    city: string,
    state: string,
    country: string,
    last_updated: Date,
    air_quality_index: number
  }

  it('returns pollution data in correct format', async () => {
    mockedAxios.get.mockResolvedValue(mockedPollutionData);
    const pollutionData: PollutionData = await api.getPollutionData('USA', 'California', 'Los Angeles');
    const expected: PollutionData = {
      city: expect.any(String),
      state: expect.any(String),
      country: expect.any(String),
      last_updated: expect.any(Date),
      air_quality_index: expect.any(Number)
    }
    expect(pollutionData).toMatchObject<PollutionData>(expected);
  });

  it('returns the pollution data for a different city', async () => {
    mockedAxios.get.mockResolvedValue(otherMockedPollutionData);
    const pollutionData: PollutionData = await api.getPollutionData('United Kingdom', 'England', 'Bristol');
    const expected: PollutionData = {
      city: 'Bristol',
      state: 'England',
      country: 'United Kingdom',
      last_updated: expect.any(Date),
      air_quality_index: 20
    }
    expect(pollutionData).toMatchObject<PollutionData>(expected);
  });

  it('throws error when input country, state or city not found', async () => {
    mockedAxios.get.mockRejectedValue(mockPollutionDataNotFound);
    await expect(api.getPollutionData('Imagination Land', 'Nowhere', 'None')).rejects.toThrow('country/state/city not found "Imagination Land"/"Nowhere"/"None"');
  });

  it('throws error on other API error', async () => {
    mockedAxios.get.mockRejectedValue(mockPollutionDataError);
    await expect(api.getPollutionData('United Kingdom', 'England', 'Oxford')).rejects.toThrow('incorrect_api_key');
  });
});


