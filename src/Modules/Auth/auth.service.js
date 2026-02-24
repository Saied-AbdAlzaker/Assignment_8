import userModel from "../../DB/Models/Users.model.js";
import notesModel from "./../../DB/Models/Notes.model.js";
import jwt from "jsonwebtoken";

export async function addUser(bodyData) {
  const user = await userModel.findOne({ email: bodyData.email });
  if (user) {
    throw new Error("email already exists.", { cause: { statusCode: 409 } });
  }

  const newUser = await userModel.create(bodyData);
  return newUser;
}

export async function addNewUser(bodyData) {
  // const { email, password } = bodyData;
  const user = await userModel.findOne({ email: bodyData.email });
  if (!user) {
    throw new Error("invalid email or password.", {
      cause: { statusCode: 409 },
    });
  }

  // Generate JWT (expires in 1 hour)
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return user , token;
}

export async function editUser(bodyData) {
  const { userId, name, email, age } = bodyData;
  if (email) {
    const user = await userModel.findOne({ email: email });
    if (user) {
      throw new Error("email already exists.", { cause: { statusCode: 409 } });
    }
  }

  const update = await userModel
    .findByIdAndUpdate(
      userId,
      {
        name,
        email,
        age,
        $inc: { __v: 1 },
      },
      { new: true, runValidators: true },
    )
    .select("-password");

  console.log(update);

  if (update.matchedCount == 0) {
    throw new Error("User not found.", {
      cause: { statusCode: 404 },
    });
  }

  return update;
}

export async function deleteUser(bodyData) {
  // const { userId } = bodyData;

  await notesModel.deleteMany({ userId });

  const deleteUser = await userModel.findByIdAndDelete(bodyData.userId);

  if (!deleteUser) {
    throw new Error("User not found.", {
      cause: { statusCode: 404 },
    });
  }

  return deleteUser;
}

export async function getUserById(userId) {
  const user = await userModel.find(userId).select("-password");

  if (!user) {
    throw new Error("User not found.", {
      cause: { statusCode: 404 },
    });
  }

  return user;
}
