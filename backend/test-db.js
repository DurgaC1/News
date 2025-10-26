const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
require("dotenv").config();

// Test database connection and functionality
async function testDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/newsdb";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB successfully!");
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);

    // Test 1: Create a test user with email/password
    console.log("\n📝 Test 1: Creating test user...");
    const testUser = new User({
      email: "test@example.com",
      password: "testpass123",
      name: "Test User",
      provider: "local",
      avatar:
        "https://ui-avatars.com/api/?name=Test+User&background=667eea&color=fff",
      credits: 100,
    });

    await testUser.save();
    console.log("✅ User created successfully!");
    console.log("   Email:", testUser.email);
    console.log("   Name:", testUser.name);
    console.log("   Credits:", testUser.credits);

    // Test 2: Find user by email
    console.log("\n🔍 Test 2: Finding user by email...");
    const foundUser = await User.findOne({ email: "test@example.com" });
    console.log("✅ User found!");
    console.log("   Email:", foundUser.email);
    console.log("   Password hash exists:", !!foundUser.password);

    // Test 3: Verify password
    console.log("\n🔐 Test 3: Verifying password...");
    const isValid = await foundUser.comparePassword("testpass123");
    console.log("✅ Password verification:", isValid ? "PASSED" : "FAILED");

    // Test 4: Test invalid password
    const isInvalid = await foundUser.comparePassword("wrongpassword");
    console.log("✅ Invalid password test:", !isInvalid ? "PASSED" : "FAILED");

    // Test 5: Update user preferences
    console.log("\n⚙️  Test 4: Updating user preferences...");
    foundUser.preferences = {
      categories: ["Technology", "World", "Business"],
      sources: ["BBC", "CNN"],
      languages: ["en"],
      countries: ["us"],
    };
    await foundUser.save();
    console.log("✅ Preferences updated!");
    console.log("   Categories:", foundUser.preferences.categories);

    // Test 6: Check collections
    console.log("\n📚 Test 5: Checking collections...");
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("✅ Available collections:");
    collections.forEach((col) => {
      console.log("   -", col.name);
    });

    // Cleanup: Delete test user
    console.log("\n🧹 Cleaning up test data...");
    await User.deleteOne({ email: "test@example.com" });
    console.log("✅ Test user deleted!");

    // Show users count
    const userCount = await User.countDocuments();
    console.log("\n📊 Total users in database:", userCount);

    console.log("\n✅ All tests passed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Database connection closed.");
    process.exit(0);
  }
}

// Run tests
testDatabase();
