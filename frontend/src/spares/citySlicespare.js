

// citySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = `http://localhost:5000`;
//const baseUrl = `https://bookingapp-r0fo.onrender.com`;
console.log("API Base URL:", baseUrl);
const initialState = {
  cities: [
    {
      city: "Mumbai",
      addresses: [
        {
          country: "India",
          state: "Maharashtra",
          district: "Mumbai Suburban",
          area: "Bandra",
        },
        {
          country: "India",
          state: "Maharashtra",
          district: "Mumbai Suburban",
          area: "Kurla",
        },
        {
          country: "India",
          state: "Maharashtra",
          district: "Mumbai Suburban",
          area: "Andheri",
        }
      ]
    },
    {
      city: "Delhi",
      addresses: [
        {
          country: "India",
          state: "Delhi",
          district: "New Delhi",
          area: "Connaught Place",
        },
        {
          country: "India",
          state: "Delhi",
          district: "South Delhi",
          area: "Hauz Khas",
        },
        {
          country: "India",
          state: "Delhi",
          district: "North Delhi",
          area: "Karol Bagh",
        }
      ]
    },
    {
      city: "Bengaluru",
      addresses: [
        {
          country: "India",
          state: "Karnataka",
          district: "Bengaluru Urban",
          area: "Whitefield",
        },
        {
          country: "India",
          state: "Karnataka",
          district: "Bengaluru Urban",
          area: "Koramangala",
        },
        {
          country: "India",
          state: "Karnataka",
          district: "Bengaluru Urban",
          area: "Indiranagar",
        }
      ]
    },
    {
      city: "Chennai",
      addresses: [
        {
          country: "India",
          state: "Tamil Nadu",
          district: "Chennai",
          area: "T. Nagar",
        },
        {
          country: "India",
          state: "Tamil Nadu",
          district: "Chennai",
          area: "Adyar",
        },
        {
          country: "India",
          state: "Tamil Nadu",
          district: "Chennai",
          area: "Velachery",
        }
      ]
    },
    {
      city: "Hyderabad",
      addresses: [
        {
          country: "India",
          state: "Telangana",
          district: "Hyderabad",
          area: "Banjara Hills",
        },
        {
          country: "India",
          state: "Telangana",
          district: "Hyderabad",
          area: "Jubilee Hills",
        },
        {
          country: "India",
          state: "Telangana",
          district: "Hyderabad",
          area: "Gachibowli",
        }
      ]
    },
    {
      city: "Kolkata",
      addresses: [
        {
          country: "India",
          state: "West Bengal",
          district: "Kolkata",
          area: "Park Street",
        },
        {
          country: "India",
          state: "West Bengal",
          district: "Kolkata",
          area: "Salt Lake",
        },
        {
          country: "India",
          state: "West Bengal",
          district: "Kolkata",
          area: "Howrah",
        }
      ]
    },
    {
      city: "Pune",
      addresses: [
        {
          country: "India",
          state: "Maharashtra",
          district: "Pune",
          area: "Kothrud",
        },
        {
          country: "India",
          state: "Maharashtra",
          district: "Pune",
          area: "Viman Nagar",
        },
        {
          country: "India",
          state: "Maharashtra",
          district: "Pune",
          area: "Hinjewadi",
        }
      ]
    },
    // Add more cities as needed
  ],
  selectedCity: '',
  selectedArea: '',
  filteredPlaygrounds: [],
  searchQuery: '',
  loading: false, // Add loading state
  error: null,    // Add error state
};

export const fetchPlaygrounds = createAsyncThunk(
  'city/fetchPlaygrounds',
  async (location, thunkAPI) => {
    const response = await fetch(`${baseUrl}/api/ground?location=${location}`);
  console.log(response, 'showgroundsapi');
    if (!response.ok) {
      throw new Error('Failed to fetch playgrounds');
    }
    const data = await response.json();
    return data;
  }
);


const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    selectCity: (state, action) => {
      state.selectedCity = action.payload;
      state.selectedArea = ''; // Reset area selection
      state.searchQuery = '';
      state.filteredPlaygrounds = []; // Clear playgrounds to refresh
    },
    selectArea: (state, action) => {
      state.selectedArea = action.payload;
      const cityData = state.cities.find(city => city.city === state.selectedCity);
      if (cityData) {
        const selectedAddresses = cityData.addresses.filter(addr => addr.area === state.selectedArea);
        state.filteredPlaygrounds = selectedAddresses.flatMap(addr => addr.playgrounds);
      } else {
        state.filteredPlaygrounds = [];
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      const cityData = state.cities.find(city => city.city === state.selectedCity);
      if (cityData) {
        const allPlaygrounds = cityData.addresses.flatMap(addr => addr.playgrounds);
        state.filteredPlaygrounds = allPlaygrounds.filter(pg =>
          pg.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      } else {
        state.filteredPlaygrounds = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaygrounds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaygrounds.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredPlaygrounds = action.payload;
      })
      .addCase(fetchPlaygrounds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { selectCity, selectArea, setSearchQuery } = citySlice.actions;
export default citySlice.reducer;
