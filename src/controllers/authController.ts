import { Request, Response } from 'express';
import bcrypt from "bcrypt";
import prisma from '../config/db';
import { generateRefreshToken, generateAccessToken } from '../utils/jwtUtil';

// Register a new user
export const register = async (req: Request, res: Response): Promise<any> => {
  const {name, userName, email, password} = req.body;

  try {
      // Validate inputs
      if (!name || !email || !password || !userName) return res.status(400).json({message: "please provide all inputs"})
        

      const existingUser = await prisma.user.findUnique({
          where: {
              email
          }
      })

      if (existingUser) {
          return res.status(404).json({
              responseSuccessful: false,
              responseMessage: "This email has been registered already",
              responseBody: null
          });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await prisma.user.create({
          data: {
              name,
              email,
              userName,
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

      // Save refreshToken in the database
    const updatedUser = await prisma.user.update({
      where: { id: user.id }, // Use the user's ID to update the record
      data: { refreshToken }
    });

      res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          // secure: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        
        console.log(updatedUser)
      res.status(201).json({ 
          responseSuccessful: true,
          responseMessage: 'User created successfully',
          responseBody: {
            user: {
              id: updatedUser.id,
              name: updatedUser.name,
              email: updatedUser.email,
              userName: updatedUser.userName
            },
            accessToken,
            refreshToken
          }
      });

  } catch (error) {
    console.error('Registration error:', error); // Log the error for debugging

    if (error instanceof Error) {
      res.status(500).json({
        responseSuccessful: false,
        responseMessage: error.message, // Send the error message
        responseBody: null
      });
    } else {
      res.status(500).json({
        responseSuccessful: false,
        responseMessage: 'Internal server error', // Fallback message
        responseBody: null
      });
    }
  }
};

// Login a user
export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  // console.log(req.cookies.refreshToken)

  try {
      // Validate input
      if (!email || !password) {
          return res.status(400).json({ message: "Please provide all inputs one" });
      }

      // Find the user by email
      const existingUser = await prisma.user.findUnique({
          where: { email },
          include: {
              expenses: true,
              income: true,
          }
      });

      // Check if the user exists
      if (!existingUser) {
          return  res.status(404).json({
              responseSuccessful: true,
              responseMessage: "Invalid login credentials",
              responseBody: null
          });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, existingUser.password)
      if (!validPassword) {
          return  res.status(404).json({
              responseSuccessful: true,
              responseMessage: "Invalid login credentials",
              responseBody: null
          });
      }

      // Generate tokens
      const accessToken = generateAccessToken({
          id: existingUser.id,
          email: existingUser.email
      });

      const refreshToken = generateRefreshToken({
          id: existingUser.id,
          email: existingUser.email
      })

      console.log(refreshToken, accessToken,"from login")
      await prisma.user.update({
          where: {id: existingUser.id},
          data: {refreshToken: refreshToken},
      })

     res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    // secure: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });


      // Send tokens as response
      return res.status(200).json({
          message: "Login successful",
          accessToken,
          refreshToken,
          responseBody: existingUser
      });
  } catch (error) {
      res.status(500).json({
          responseSuccessful: false,
          responseMessage: error,
          responseBody: null
      });
  }
}

// Logout a user (for demonstration purposes)
export const logout = async (req: Request, res: Response): Promise<any> => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
      await prisma.user.updateMany({
        where: { refreshToken },
        data: { refreshToken: null },
      });
    }
  res.clearCookie("refreshToken")
  res.json({ message: 'Logged out successfully' });
};