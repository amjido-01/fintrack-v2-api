import express, {Response, Request} from "express"
import prisma from "../config/db"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export const createWorkspace = async (req: Request, res: Response): Promise<any> => {
    let userData = await (req as any)?.user

    if (!userData?.id) {
      return res.status(400).json({
          responseSuccessful: false,
          message: "User not authenticated",
          responseBody: null
      });
  }
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
        message: "Workspace created successfully",
        responseBody: result
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

    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

  try {

    const user = await prisma.user.findUnique({
        where: {id},
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

// get workspace by Workspace ID
export const getWorkSpace = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
        const workspace = await prisma.workspace.findUnique({
            where: {id},
            include: {
                expenses: true,
                income: true,
            }
        })


        if (!workspace) {
            return res.status(404).json({ error: "Workspace not found" });	
        }

        return res.status(201).json({
            responseSuccessful: true,
            responseMessage: "Workspaces retrieved successfully",
            responseBody: workspace
          })
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            console.error('Prisma error:', error.message);
            return res.status(400).json({
              responseSuccessful: false,
              responseMessage: "Database error occurred",
              responseBody: null
            });
          }
      
          // Handle other errors
          if (error instanceof Error) {
            console.error('Server error:', error.message);
            return res.status(500).json({
              responseSuccessful: false,
              responseMessage: "Internal server error",
              responseBody: null
            });
          }
      
          // Fallback for unknown errors
          console.error('Unknown error:', error);
          return res.status(500).json({
            responseSuccessful: false,
            responseMessage: "An unexpected error occurred",
            responseBody: null
          });
    }
}

// Get the last user workspace
export const workspace = async (req: Request, res: Response): Promise<any> => {
    let userData = await (req as any)?.user

    if (!userData?.id) {
      return res.status(400).json({
          responseSuccessful: false,
          message: "User not authenticated",
          responseBody: null
      });
  }

    try {
         // check for user workspaces
    const hasWorkSpace = await prisma.workspace.findMany({
        where: {
          createdById: userData?.id
        },
        orderBy: {
          lastActiveAt: 'desc'
        },
        include: {
          expenses: true,
          income: true
        },
      })

      const user = await prisma.user.findUnique({where: {id: userData?.id}})
      return res.status(200).json({
        responseSuccessful: true,
        message: "hasWorkSpace",
        responseBody: {hasWorkSpace, user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.userName
        }}
      })
        
    } catch (error) {
        res.status(500).json({
            responseSuccessful: false,
            responseMessage: error,
            responseBody: null
        }); 
    }
}

// update a workspace
export const updateWorkspace = async (req: Request, res: Response): Promise<any> => {
  try {
    const {id} = req.params
    const body =  req.body;
    console.log(body)

    if (!id) {
        return res.status(400).json({ message: "Workspace ID is required" });
    }

    const { workspaceName, currency } = body;

     // Check for valid update fields
     if (!workspaceName && !currency) {
      return res.status(400).json({ 
        message: "At least one update field (workspaceName or currency) is required" 
      });
    }

    const updatedWorkspace = await prisma.workspace.update({
        where: { id },
        data: {
          ...(workspaceName && { workspaceName }), // Only update if provided
          ...(currency && { currency }),
        }
    })
    return res.status(200).json(updatedWorkspace);
} catch (error) {
  console.error("Error updating workspace:", error);

  // Handle Prisma not found error
  if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
    return res.status(404).json({ 
      error: "Workspace not found or unauthorized to update"
    });
  }

   // Type safety for unexpected errors
   const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
   return res.status(500).json({ 
     error: "Failed to update workspace",
     details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
   });
}
}