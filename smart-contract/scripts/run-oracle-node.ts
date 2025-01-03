import dotenv from 'dotenv';
const { runOracleNode } = require('./oracle-node');

dotenv.config();

async function main() {
    // Oracle contract address from deployment
    const ORACLE_ADDRESS = "0x4952bE6a8033519456197bdf5B5a8a6189621F17";
    
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