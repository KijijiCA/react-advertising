#!/usr/bin/env bash

# This script fixes incorrect npm registry paths in the package-lock files
# that are set for unknown reasons every time you do an npm install
#
# Correct path:
# https://nexus.es.ecg.tools/repository/npm-all
#
# Incorrect paths:
# https://nexus.corp.mobile.de/repository/npm-all
# https://nexus.corp.mobile.de/nexus/repository/npm-all
# https://registry.npmjs.org

declare -a FILES_TO_FIX=(
    "package-lock.json"
)

declare -a INCORRECT_PATHS=(
    "https:\/\/nexus\.corp\.mobile\.de\/repository\/npm-all"
    "https:\/\/nexus\.corp\.mobile\.de\/nexus\/repository\/npm-all"
    "https:\/\/nexus.es.ecg.tools\/repository\/npm-all"
)

for CURRENT_FILE in "${FILES_TO_FIX[@]}"
do
    echo "Fixing ${CURRENT_FILE}"
    for SEARCH_EXP in "${INCORRECT_PATHS[@]}"
    do
        sed -i.bak -e "s/${SEARCH_EXP}/https:\/\/registry\.npmjs\.org/g" ${CURRENT_FILE}
    done
    rm ${CURRENT_FILE}.bak
done

