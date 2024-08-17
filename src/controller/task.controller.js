import { create, destroy, finishTask, getAll, getById, update } from "../service/task.service.js"

export const createTaskController = async (req, res, next) => {
    try {
        const task = await create(req.body)
        return res.status(200).json({
            status: "success",
            data: task
        })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

export const getAllTaskController = async (req, res, next) => {
    try {
        const userId = req.user.id
        const name = req.query.name
        const tasks = await getAll(userId, name)
        return res.status(200).json({
            status: "success",
            data: tasks
        })
    } catch (error) {
        next(error)
    }
}

export const getTaskByIdController = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const task = await getById(id, req.user.id)  

        return res.status(200).json({
            status: "success",
            data: task
        })
    } catch (error) {
        console.error(error.message)
        next(error)
    }
}

export const updateTaskController = async (req, res, next) =>{
    
    try {
        const id = parseInt(req.params.id)
        const task = await update( req.body, id)
        return res.status(200).json({
            status: "success",
            data: task
        })
    } catch (error) {
        next(error)
    }
}

export const deleteTaskController = async (req, res, next) =>{
    try {
        const id = parseInt(req.params.id)
         await destroy(id)
         return res.status(200).json({
            status: "success",
            message : "Task deleted successfully"
         })
    } catch (error) {
        next(error)
    }
}


export const finishTaskController = async (req, res, next) =>{
    try {
      const id = parseInt(req.params.id)
      const task = await finishTask(id)
      return res.status(200).json({
        status: "success",
        data: task
      })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}