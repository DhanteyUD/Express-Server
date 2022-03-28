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
const promises_1 = __importDefault(require("fs/promises"));
const controller = () => {
    const readFile = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield promises_1.default.readFile('./database.json', 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            if (error) {
                yield promises_1.default.writeFile('./database.json', JSON.stringify([]));
                const data = yield promises_1.default.readFile('./database.json', 'utf-8');
                return JSON.parse(data);
            }
        }
    });
    return {
        // Get all data
        getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let data = yield readFile();
                res.status(200).json({ data: data });
            }
            catch (error) {
                if (error)
                    return res.status(400).end('Bad Request');
            }
        }),
        // Get single data
        getSingle: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            if (!id) {
                return res.status(400).end('Bad Request');
            }
            const data = yield readFile();
            for (let item of data) {
                if (item.id === id) {
                    return res.status(200).json({ data: item });
                }
            }
            return res.status(404).end('Data with given id is not found');
        }),
        // Post new data
        post: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const data = req.body;
            if (Object.keys(data).length === 0) {
                return res.status(400).end('Bad Request');
            }
            const file = yield readFile();
            const lastItem = file.length;
            if (!file) {
                data.id = 1;
            }
            else {
                data.id = lastItem + 1;
            }
            data.createdAt = new Date();
            file.push(data);
            yield promises_1.default.writeFile('./database.json', JSON.stringify(file, null, 2));
            res.status(201).json({ data: data });
        }),
        // Update data
        put: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            const data = req.body;
            if (!id || !data)
                return res.status(400).end('Bad Request');
            data.updatedAt = new Date();
            const file = yield readFile();
            let newData;
            file.forEach((item) => {
                if (item.id === id) {
                    newData = Object.assign(Object.assign({}, item), data);
                }
            });
            if (!newData)
                return res.status(404).end('Data not found');
            file.push(newData);
            yield promises_1.default.writeFile('./database.json', JSON.stringify(file, null, 2));
            res.status(200).json({ data: newData });
        }),
        // Delete data
        del: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const id = parseInt(req.params.id);
            let data = yield readFile();
            if (!id || !data)
                return res.status(400).end('Bad Request');
            const unwanted = data.find((item) => item.id === id);
            if (!unwanted)
                return res.status(404).end('Data not found');
            data = data.filter((item) => item.id !== id);
            yield promises_1.default.writeFile('./database.json', JSON.stringify(data, null, 2));
            res.status(200).json({ data: unwanted[0] });
        }),
    };
};
exports.default = controller;
