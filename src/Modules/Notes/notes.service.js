import mongoose from "mongoose";
import notesModel from "./../../DB/Models/Notes.model.js";

export async function createNote(bodyData) {
  const { title, content, userId } = bodyData;

  const addNote = await notesModel.create({
    title,
    content,
    userId,
  });

  return addNote;
}

export async function updateNote(bodyData, paramsData) {
  const noteId = paramsData;

  const note = await notesModel.findById(noteId);

  if (!note) {
    throw new Error("Note not found", { cause: { statusCode: 404 } });
  }

  if (note.userId.toString() !== bodyData.userId) {
    throw new Error("you are not the owner.", { cause: { statusCode: 404 } });
  }

  const updateNote = await notesModel.findByIdAndUpdate(noteId, bodyData, {
    new: true,
    runValidators: true,
  });

  return updateNote;
}

export async function replaceNote(bodyData, paramsData) {
  const noteId = paramsData;

  const note = await notesModel.findById(noteId);

  if (!note) {
    throw new Error("Note not found", { cause: { statusCode: 404 } });
  }

  if (note.userId.toString() !== bodyData.userId) {
    throw new Error("you are not the owner.", { cause: { statusCode: 404 } });
  }

  const replacementData = {
    ...bodyData,
  };

  const replaceNote = await notesModel.findOneAndReplace(
    { _id: noteId },
    replacementData,
    {
      new: true,
      runValidators: true,
    },
  );

  return replaceNote;
}

export async function updateAllNote(bodyData, userId) {
  const { newTitle } = bodyData;

  if (!newTitle) {
    throw new Error("newTitle is required.", { cause: { statusCode: 404 } });
  }

  const allNotes = await notesModel.updateMany(
    { userId: bodyData.userId },
    { $set: { title: newTitle } },
    { new: true, runValidators: true },
  );

  return allNotes;
}

export async function deleteNote(bodyData, paramsData) {
  const noteId = paramsData;

  const note = await notesModel.findById(noteId);

  if (!note) {
    throw new Error("Note not found", { cause: { statusCode: 404 } });
  }

  if (note.userId.toString() !== bodyData.userId) {
    throw new Error("you are not the owner.", { cause: { statusCode: 404 } });
  }

  const deleteNote = await notesModel.findByIdAndDelete(noteId, bodyData, {
    new: true,
    runValidators: true,
  });

  return deleteNote;
}

export async function sortNote(bodyData, queryData) {
  const userId = bodyData;
  console.log(userId);

  let { page = 1, limit = 5 } = queryData;
  page = parseInt(page);
  limit = parseInt(limit);

  const skip = (page - 1) * limit;

  const totalNotes = await notesModel.countDocuments({ userId });

  const notes = await notesModel
    .find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    currentPage: page,
    totalPages: Math.ceil(totalNotes / limit),
    totalNotes,
    notes,
  };
}

export async function getNote(userId, paramsData) {
  const noteId = paramsData.id;

  const note = await notesModel.findById(noteId);

  if (!note) {
    throw new Error("Note not found", { cause: { statusCode: 404 } });
  }

  if (note.userId.toString() !== userId) {
    throw new Error("you are not the owner.", { cause: { statusCode: 404 } });
  }

  return note;
}

export async function getNoteContent(userId, queryData) {
  const { content } = queryData;

  if (!content) {
    throw new Error("Note not found", { cause: { statusCode: 404 } });
  }

  const note = await notesModel.find({
    userId,
    content: { $regex: content, $options: "i" },
  });

  return note;
}

export async function getNoteWithUser(userId) {
  const notesUser = await notesModel
    .find({ userId })
    .select("title userId createdAt")
    .populate({
      path: "userId",
      select: "email -_id",
    });

  return { count: notesUser.length, notesUser };
}

export async function aggregateNotes(userId, queryData) {
  const { title } = queryData;

  if (title) {
    userId.title = { $regex: title, $options: "i" };
  }

  const userIdObj = new mongoose.Types.ObjectId(userId);

  const notesUser = await notesModel.aggregate([
    { $match: { userIdObj } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        title: 1,
        content: 1,
        createdAt: 1,
        "user.name": 1,
        "user.email": 1,
      },
    },
  ]);

  return { count: notesUser.length, notesUser };
}

export async function deleteAllNotes(userId) {
  const allNotes = await notesModel.deleteMany({ userId });

  return allNotes;
}
