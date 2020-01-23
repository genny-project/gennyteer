#!/bin/bash

project=gennyteer


if [ -z "${1}" ]; then
   version="latest"
else
   version="${1}"
fi



docker build --no-cache  -t gennyproject/${project}:${version} .
