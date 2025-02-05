import express, {Response, Request} from "express"
import prisma from "../config/db";



export const createIncome = async (req: Request, res: Response): Promise<any> => {
    let userData = await (req as any)?.user
    if (!userData?.id) {
      return res.status(400).json({
          responseSuccessful: false,
          message: "User not authenticated",
          responseBody: null
      });
  }
    try {
        const {incomeSource, amount, date, category, customCategory, description, workspaceId, userId} = req.body

        if (!workspaceId || !userId) {
            return res.status(400).json({ message: 'Missing workspaceId or userId' });
        }

        if (!incomeSource || !date || !category || !amount || !description || !userId || !workspaceId) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (category === "Other" && !customCategory) {
            return res.status(400).json(
              { message: "Custom category name is required for 'Other' category" }
            );
          }

          const parsedDate = new Date(date);
            const parsedAmount = parseFloat(amount);
            if (isNaN(parsedAmount)) {
                return res.status(400).json({ message: "Invalid amount" });
              }

              const income = await prisma.income.create({
                data: {
                incomeSource,
                date: parsedDate,
                category,
                customCategory: category === "Other" ? customCategory : "",
                amount: parsedAmount,
                description,
                workspace: {connect: { id: workspaceId } },
                user: {connect: { id: userId } },
                }
              })
              return res.status(200).json({
                responseSuccessful: true,
                message: "income created successfully",
                responseBody: income
              });
        
    } catch (error) {
        res.status(500).json({
            responseSuccessful: false,
            responseMessage: error,
            responseBody: null
        }); 
    }
}