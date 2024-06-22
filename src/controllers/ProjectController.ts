import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjecController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    //Asignacion de manager del projecto
    project.manager = req.user.id;
    try {
      await project.save();
      res.send("Projecto creado correctamente");
    } catch (error) {
      console.log(error.message);
    }
  };
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [
          {
            manager: { $in: req.user.id },
          },
          { team: { $in: req.user.id } },
        ],
      });
      res.json(projects);
    } catch (error) {}
  };

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id).populate("tasks");
      if (!project) {
        const errror = new Error("Proyecto no encontrado");
        return res.status(404).json({ error: errror.message });
      }

      if (
        project.manager.toString() !== req.user.id.toString() &&
        !project.team.includes(req.user.id)
      ) {
        const errror = new Error("Accion no valida");
        return res.status(404).json({ error: errror.message });
      }

      res.json(project);
    } catch (error) {
      console.log(error);
    }
  };

  static updateProjectById = async (req: Request, res: Response) => {
    try {
      req.project.clientName = req.body.clientName;
      req.project.projectName = req.body.projectName;
      req.project.description = req.body.description;
      await req.project.save();
      res.send("Projecto Actualizado");
    } catch (error) {
      console.log(error);
    }
  };

  static deleteProjectById = async (req: Request, res: Response) => {
    try {
      await req.project.deleteOne();

      res.send("Projecto Eliminado");
    } catch (error) {
      console.log(error);
    }
  };
}
