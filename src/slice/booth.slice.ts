import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosApi from '../axiosApi'



export const getBooth = createAsyncThunk('getBooth', async (paData: any, thunkAPI) => {
    const { acNo, wardNo, ShaktiId, village, flag } = paData
    // async(acNo: any, wardNo: any, ShaktiId: any, village: any, flag: any, thunkAPI) => {
    const Name = localStorage.getItem('loginas')
    const Num = localStorage.getItem('loginUserMblNo')
    const response = await axiosApi.get("GetVillageBoothListByUserLoginLevel?pUserLevel=" + Name +
        "&pUserMblNo=" + Num +
        "&pAcNo=" + acNo +
        "&pWardMasNo=" + wardNo +
        "&pShkMasId=" + ShaktiId +
        "&pVlgNm=" + village +
        "&pFlag=" + flag
    )
    const Resp = JSON.parse(response.data);
    if (Resp.error === false) {
        const Data = JSON.parse(Resp.data);
        return Data;
    } else {
        return false
    }

})



export const boothSlice = createSlice({
    name: 'booth',
    initialState: {
        boothList: <any>[],
        loading: 'idle',
        error: <any>null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getBooth.pending, (state: any, action) => {
            if (state.loading === 'idle') {
                state.loading = 'pending'
            }
        })
        builder.addCase(getBooth.fulfilled, (state: any, action) => {
            if (state.loading === 'pending') {
                state.boothList = action.payload
                state.loading = 'idle'
            }
        })
        builder.addCase(getBooth.rejected, (state: any, action) => {
            if (state.loading === 'pending') {
                state.loading = 'idle'
                state.error = 'Error occured'
            }
        })
    },
})


export default boothSlice.reducer