const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1xWGwNdCoDQMk1ZeBBCp-CoGN1FkKOMqs1_EznkoMPaA');

async function entryIdExists(id, sheet) {
    const rows = await sheet.getRows();
    for(row of rows) {
        if(row.id === id) {
            return true;
        }
    }
    return false;
}

async function insert(discordID, first_name, last_name, email, affiliation) {

    await doc.useServiceAccountAuth(require('./credentials.json'));
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const row = await sheet.addRow({ discordID: discordID, first_name: first_name, last_name: last_name, email: email, affiliation: affiliation });
}



exports.insert = insert;