#!/usr/bin/env bash

./build.sh
docker build -t gennyproject/gennyteer .
