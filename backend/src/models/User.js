const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    provider: {
      type: String,
      enum: ["local", "google", "facebook", "developer", "guest"],
      default: "guest",
    },
    providerId: {
      type: String,
      default: "",
    },
    credits: {
      type: Number,
      default: 100,
    },
    preferences: {
      categories: [
        {
          type: String,
          enum: [
            "Technology",
            "World",
            "Business",
            "Science",
            "Health",
            "Sports",
            "Entertainment",
            "Politics",
          ],
        },
      ],
      sources: [String],
      languages: [String],
      countries: [String],
    },
    savedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
    readingHistory: [
      {
        articleId: String,
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving (if using local auth)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model("User", userSchema);
