import TEST_SERVER_INFO from '../sample/serverInfo.json' assert { type: "json" };
import TEST_SERVICE_URLS from '../sample/serviceUrls.json' assert { type: "json" };

import fetch from 'node-fetch';
import fs from 'fs';
import { join, resolve, dirname } from 'path'; 
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appConfig = {
    useTestServiceUrlsData: false,
    enableWriteFile: true,
}

const Directory = {
    DATA: 'data',
    SERVER_INFO:'serverInfo'
}

const getDataDir = () => resolve(__dirname, '..', Directory.DATA)
const getServerInfoDir = () => join(getDataDir(), Directory.SERVER_INFO);

const writeServiceUrls = (data) => { 
    const writeDir = join(getDataDir(), 'serviceUrls.json')
    console.debug('Saving copy of serviceUrls response:', writeDir)
    if(appConfig.enableWriteFile) {
        // Do Real Write
        fs.writeFileSync(writeDir, JSON.stringify(data, null, 2))
    } 
}

async function fetchServiceUrls () {
    if(appConfig.useTestServiceUrlsData) {
        console.warn('`useTestData` is set to `true`!')
        return [TEST_SERVICE_URLS, undefined]
    }
    return fetch("https://pcs.geforcenow.com/v1/serviceUrls").then(async (res)=> [await res.json(), undefined]).catch((err) => [undefined, err])
}

(async () => {
    
    const [serviceUrls, err] = await fetchServiceUrls();

    writeServiceUrls(serviceUrls);

    if(err) {
        throw new Error(err);
    }


    let strScript = [];

    strScript.push('#!/bin/bash') 
    if(serviceUrls.gfnServiceInfo) { 

        for (const serviceEnpoint of serviceUrls.gfnServiceInfo.gfnServiceEndpoints) {
            const serverInfoUrl = serviceEnpoint.streamingServiceUrl + 'v2/serverInfo';

            // Use unix path separator because we are generating a bash script
            const serverInfoFilename = './' + Directory.SERVER_INFO + '/' +serviceEnpoint.loginProviderCode + '_serverInfo_' + '.json'
            
            const curlCmdStr = cURLSaveJSONResponse(serverInfoUrl, serverInfoFilename)
            const logFailCmdStr = '|| echo "{ \\\"status\\\": \\\"failed\\\"}" > ' + serverInfoFilename + ''
            strScript.push(curlCmdStr + ' ' + logFailCmdStr);
            
            console.debug(`\tProvider: ${serviceEnpoint.loginProvider}(${serviceEnpoint.loginProviderDisplayName})`)
        }
        
        if(!fs.existsSync(getServerInfoDir())) {
            fs.mkdirSync(getServerInfoDir(), {
                recursive: true
            })
        }

        fs.writeFileSync(join(getDataDir(), 'pull-server-info.sh'), strScript.join('\n'))
        console.debug('created script to save serverInfo response', join(getDataDir(), 'pull-server-info.sh'))
    } 

})()

function cURLSaveJSONResponse(url, filename) {
    const str = [];

    str.push('curl -H "Accept: application/json+v3"')
    str.push(url) 
    str.push(`-o ${filename}`)

    return str.join(' ')
}