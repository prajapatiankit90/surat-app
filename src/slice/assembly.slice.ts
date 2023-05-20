import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosApi from '../axiosApi'



export const getAssembly = createAsyncThunk('getAssembly', async () => {
  const Name = localStorage.getItem('loginas')
  const Num = localStorage.getItem('loginUserMblNo')
  const response = await axiosApi.get("/getAdminsAssemblyList?pLoginAs=" + Name + "&voterId=" + Num + "&pwd=" + Num)
  const Data = JSON.parse(response.data)
  if (Data.error === false) {
    return JSON.parse(Data.data);
  } else {
    return Data.msg
  }
})

export const assemblySlice = createSlice({
  name: 'assembly',
  initialState: {
    assemblyList: <any>[],
    loading: 'idle',
    error: <any>null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getAssembly.pending, (state: any, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending'
      }
    })
    builder.addCase(getAssembly.fulfilled, (state: any, action) => {
      if (state.loading === 'pending') {
        state.assemblyList = action.payload
        state.loading = 'idle'
      }
    })
    builder.addCase(getAssembly.rejected, (state: any, action) => {
      if (state.loading === 'pending') {
        state.loading = 'idle'
        state.error = 'Error occured'
      }
    })
  },
})


export default assemblySlice.reducer