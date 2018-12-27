#!/bin/bash
if [ -z "${1}" ]; then
   version="latest"
else
   version="${1}"
fi

docker push gennyproject/gennyteer:"${version}"
docker tag gennyproject/gennyteer:"${version}" gennyproject/gennyteer:latest
docker push gennyproject/gennyteer:latest
