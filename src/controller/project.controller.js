import { create, destroy, getAll, getById, update } from "../service/project.service.js"

export const createProjectControler = async (req, res, next) => {
    try {
        const project = await create(req)
        return res.status(200).json({
            status: "success",
            data: project
        })
    } catch (error) {
        // console.log(error.message)
        next(error)
    }
}

export const getAllProjectController = async (req, res, next) => {
    try {
        const name = req.query.name
        const projects = await getAll(name)
        return res.status(200).json({
            status: "success",
            data: projects
        })
    } catch (error) {
        next(error)
    }
}

export const getByIdProjectController = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const project = await getById(id)
        return res.status(200).json({
            status: "success",
            data: project
        })
    } catch (error) {
        next(error)
    }
}

export const updateProjectController = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const project = await update(req.body, id)
        return res.status(200).json({
            status: "success",
            data: project
        })
    } catch (error) {
        next(error)
    }
}

export const deleteProjectController = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        await destroy(id)
        return res.status(200).json({
            status: "success",
            message: "project deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}