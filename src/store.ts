import { configureStore } from "@reduxjs/toolkit";
import assemblyReducer from "./slice/assembly.slice";
import wardReducer from "./slice/ward.slice";
import boothReducer from "./slice/booth.slice";
import shaktiKendraReducer  from "./slice/shaktikendra.slice";

const reducer  = {
   assembly : assemblyReducer,
   ward : wardReducer,
   booth: boothReducer,
   shaktikendra : shaktiKendraReducer
}
const store = configureStore({
    reducer: reducer,
    devTools: true,
  })
  
  export default store;