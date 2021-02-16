#!/bin/bash

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -o|--outputDir) outputDir="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

echo "  - Generating GraphQL Schema"
./node_modules/.bin/tsc codegen/build-schema.ts --esModuleInterop
node -r module-alias/register ./codegen/build-schema

echo "  - Generating client module"
./node_modules/.bin/tsc codegen/plugin.ts --esModuleInterop
./node_modules/.bin/gql-gen

echo "  - Copying outputs to $outputDir"
mkdir -p "$outputDir"
cp -R ./codegen/tmp/* "$outputDir"/
echo "  ✔ Copied outputs"

echo "  - Running yarn install & yarn build in $outputDir"
cd "$outputDir" && yarn install && yarn build
echo "  ✔ Completed"

cd -

echo "Go to the project you will be consuming the client APIs and run yarn install"
