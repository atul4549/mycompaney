import mongoose from "mongoose";

/**
 * MongoDB database manager/connector using module pattern
 */

// Private state stored in closure
let connection = null;

// Event handlers as array functions
const handleConnectionError = (err) => {
    console.error("MongoDB connection error", err);
};

const handleDisconnected = () => {
    console.error("MongoDB Disconnected");
};

/**
 * Connect to MongoDB
 * @returns {Promise<mongoose.Connection>}
 */
const connect = async () => {
    try {
        if (connection) {
            console.log("Mongodb already connected");
            return connection;
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "HimanshuTestDB"
        });

        connection = mongoose.connection;

        console.log(`MongoDB connected: ${process.env.MONGODB_URI}`);

        connection.on("error", handleConnectionError);
        connection.on("disconnected", handleDisconnected);

        return connection;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
};

/**
 * Disconnect the active mongodb connection
 */
const disconnect = async () => {
    try {
        if (connection) {
            await mongoose.disconnect();
            connection = null;
            console.log("Mongodb disconnected!");
        }
    } catch (error) {
        console.error('Failed to disconnect from MongoDB:', error);
        throw error;
    }
};

/**
 * Get the active connection
 * @returns {mongoose.Connection}
 */
const getConnection = () => connection;

// Export the public API as an object with array functions
export default {
    connect,
    disconnect,
    getConnection
};