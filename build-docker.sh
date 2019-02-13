#!/bin/bash

project=gennyteer


if [ -z "${1}" ]; then
   version="latest"
else
   version="${1}"
fi



  docker build  -t gennyproject/${project}:${version} .
