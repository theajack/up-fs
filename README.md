<!--
 * @Author: chenzhongsheng
 * @Date: 2023-02-13 17:02:26
 * @Description: Coding something
-->
# [Up-fs](https://github.com/theajack/up-fs)

## This makes it easier to use the node-fs module

### Feature

1. All directories that don't exist are taken into account
2. You can delete entire folders and all subfiles
3. Copy the entire catalog and its contents
4. Set the base directory for the reference
5. Deeply traverse the folder
6. Other convenient APIs

### Install & Use

```
npm i up-fs
```

```js
const fs = require('up-fs');
```

declaration

```ts
declare class UpFS {
    setDir(dir: string): void;
    rename(filePath: string, newName: string): void;
    resolve(filepath: string): string;
    exist(dirPath: string): boolean;
    clearDir(dirPath: string, removeSelf?: boolean): void;
    removeDir(dirPath: string): void;
    removeFile(filePath: string): void;
    createDir(dirPath: string): void;
    createFile(filePath: string): void;
    ensureDir(dirPath: string): void;
    copyFile({ src, target, handler }: {
        src: string;
        target: string;
        handler?: (content: string) => string;
    }): void;
    handleJson<Json extends IJson = IJson>(content: string, handler: (data: Json) => IJson): string;
    copyDir({ src, target, filter, handler }: {
        src: string;
        target: string;
        filter?: ((name: string) => boolean);
        handler?: (content: string) => string;
    }): void;
    readFile(filePath: string): string;
    writeFile(filePath: string, content: string): void;
    readDir(dirPath: string): string[];
    traverseDir(dirPath: string, callback: (filepath: string, isDir: boolean) => void, dirFirst?: boolean): void;
}
```
