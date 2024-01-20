/*
 * @Author: chenzhongsheng
 * @Date: 2023-06-11 22:48:32
 * @Description: Coding something
 */
import { fs } from '../../src';
// fs.touch('test/a/b/c.js');
// fs.mkdir('test/a/c/e');

// fs.copyFile({
//     src: 'test/a/b/c.js',
//     target: 'test/x/n.js',
//     handler (data) {
//         return data + '11';
//     }
// });

fs.rename('test/a/b/c.js', 'x.json');