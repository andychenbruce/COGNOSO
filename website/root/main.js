import init from "./wasm/frontend_wasm.js";
import {set_panic_hook} from "./wasm/frontend_wasm.js";

init().then(() => {
    set_panic_hook()
})
