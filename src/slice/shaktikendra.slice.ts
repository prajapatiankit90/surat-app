import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosApi from '../axiosApi'

export const getShaktikendra = createAsyncThunk('getShaktikendra', async (paData: any, thunkAPI) => {
    const { acNo, wardNo } = paData
    // async(acNo: any, wardNo: any, ShaktiId: any, village: any, flag: any, thunkAPI) => {
    const Name = localStorage.getItem('loginas')
    const Num = localStorage.getItem('loginUserMblNo')
    const response = await axiosApi.get("GetShkListByUserLoginLevel?pUserLevel=" + Name +
        "&pUserMblNo=" + Num +
        "&pAcNo=" + acNo +
        "&pWardMasNo=" + wardNo
    )
    const Resp = JSON.parse(response.data);
    const Data = JSON.parse(Resp.data);
    console.log('Shakti', Data)
    return Data;
})

export const shaktiKendraSlice = createSlice({
    name: 'shaktikendra',
    initialState: {
        shaktikendraList: <any>[],
        loading: 'idle',
        error: <any>null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getShaktikendra.pending, (state: any, action) => {
            if (state.loading === 'idle') {
                state.loading = 'pending'
            }
        })
        builder.addCase(getShaktikendra.fulfilled, (state: any, action) => {
            if (state.loading === 'pending') {
                state.shaktikendraList = action.payload
                state.loading = 'idle'
            }
        })
        builder.addCase(getShaktikendra.rejected, (state: any, action) => {
            if (state.loading === 'pending') {
                state.loading = 'idle'
                state.error = 'Error occured'
            }
        })
    },
})


export default shaktiKendraSlice.reducer