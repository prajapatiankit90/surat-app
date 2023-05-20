import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosApi from '../axiosApi'



export const getWard = createAsyncThunk('getWard', async(acNo: any, thunkAPI) => {
  const Name = localStorage.getItem('loginas')
  const Num = localStorage.getItem('loginUserMblNo')
  const response = await axiosApi.get("/GetAssemblyWiseWardByUserLoginLevel?pUserLevel=" + Name + " &pUserMblNo=" + Num + "&pAcNo=" + acNo)
  const Resp = JSON.parse(response.data);
  const Data = JSON.parse(Resp.data);  
  return Data;
})



export const wardSlice = createSlice({
  name: 'ward',
  initialState: {
    wardList: <any>[]  ,
    loading: 'idle',
    error: <any>null,
  },
  reducers: {  
  },
  extraReducers: (builder) => {
    builder.addCase(getWard.pending, (state :any, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending'
      }
    })
    builder.addCase(getWard.fulfilled, (state :any, action) => {
      if (state.loading === 'pending') {
        state.wardList = action.payload
        state.loading = 'idle'
      }
    })
    builder.addCase(getWard.rejected, (state :any, action) => {
      if (state.loading === 'pending') {
        state.loading = 'idle'
        state.error = 'Error occured'
      }
    })
  },
})


export default wardSlice.reducer