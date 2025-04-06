import { MongoClient } from 'mongodb';

async function checkMongoDB() {
  try {
    const uri = "mongodb+srv://mkbharvad8080:Mkb%408080@mk.jnchrec.mongodb.net/p2p_system";
    const client = new MongoClient(uri);
    
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected successfully to MongoDB");
    
    const db = client.db("p2p_system");
    
    // Check users collection
    console.log("\nUsers Collection:");
    const users = await db.collection('users').find({}).toArray();
    console.log(users);
    
    // Check portfolios collection
    console.log("\nPortfolios Collection:");
    const portfolios = await db.collection('portfolios').find({}).toArray();
    console.log(portfolios);
    
    // Check investments collection
    console.log("\nInvestments Collection:");
    const investments = await db.collection('investments').find({}).toArray();
    console.log(investments);
    
    // Check transactions collection
    console.log("\nTransactions Collection:");
    const transactions = await db.collection('transactions').find({}).toArray();
    console.log(transactions);
    
    await client.close();
    console.log("\nMongoDB connection closed");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

checkMongoDB();