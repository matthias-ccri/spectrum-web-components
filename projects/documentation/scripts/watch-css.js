#!/usr/bin/env node

/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function copy(source) {
    const indexJSDir = path.resolve(
        __dirname,
        '..',
        '_site',
        'src',
        'index.js'
    );
    const sourceFile = fs.readFileSync(source);
    const destinationPath = source.replace('src', '_site/src');
    if (
        fs.existsSync(path.resolve(__dirname, '..', '_site')) &&
        fs.existsSync(path.resolve(__dirname, '..', '_site', 'src')) &&
        fs.existsSync(indexJSDir)
    ) {
        const indexJSSource = fs.readFileSync(indexJSDir);
        fs.writeFileSync(destinationPath, sourceFile);
        fs.writeFileSync(indexJSDir, indexJSSource);
    }
}

// One-liner for current directory
chokidar.watch('src/**/*.css').on('change', copy).on('add', copy);

console.log('Listening to CSS...');
