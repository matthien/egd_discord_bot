const { token } = require('./sheets_config.json');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(token);

async function insert(discordID, first_name, last_name, email, affiliation, sheetNum) {
    await doc.useServiceAccountAuth(require('./credentials.json'));
    await doc.loadInfo();
    const mainSheet = doc.sheetsByIndex[0];
    await mainSheet.addRow({ discordID: discordID, first_name: first_name, last_name: last_name, email: email, affiliation: affiliation });
    
    if(sheetNum != 0) { 
        const subSheet = doc.sheetsByIndex[sheetNum];
        await subSheet.addRow({ discordID: discordID, first_name: first_name, last_name: last_name, email: email, affiliation: affiliation });
    }
}

async function checkReturningUser(discordID) { 
    await doc.useServiceAccountAuth(require('./credentials.json'));
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows(); // can pass in { limit, offset }

    for (row of rows) {
        if (row.discordID == discordID) { 
            //console.log('google sheets true');
            return true;
        }
    }
    //console.log('google sheets not true');
    return false;

}


exports.checkReturningUser = checkReturningUser;
exports.insert = insert;