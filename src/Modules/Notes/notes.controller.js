import express from "express";
import * as notesService from "./notes.service.js";
import { authMiddleware } from "../Auth/auth.middleware.js";

const notesRouter = express.Router();

notesRouter.post("/", authMiddleware, async (req, res) => {
  const result = await notesService.createNote(req.body);
  return res.status(201).json({ msg: "Note created.", result });
});

notesRouter.patch("/:noteId", authMiddleware, async (req, res) => {
  const result = await notesService.updateNote(req.body, req.params.noteId);
  return res.status(201).json({ msg: "Note updated.", result });
});

notesRouter.put("/replace/:noteId", authMiddleware, async (req, res) => {
  const result = await notesService.replaceNote(req.body, req.params.noteId);
  return res.status(201).json({ msg: "Note updated.", result });
});

notesRouter.patch("/all", authMiddleware, async (req, res) => {
  const result = await notesService.updateAllNote(req.body);
  return res.status(201).json({ msg: "all notes updated.", result });
});

notesRouter.delete("/:noteId", authMiddleware, async (req, res) => {
  const result = await notesService.deleteNote(req.body, req.params.noteId);
  return res.status(201).json({ msg: "Note deleted.", result });
});

notesRouter.get("/paginate-sort", authMiddleware, async (req, res) => {
  const result = await notesService.sortNote(req.userId, req.query);
  return res.status(201).json({ msg: "done.", result });
});

notesRouter.get("/:id", authMiddleware, async (req, res) => {
  const result = await notesService.sortNote(req.userId, req.params);
  return res.status(201).json({ msg: "done.", result });
});

notesRouter.get("/:id", authMiddleware, async (req, res) => {
  const result = await notesService.getNote(req.userId, req.params);
  return res.status(201).json({ msg: "done.", result });
});

notesRouter.get("/note-by-content", authMiddleware, async (req, res) => {
  const result = await notesService.getNoteContent(req.userId, req.query);
  return res.status(201).json({ msg: "done.", result });
});

notesRouter.get("/note-with-user", authMiddleware, async (req, res) => {
  const result = await notesService.getNoteWithUser(req.userId);
  return res.status(201).json({ msg: "done.", result });
});

notesRouter.get("/aggregate", authMiddleware, async (req, res) => {
  const result = await notesService.aggregateNotes(req.userId, req.query);
  return res.status(201).json({ msg: "done.", result });
});

notesRouter.delete("/", authMiddleware, async (req, res) => {
  const result = await notesService.deleteAllNotes(req.userId);
  return res.status(201).json({ msg: "Deleted.", result });
});

export default notesRouter;
