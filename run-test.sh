xvfb-run --server-args="-screen 0 2880x1800x24" npm run start-xvfb
echo "${GENNY_URL},$?" >> /tmp/test-result/result.txt
echo "${GENNY_URL} finish test"
