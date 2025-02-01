import express, {Response, Request} from "express"
import prisma from "../config/db"


export const createWorkspace = async (req: Request, res: Response): Promise<any> => {
    let userData = await (req as any)?.user

    console.log(userData, "from workspace")
      const { workspaceName, description, currency } = req.body;
    try {
        
      // check if workspace already exists
      const existingWorkspace = await prisma.workspace.findFirst({
        where: {
          workspaceName,
          createdById: userData?.userData
        },
      });
  
      if (existingWorkspace) {
        return res.status(404).json({message: "Workspace already exists"})
      }

      // Create the workspace in the database
      const result = await prisma.workspace.create({
        data: {
          workspaceName,
          currency,
          description,
          createdById: userData?.id
        },
      });

      return res.status(201).json({
        message: "Workspace created successfully"
      })

    } catch (error) {
        res.status(500).json({
            responseSuccessful: false,
            responseMessage: error,
            responseBody: null
        });
    }
}


// Get a single user by ID
export const checkWorkSpace = async (req: Request, res: Response): Promise<any> => {
    const {id} = req.params
    console.log(id, " from workspace")

    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

  try {

    const user = await prisma.user.findUnique({
        where: { id},
        select: {
            workspaces: {
                orderBy: {
                    lastActiveAt: 'desc',
                },
                take: 1, // Get the last active workspace
                select: {
                    id: true,
                    workspaceName: true,
                },
            },
        },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hasWorkspace = user.workspaces.length > 0;
    const lastWorkspace = hasWorkspace ? user.workspaces[0] : null;

    // Respond with the user data
    return res.status(200).json({ hasWorkspace, lastWorkspace });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the user' });
  }
};