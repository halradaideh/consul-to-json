# consul-to-json

[![Build Status](https://travis-ci.org/halradaideh/consul-to-json.svg?branch=master)](https://travis-ci.org/lekoder/consul-to-json)

Consul KV-store backup and restore utility.

Consul version 1.0.2

[![NPM](https://nodei.co/npm/consul-to-json.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/consul-to-json/)

## Instalation
```bash
npm install -g consul-to-json
```

## Usage


```
  Usage: consul-to-json [options] [command]

  Commands:

    backup [options] [file]   backup consul keystore from specified key to JSON file
    restore [options] [file]  restore JSON dump of consul to specified key. Defaults to restoring to root of keystore
```

### Backup

```
  Usage: backup [options] [file]

  backup consul keystory from specified key to JSON file

  Options:

    -h, --help          output usage information
    -k, --key <key>     specify key to backup from
    -t, --token <key>   provide token for Conusl based ACL    
    -p, --preety-print  preety-print JSON
    --type-mapping      perform type-mapping of kv structure based on consul-kv-object flagmapping
    --host <host>       consul host to use, defaults to 127.0.0.1
    --port <port>       consul port to use, defaults to 8500
    --secure            use HTTPS to connect to consul
```

### Restore

```
  Usage: restore [options] [file]

  restore JSON dump of consul to specified key. Defaults to restoring to root of keystore

  Options:

    -h, --help       output usage information
    -k, --key <key>  specify key to backup to
    -t, --token <key>   provide token for Conusl based ACL
    -d, --delete     delete consul kv under specified key before restoring
    -t, --token <key>   provide token for Conusl based ACL
    --type-mapping   perform type-mapping of kv structure based on consul-kv-object flagmapping
    --host <host>    consul host to use, defaults to 127.0.0.1
    --port <port>    consul port to use, defaults to 8500
    --secure         use HTTPS to connect to consul
```

