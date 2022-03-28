"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const { getAll, getSingle, post, put, del } = (0, controller_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield getAll(req, res); }));
app.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield getSingle(req, res); }));
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield post(req, res); }));
app.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield put(req, res); }));
app.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield del(req, res); }));
exports.default = app;
