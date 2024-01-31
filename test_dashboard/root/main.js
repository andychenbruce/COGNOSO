import init from "./wasm/frontend_wasm.js";
import {wasm_setup_stuff} from "./wasm/frontend_wasm.js";

init().then(() => {
    wasm_setup_stuff()
})
