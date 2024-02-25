"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_auth_1 = __importDefault(require("../routes/user/user_auth"));
const PORT = 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("hello world");
});
app.use("/user-auth", user_auth_1.default);
app.listen(PORT, () => {
    console.log(`Server is up and running on PORT: ${PORT}`);
});
