"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT || 3000;
// // Start the Express server
app_1.default.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map