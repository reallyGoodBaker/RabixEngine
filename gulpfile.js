const { src, dest, series, task } = require('gulp')
const typescript = require('gulp-typescript')
const { rm } = require('multithread-del')
const path = require('path')
const fs = require('fs')
const child = require('child_process')
const express = require('express')

function tsconfig() {
    const str = fs
        .readFileSync('./tsconfig.json')
        .toString()
        .replace(/\/\/.*\s/g, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
    
    return JSON.parse(str).compilerOptions
}

function clean(cb) {
    if (fs.existsSync('dist/')) {
        return rm(path.join(__dirname, './dist'), {})
    }

    cb()
}

function build() {
    return src('src/**/*.ts')
        .pipe(typescript(tsconfig()))
        .pipe(dest('dist/'))
}

function syncFiles() {
    return src('src/**/*.*', '!src/**/*.ts')
        .pipe(dest('dist/'))
}

const templateFolder = path.join(__dirname, './src/test/template')

function test() {
    const args = process.argv.slice(3)
        .filter(arg => arg.startsWith('--'))
        .map(arg => arg.slice(2))

    args.forEach(arg => buildTest(arg))

    const port = Math.floor(Math.random() * 10000 + 10000)
    express()
        .use(express.static('./dist'))
        .listen(port, () => {
            args.forEach(arg => child.exec(`start http://localhost:${port}/test/${arg}`))
        })
}

function buildTest(folderName) {
    const confStr = process.argv[4]
    const testFolder = path.join('./dist/test', folderName)
    const testFolderSrc = path.join('./src/test', folderName)

    let conf = {
        title: folderName,
        html: '',
    }

    if (confStr && confStr.startsWith('conf=')) {
        Object.assign(conf, JSON.parse(confStr.slice(5)))
    }

    const varsFolder = path.join(testFolderSrc, 'vars')
    if (fs.existsSync(varsFolder) && fs.statSync(varsFolder).isDirectory()) {
        const argMatcher = /\[(?<name>.*)\]/
        fs.readdirSync(varsFolder).forEach(file => {
            let result
            if (result = argMatcher.exec(file)) {
                conf[result.groups.name] = fs.readFileSync(path.join(varsFolder, file)).toString()
            }
        })
    }

    const html = fs.readFileSync(path.join(templateFolder, 'index.html'))
        .toString()
        .replace(/\[\% (.*) \%\]/g, (raw, $1) => raw.replace(`[% ${$1} %]`, conf[$1]))

    const targetHtml = path.join(testFolder, 'index.html')
    fs.writeFileSync(targetHtml, html)
}

exports.build = series(clean, build, syncFiles)
exports.clean = clean
exports.test = series(clean, build, syncFiles, test)