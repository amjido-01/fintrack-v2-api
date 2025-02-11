import { Request, Response } from 'express';
import prisma from '../config/db';
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "../utils/jwtUtil";

// Get all users
export const getUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
};

// Get a single user by ID
export const getUserById = async (req: Request, res: Response): Promise<any> => {
    const {id} = req.params

  try {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })
    if (!user) {
      return res.status(404).json({ message: 'User not found .........' });
    }

    // Respond with the user data
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching the user' });
  }
};



export const createUser = async (req: Request, res: Response): Promise<any> => {
    const {name, username, email, password} = req.body;
    try {

        if (!name || !email || !password || !username) return res.status(400).json({message: "please provide all inputs, oo"})

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser) {
            return res.status(404).json({
                responseSuccessful: true,
                responseMessage: "This email has been registered already",
                responseBody: null
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

         // Generate tokens
         const accessToken = generateAccessToken({
            id: user.id,
            email: user.email
        });

        const refreshToken = generateRefreshToken({
            id: user.id,
            email: user.email
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
          //   secure: process.env.NODE_ENV === 'production',
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

        res.status(201).json({ 
            responseSuccessful: true,
            responseMessage: 'User created successfully',
            responseBody: {
                user,
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        res.status(500).json({
            responseSuccessful: false,
            responseMessage: error,
            responseBody: null
        });
    }
}

// user profile
export const profile = async (req: Request, res: Response): Promise<any> => {
  let userData = await (req as any)?.user
  if (!userData?.id) {
    return res.status(400).json({
        responseSuccessful: false,
        message: "User not authenticated",
        responseBody: null
    });
}
  try {
      const user = await prisma.user.findUnique({
          where: {id: userData.id},
          include: {
              expenses: true,
              income: true,
              workspaces: true
          }
      })
      console.log("hello", user)
      if (!user) {
          return res.status(404).json({ message: 'User not found ,,,,,,' });
        }
    
        res.json({user, message: "This is a protected route"});
  } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal server error' });

  }
}

// Update a user by ID
// export const updateUser = (req: Request, res: Response) => {
//   const userId = parseInt(req.params.id);
//   const { name, email } = req.body;

//   const user = users.find((u) => u.id === userId);

//   if (!user) {
//     return res.status(404).json({ message: 'User not found!' });
//   }

//   user.name = name || user.name;
//   user.email = email || user.email;

//   res.json({ message: 'User updated successfully!', data: user });
// };

// Delete a user by ID
// export const deleteUser = (req: Request, res: Response) => {
//   const userId = parseInt(req.params.id);
//   const userIndex = users.findIndex((u) => u.id === userId);

//   if (userIndex === -1) {
//     return res.status(404).json({ message: 'User not found!' });
//   }

//   users.splice(userIndex, 1);

//   res.json({ message: 'User deleted successfully!' });
// };