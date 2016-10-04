#!/usr/bin/env node

"use strict";

const commander = require('commander');
const Promise = require('bluebird');
const kv = require('consul-kv-object');
const consul = require('consul');
const pkg = require('../package.json');
const fs = Promise.promisifyAll(require('fs'));

function getKv(options) {
    var consulOptions = {
        host:options.host,
        port:options.port,
        secure:options.secure
    }
    
    return Promise.promisifyAll(
        kv( consul(consulOptions).kv, { mapTypes: options.typeMapping } )
        );
}

commander
    .version(pkg.version)
    .description(pkg.description);

commander
    .command('backup [file]')
    .description('backup consul keystore from specified key to JSON file')

    .option('-k, --key <key>', 'specify key to backup from')
    .option('-p, --preety-print', 'preety-print JSON')
    .option('--type-mapping', 'perform type-mapping of kv structure based on consul-kv-object flagmapping')
    .option('--host <host>', 'consul host to use, defaults to 127.0.0.1')
    .option('--port <port>', 'consul port to use, defaults to 8500')
    .option('--secure', 'use HTTPS to connect to consul')
    .action(function (file, options) {
        getKv(options).getAsync(options.key || "").then(function (backup) {
            var string = JSON.stringify(backup, null, options.preetyPrint ? 4 : 0);
            fs.writeFileSync(file, string);
        })
            .catch(err => {
                console.log(err.message)
                process.exit(1);      
            }  );
    });

commander
    .command('restore [file]')
    .description('restore JSON dump of consul to specified key. Defaults to restoring to root of keystore')
    .option('-k, --key <key>', 'specify key to backup to')
    .option('-d, --delete', 'delete consul kv under specified key before restoring')
    .option('--type-mapping', 'perform type-mapping of kv structure based on consul-kv-object flagmapping')
    .option('--host <host>', 'consul host to use, defaults to 127.0.0.1')
    .option('--port <port>', 'consul port to use, defaults to 8500')
    .option('--secure', 'use HTTPS to connect to consul').action(function (file, options) {
        var key = options.key || "";
        var kv = getKv(options); 
        var exec = [
            fs.readFileAsync(file, 'utf-8').then(JSON.parse)
        ];
        if (options.delete) {
            exec.push(kv.delAsync(key))
        }
        Promise.all(exec).spread(function (data) {
            return kv.setAsync(key, data);
        })
            .catch(err => {
                console.log(err.message);
                process.exit(1);      
        });
    });

commander
    .parse(process.argv);
    