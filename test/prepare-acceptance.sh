#!/bin/bash

set -e

function log {
    echo -e "\033[0;32m*** $@\033[0m"
}

log "starting bootstrapped consul for testing"
consul agent -bootstrap -server -advertise=127.0.0.1 -data-dir=/tmp/ &
sleep 10

consul members

consul-to-json -V | egrep "^[0-9.]+$"  || required "outputs version"
consul-to-json --help |grep "Commands" || required "outputs general help"

log "preparing JSON files"

for test in test/acceptance/*.json
do
    log "preparing $test"
    consul-to-json restore -d -k test $test   
    consul-to-json backup -p -k test $test 
done

log "killing consul"
killall consul

sleep 1

