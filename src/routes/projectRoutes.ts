import { body, param } from "express-validator";
import { handelInputsErros } from "../middleware/validation";
import { ProjecController } from "../controllers/ProjectController";
import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import {
  hasAuthorization,
  taskBelongsToProject,
  taskExists,
} from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

router.use(authenticate);

router.post(
  "/",

  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripcion del proyecto es obligatorio"),
  handelInputsErros,
  ProjecController.createProject
);
router.get("/", ProjecController.getAllProjects);
router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID no es válido"),
  handelInputsErros,
  ProjecController.getProjectById
);
// Router for Tasks
router.param("projectId", projectExists);
router.put(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no es válido"),
  body("projectName")
    .notEmpty()
    .withMessage("El nombre del proyecto es obligatorio"),
  body("clientName")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripcion del proyecto es obligatorio"),
  handelInputsErros,
  hasAuthorization,
  ProjecController.updateProjectById
);

router.delete(
  "/:projectId",
  param("projectId").isMongoId().withMessage("ID no es válido"),
  handelInputsErros,
  hasAuthorization,
  ProjecController.deleteProjectById
);

router.post(
  "/:projectId/tasks",
  hasAuthorization,
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripcion de la tarea es obligatorio"),
  handelInputsErros,
  TaskController.createTask
);

router.get("/:projectId/tasks", TaskController.getProjectTask);

router.param("taskId", taskExists);
router.param("taskId", taskBelongsToProject);

router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("ID no es válido"),
  handelInputsErros,
  TaskController.getTaskById
);

router.put(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("ID no es válido"),
  body("name").notEmpty().withMessage("El nombre de la tarea es obligatorio"),
  body("description")
    .notEmpty()
    .withMessage("La descripcion de la tarea es obligatorio"),
  handelInputsErros,
  TaskController.updateTask
);

router.delete(
  "/:projectId/tasks/:taskId",
  hasAuthorization,
  param("taskId").isMongoId().withMessage("ID no es válido"),
  handelInputsErros,
  TaskController.deleteTask
);

router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("ID no es válido"),
  body("status").notEmpty().withMessage("El estado es obligatorio"),
  handelInputsErros,
  TaskController.updateStatus
);

// Routes for teams
router.post(
  "/:projectId/team/find",
  body("email").isEmail().toLowerCase().withMessage("E-mail no válido"),
  handelInputsErros,
  TeamMemberController.findMemberByEmail
);

router.get("/:projectId/team", TeamMemberController.getProjectTeam);

router.post(
  "/:projectId/team",
  body("id").isMongoId().withMessage("ID no válido"),
  handelInputsErros,
  TeamMemberController.addUserByID
);

router.delete(
  "/:projectId/team/:userId",
  param("userId").isMongoId().withMessage("ID no válido"),
  handelInputsErros,
  TeamMemberController.removeMemberByID
);

// Routes for Notes

router.post(
  "/:projectId/tasks/:taskId/notes",
  body("content")
    .notEmpty()
    .withMessage("El contenido de la nota es obligatorio"),
  handelInputsErros,
  NoteController.createNote
);

router.get(
  "/:projectId/tasks/:taskId/notes",

  NoteController.getTaskNotes
);

router.delete(
  "/:projectId/tasks/:taskId/notes/:noteId",
  param("noteId").isMongoId().withMessage("Id no valido"),
  handelInputsErros,
  NoteController.deleteNote
);
export default router;
