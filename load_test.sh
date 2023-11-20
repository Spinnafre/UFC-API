#!/usr/bin/env bash

timestamp=$(date +%s)
filename="output-${timestamp}.json"
dir=$(dirname $0) # directory of the shell script
reportsFolder="${dir}/tests/load/reports"
reportsHistoryFolder="${reportsFolder}/history"
date=$(date +%d/%m/%Y\ %T)

source .env

function logger() {
    echo "$$ :: $1 [${date}]: $2"
}

logger "INFO" "Starting script $0"

if [[ ! -n $PORT ]]; then
    logger "ERROR" "Server port is not found!"
    exit 1
fi

logger "INFO" "checking if server is running in port $PORT..."

serverIsListening=$(ss -tulwn | grep ":${PORT}" &>/dev/null && echo true || echo false)

if ! $serverIsListening; then
    logger ERROR "Server is not running!"
    exit 1
fi

logger "INFO" "Server listening in port ${PORT}"

logger "INFO" "starting load test..."

if npm run load-test:local -- --output "${reportsHistoryFolder}/${filename}" 1>/dev/null; then
    logger "SUCCESS" "Documentation ${filename} generated successfully in ${reportsHistoryFolder}"
else
    logger "ERROR" "Error in create documentation in ${reportsHistoryFolder}"
    exit 1
fi

files=$(find $reportsFolder -type f -name "*.html")

logger "INFO" "Removing files ${files}"

echo $files | xargs -I file -n 1 rm file &>/dev/null

logger "INFO" "Old reports files removed successfully "

logger "INFO" "Creating report HTML file..."

reportFile="report.html"

if npx artillery report "${reportsHistoryFolder}/${filename}" --output "${reportsFolder}/${reportFile}" &>/dev/null; then
    logger "SUCCESS" "Report $reportFile created successfully in directory $reportsFolder"
    exit 0
else
    logger "ERROR" "Error in create report $reportFile in directory $reportsFolder"
    exit 1
fi
