#!/bin/bash

fails=0
faillog=""
function required {
    ((fails++))
    echo
    echo -e "\e[31mFAILED\e[0m[${fails}] $1"
    echo 
    faillog="$faillog\n\e[31mFAILED\e[0m $1"
}

function log {
    echo -e "\033[0;32m*** $@\033[0m"
}

log "starting bootstrapped consul for testing"
consul agent -bootstrap -server -advertise=127.0.0.1 -data-dir=/tmp/ &
sleep 10

consul info | grep "Leader" || required "consul is up"

consul-to-json -V | egrep "^[0-9.]+$"  || required "outputs version"
consul-to-json --help |grep "Commands" || required "outputs general help"

log "running basic tests"

for test in test/acceptance/*.json
do
    log "testing $test RESTORE"
    consul-to-json restore -d -k test $test     || required "restore of json from $test"
    log "testing $test BACKUP"
    consul-to-json backup -p -k test /tmp/t     || required "does backup of $test"
    log "diff of $test"
    diff $test /tmp/t                                || required "backup and restore of $test match"
done

log "killing consul"
killall consul

sleep 1

if (( $fails > 0 )); then
    echo -e "\e[31mFAILED\e[0m [${fails}]:"
    echo
    echo -e $faillog
    exit 10
fi
