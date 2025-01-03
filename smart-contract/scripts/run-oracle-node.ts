import dotenv from 'dotenv';
const { runOracleNode } = require('./oracle-node');

dotenv.config();

async function main() {
    // Oracle contract address from deployment
    const ORACLE_ADDRESS = "0x0643D39D47CF0ea95Dbea69Bf11a7F8C4Bc34968";
    
    if (!ORACLE_ADDRESS) {
        throw new Error('Please set ORACLE_ADDRESS in your .env file');
    }

    try {
        console.log('Starting oracle node...');
        console.log('Listening for requests on contract:', ORACLE_ADDRESS);
        
        await runOracleNode(ORACLE_ADDRESS);
        
        // Keep the process running
        process.stdin.resume();
    } catch (error) {
        console.error('Error running oracle node:', error);
        process.exit(1);
    }
}

main();