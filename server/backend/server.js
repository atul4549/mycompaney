// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import connectDB from "./src/config/database.js";
// import authRoutes from "./src/routes/authRoutes.js";
// import { errorHandler, notFoundHandler } from "./src/middleware/errorHandler.js";
// import { submitName, getAllUsers, checkUsername, getProfile } from "./test.js";

// dotenv.config();

// const app = express();

// // Configuration
// const config = {
//   port: process.env.PORT || 3000,
//   host: process.env.HOST || "localhost",
//   node_env: process.env.NODE_ENV || "development",
//   https: process.env.HTTPS === "true" || false,
// };

// // Middleware
// app.use(helmet());
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "*",
//     credentials: true,
//   }),
// );
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// /**
//  * Request logging middleware
//  * Logs the HTTP method, path, IP address, and user agent for each incoming request.
//  */
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`, {
//     ip: req.ip,
//     userAgent: req.headers["user-agent"],
//   });
//   next();
// });

// /**
//  * Health check endpoint
//  */
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     status: "healthy",
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//   });
// });

// /**
//  * Root endpoint
//  * Provides basic information about the API service and available endpoints.
//  */
// app.get("/", (req, res) => {
//   return res.status(200).json({
//     service: "Himanshu Encrypted Chat App",
//     version: "1.0.0",
//     endpoints: {
//       health: "/health",
//       auth: "/api/auth",
//       submitName: "/api/submit-name",
//       getAllUsers: "/api/users",
//       checkUsername: "/api/check-username/:username",
//       getProfile: "/api/profile",
//     },
//   });
// });

// // Routes
// app.use("/api/auth", authRoutes);
// // app.use("/api/users", userRoutes);
// // app.use("/api/messages", messageRoutes);

// app.post("/api/submit-name", submitName);
// app.get("/api/users", getAllUsers);
// app.get("/api/check-username/:username", checkUsername);
// app.get("/api/profile", getProfile);

// // // Health check
// app.get("/api/health", (req, res) => {
//   res.status(200).json({ status: "OK", message: "Server is running" });
// });

// /**
//  * 404 Handler
//  */
// app.use((req, res) => {
//   return res.status(404).json({
//     success: false,
//     message: "Endpoint not found",
//     statusCode: 404,
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("Error:", err.stack || err);
//   res.status(500).json({
//     success: false,
//     message: "Internal server error",
//     statusCode: 500,
//   });
// });

// // Error handling middleware
// app.use(notFoundHandler);
// app.use(errorHandler);

// // Socket.io handling
// // socketHandler(io);

// const PORT = process.env.PORT || 3000;

// /**
//  * Start the Express server after establishing database connections
//  */
// async function startServer() {
//   try {
//     console.log("Starting server...");
//     console.log("Connecting to database...");

//     // Connect to database
//     await connectDB()
//       .then(() => {
//         console.log("Connected to database");
//         process.on("uncaughtException", (error) => {
//           console.error("Uncaught Exception:", error);
//           console.error("Stack trace:", error.stack);
//           process.exit(1);
//         });

//         process.on("unhandledRejection", (reason, promise) => {
//           console.error("Unhandled Rejection at:", promise);
//           console.error("Reason:", reason);
//           process.exit(1);
//         });
//         app.listen(PORT, () => {
//           console.log(`Server running on port ${PORT}`);
//           /**
//            * Print server startup information
//            */
//           const protocol = config.https ? "https" : "http";
//           const baseUrl = `${protocol}://${config.host || "localhost"}:${config.port}`;

//           console.log(`
//                         ═══════════════════════════════════════════════════════
//                         🚀 Server Started Successfully!
//                         ═══════════════════════════════════════════════════════
//                         ✅ Environment:     ${config.node_env || "development"}
//                         ✅ Port:           ${config.port}
//                         ✅ Base URL:       ${baseUrl}
//                         ✅ Health Check:   ${baseUrl}/api/health
//                         ✅ Root Endpoint:  ${baseUrl}/
//                         ✅ Time:           ${new Date().toISOString()}
//                         ═══════════════════════════════════════════════════════
//           `);
//         });
//         /**
//          * Graceful shutdown handler
//          * Closes HTTP server and all database connections
//          */
//         const gracefulShutdown = async (signal) => {
//           console.info(`${signal} received, shutting down gracefully...`);

//           // Set a timeout for forced shutdown
//           const forceShutdownTimeout = setTimeout(() => {
//             console.error("Forced shutdown due to timeout");
//             process.exit(1);
//           }, 10000);

//           try {
//             // Close HTTP server
//             await new Promise((resolve, reject) => {
//               app.close((err) => {
//                 if (err) reject(err);
//                 else resolve();
//               });
//             });
//             console.info("HTTP server closed");

//             // Close database connections
//             await mongodb.disconnect();
//             // await postgres.close();
//             // await rabbitmq.close();

//             console.info("All connections closed, exiting process");
//             clearTimeout(forceShutdownTimeout);
//             process.exit(0);
//           } catch (error) {
//             console.error("Error during shutdown:", error);
//             clearTimeout(forceShutdownTimeout);
//             process.exit(1);
//           }
//         };

//         // Handle termination signals
//         process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
//         process.on("SIGINT", () => gracefulShutdown("SIGINT"));
//         console.log("Server initialization completed successfully");
//       })
//       .catch((error) => {
//         console.error("Error connecting to database:", error);
//         process.exit(1);
//       });
//   } catch (error) {
//     console.error("Error starting server:", error);
//     console.log("stack:", error.stack);

//     try {
//       await connectDB().disconnect();
//       console.log("Database connection closed");
//     } catch (error) {
//       console.error("Error disconnecting from database:", error);
//     }

//     process.exit(1);
//   }
// }

// // Start the application
// startServer();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import database from "./src/config/database.js"; // Import the whole object
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoute.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { submitName, getAllUsers, checkUsername, getProfile } from "./test.js";

dotenv.config();

const app = express();

// Configuration
const config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
  node_env: process.env.NODE_ENV || "development",
  https: process.env.HTTPS === "true" || false,
};

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Request logging middleware
 */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
  next();
});

// Routes
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/", (req, res) => {
  return res.status(200).json({
    service: "Himanshu Encrypted Chat App",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      submitName: "/api/submit-name",
      getAllUsers: "/api/users",
      checkUsername: "/api/check-username/:username",
      getProfile: "/api/profile",
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.post("/api/submit-name", submitName);
app.get("/api/users", getAllUsers);
app.use("/api/users", userRoutes);
app.get("/api/check-username/:username", checkUsername);
app.get("/api/profile", getProfile);

// Health check
app.get("/api/health", (req, res) => {
  // You can also check database connection status here
  const dbConnection = database.getConnection();
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    database: dbConnection ? "connected" : "disconnected",
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Endpoint not found",
    statusCode: 404,
  });
});

// Error handling middleware
app.use(errorHandler);

/**
 * Start the Express server
 */

const startServer = async () => {
  let server;

  try {
    console.log("Starting server...");
    console.log("Connecting to database...");

    // Connect to database using the imported object
    await database.connect();
    console.log("Connected to database");

    // Verify connection
    const dbConnection = database.getConnection();
    if (!dbConnection) {
      throw new Error("Database connection verification failed");
    }

    // Global error handlers
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      console.error("Stack trace:", error.stack);
      gracefulShutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("Unhandled Rejection at:", promise);
      console.error("Reason:", reason);
      gracefulShutdown("unhandledRejection");
    });

    // Start server
    server = app.listen(config.port, () => {
      const protocol = config.https ? "https" : "http";
      const baseUrl = `${protocol}://${config.host}:${config.port}`;

      console.log(`
        ═══════════════════════════════════════════════════════
        🚀 Server Started Successfully!
        ═══════════════════════════════════════════════════════
        ✅ Environment:     ${config.node_env}
        ✅ Port:           ${config.port}
        ✅ Base URL:       ${baseUrl}
        ✅ Health Check:   ${baseUrl}/api/health
        ✅ Root Endpoint:  ${baseUrl}/
        ✅ Database:       Connected
        ✅ Time:           ${new Date().toISOString()}
        ═══════════════════════════════════════════════════════
      `);
    });

    /**
     * Graceful shutdown handler
     */
    async function gracefulShutdown(signal) {
      console.info(`${signal} received, shutting down gracefully...`);

      const forceShutdownTimeout = setTimeout(() => {
        console.error("Forced shutdown due to timeout");
        process.exit(1);
      }, 10000);

      try {
        if (server) {
          await new Promise((resolve, reject) => {
            server.close((err) => {
              if (err) reject(err);
              else {
                console.info("HTTP server closed");
                resolve();
              }
            });
          });
        }

        // Disconnect from database using the imported object
        await database.disconnect();
        console.info("Database connection closed");

        console.info("All connections closed, exiting process");
        clearTimeout(forceShutdownTimeout);
        process.exit(0);
      } catch (error) {
        console.error("Error during shutdown:", error);
        clearTimeout(forceShutdownTimeout);
        process.exit(1);
      }
    }

    // Handle termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("Error starting server:", error);
    console.log("stack:", error.stack);

    try {
      await database.disconnect();
    } catch (disconnectError) {
      console.error("Error during cleanup:", disconnectError);
    }

    process.exit(1);
  }
};

// Start the application
startServer();

// export default app;
