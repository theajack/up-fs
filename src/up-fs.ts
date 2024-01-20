/*
 * @Author: chenzhongsheng
 * @Date: 2024-01-20 10:42:36
 * @Description: Coding something
 */
import fs from 'fs';
import { resolve } from 'path';
import { IJson } from './types';

export class UpFS {
    private _dir: string;
    fs = fs;
    constructor (dir?: string) {
        this._dir = dir || process.cwd();
    }

    setDir (dir: string) {
        this._dir = dir;
    }

    rename (filePath: string, newName: string) {
        if (!this.exist(filePath)) return;
        filePath = this.resolve(filePath);
        const newFilePath = filePath.substring(0, filePath.lastIndexOf('/') + 1) + newName;
        fs.renameSync(filePath, newFilePath);
    }

    resolve (filepath: string) {
        return resolve(this._dir, filepath);
    }

    exist (dirPath: string) {
        return fs.existsSync(this.resolve(dirPath));
    }

    clearDir (dirPath: string, removeSelf = false) {
        if (!this.exist(dirPath)) return;
        this.traverseDir(dirPath, (filePath, isDir) => {
            isDir ?
                fs.rmdirSync(filePath) :
                fs.unlinkSync(filePath);
        }, false);

        if (removeSelf) {
            fs.rmdirSync(this.resolve(dirPath));
        }
    }

    removeDir (dirPath: string) {
        this.clearDir(dirPath, true);
    }

    removeFile (filePath: string) {
        if (!this.exist(filePath)) return;
        fs.unlinkSync(filePath);
    }

    createDir (dirPath: string) {
        if (this.exist(dirPath)) return;
        this.ensureDir(dirPath);
        fs.mkdirSync(dirPath);
    }

    createFile (filePath: string) {
        if (this.exist(filePath)) return;
        this.ensureDir(filePath);
        fs.writeFileSync(filePath, '');
    }

    ensureDir (dirPath: string) {
        dirPath = this.resolve(dirPath);

        const dirs = dirPath.split('/');

        dirs.pop();

        const mklist: string[] = [];

        for (let i = dirs.length - 1; i >= 0; i--) {
            const dir = dirs.slice(0, i + 1).join('/');
            if (!fs.existsSync(dir)) {
                mklist.unshift(dir);
            } else {
                break;
            }
        }
        mklist.forEach(dir => {
            fs.mkdirSync(dir);
        });

    }

    copyFile ({
        src,
        target,
        handler
    }: {
        src: string,
        target: string,
        handler?: (content: string)=>string
    }) {
        if (!this.exist(src)) return;
        this.ensureDir(target);
        if (!handler) {
            fs.copyFileSync(src, target);
        } else {
            const result = this._handlerFile(src, handler);
            this.writeFile(target, result);
        }
    }

    private _handlerFile (
        filePath: string,
        handler: (content: string)=>string
    ): string {
        const content = this.readFile(filePath);
        const result = handler(content);
        return result;
    }

    handleJson<Json extends IJson = IJson> (
        content: string,
        handler: (data: Json) => IJson
    ): string {
        const json = JSON.parse(content);
        const result = handler(json);
        return JSON.stringify(result);
    }

    copyDir ({
        src,
        target,
        filter = (() => true),
        handler
    }:{
        src: string,
        target: string,
        filter?: ((name: string)=>boolean),
        handler?: (content: string)=>string
    }) {
        this.createDir(target);
        this.traverseDir(src, (filePath, isDir) => {
            // console.log(filePath, isDir)
            const targetFilePath = filePath.replace(src, target);
            if (isDir) {
                exports.mkdir(targetFilePath);
            } else {
                if (filter(filePath)) {
                    if (handler) {
                        this.writeFile(filePath, this._handlerFile(filePath, handler));
                    } else {
                        fs.copyFileSync(filePath, targetFilePath);
                    }
                }
            }
        });
    }

    readFile (filePath: string) {
        if (!this.exist(filePath)) return '';
        return fs.readFileSync(this.resolve(filePath), 'utf8');
    }

    writeFile (filePath: string, content: string) {
        this.ensureDir(filePath);
        return fs.writeFileSync(this.resolve(filePath), content, 'utf8');
    }

    readDir (dirPath: string) {
        if (!this.exist(dirPath)) return [];
        return fs.readdirSync(this.resolve(dirPath));
    }

    traverseDir (
        dirPath: string,
        callback: (filepath: string, isDir: boolean) => void,
        dirFirst: boolean = true
    ) {
        this.traverseDirBase(dirPath, callback, dirFirst);
    }

    private traverseDirBase (
        dirPath: string,
        callback: (filepath: string, isDir: boolean) => void,
        dirFirst: boolean = true
    ) {
        dirPath = this.resolve(dirPath);
        if (!fs.existsSync(dirPath)) return;
        const files = fs.readdirSync(dirPath);
        files.forEach((file) => {
            const filePath = `${dirPath}/${file}`;
            const stat = fs.statSync(filePath);
            console.log(dirFirst);
            if (stat.isDirectory()) {
                if (dirFirst) callback(filePath, true);
                this.traverseDirBase(filePath, callback, dirFirst);
                if (!dirFirst) callback(filePath, true);
            } else {
                callback(filePath, false);
            }
        });
    }
}