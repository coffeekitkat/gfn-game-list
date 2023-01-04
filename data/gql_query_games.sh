#!/bin/bash

NV_CLIENT_VERSION=2.0.47.125
GFN_vpcId="*"
GFN_vpcId2=""
GFN_lang=en_US
QUERY=$(cat ./graphql/apps.graphql | tr -d '\n')

QUERY=${QUERY/\$lang/\"$GFN_lang\"}
QUERY=${QUERY/\$vpcId/\"$GFN_vpcId\"}

echo $QUERY
# games.geforce.com
curl -G -v "https://games.geforce.com/graphql" \
  --data-urlencode 'requestType=apps' \
  --data-urlencode "query=$QUERY" \
  -H 'sec-ch-ua: "Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"' \
  -H 'NV-Device-OS: WINDOWS' \
  -H 'NV-Browser-Type: CHROME' \
  -H 'NV-Client-Type: BROWSER' \
  -H 'NV-Client-Streamer: WEBRTC' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36' \
  -H 'Content-Type: application/graphql' \
  -H 'Accept: application/json, text/plain, */*' \
  -H 'NV-Device-Type: DESKTOP' \
  -H 'Referer;' \
  -H "NV-Client-Version: $NV_CLIENT_VERSION" \
  -o "./games/"$GFN_vpcId2"_games_.json"
