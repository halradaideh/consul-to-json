#!/usr/bin/env node

"use strict";

const commander = require('commander');
const Promise = require('bluebird');
const kv = require('consul-kv-object');
const consul = require('consul');
const pkg = require('../package.json');
const fs = Promise.promisifyAll(require('fs'));

function getKv() {
    var opts = {};
    return Promise.promisifyAll(
        kv(
            consul(opts).kv
            )
        );
}

commander
    .version(pkg.vrsion)
    .description(pkg.description);

commander
    .command('backup [file]')
    .description('backup consul keystory from specified key to JSON file')
    .option('-k, --key <key>', 'specify key to backup from')
    .option('-p, --preety-print', 'preety-print JSON')
    .action(function (file, options) {
        getKv().getAsync(options.key || "").then(function (backup) {
            var string = JSON.stringify(backup, null, options.preetyPrint ? 4 : 0);
            fs.writeFileSync(file, string);
        });
    });

commander
    .command('restore [file]')
    .description('restore JSON dump of consul to specified key. Defaults to restoring to root of keystore')
    .option('-k, --key <key>', 'specify key to backup to')
    .option('-d, --delete', 'delete consul kv under specified key')
    .action(function (file, options) {
        var key = options.key || "";
        var exec = [fs.readFileAsync(file, 'utf-8').then(JSON.parse)];
        if (options.delete) {
            exec.push(kv.delAsync(key))
        }
        Promise.all(exec).spread(function (data) {
            return getKv().setAsync(key, data);
        })
        .catch(err => console.log(err.message));
    });

commander
    .parse(process.argv);
    