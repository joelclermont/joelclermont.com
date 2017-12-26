#!/bin/bash

PROD="joelclermont.com"
TEST="test.joelclermont.com"

display_usage() {
    echo "You must specify which environment to run this script in."
    echo -e "\nUsage:\n$0"
    echo    "   prod"
    echo    "   test"
}

if [[ ( $# == "--help") ||  $# == "-h" ]]; then
    display_usage
    exit 0
fi

if [[ "$1" == "prod" ]]; then
    URL=$PROD
elif [[ "$1" == "test" ]]; then
    URL=$TEST
else
    display_usage
    exit 1
fi

hugo -b "http://$URL"
s3cmd sync -P --delete-removed ./public/ "s3://$URL/"