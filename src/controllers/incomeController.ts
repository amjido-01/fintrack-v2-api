import express, {Response, Request} from "express"
import prisma from "../config/db";


// create income
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


// delete income
export const deleteIncome = async (req: Request, res: Response): Promise<any> => {
  const {id} = req.params

  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
}

  try {
    const deletedIncome = await prisma.income.update({
      where: {id},
      data: {
          isDeleted: true,
          deletedAt: new Date()
      }
  })

  if (!deletedIncome) {
    return res.status(404).json({ message: 'Income not found' });
  }

  return res.status(200).json({responseBody: deletedIncome, responseSuccessful: true,
    message: "income created successfully" });
  
  } catch (error) {
    console.error("Error deleting income:", error);
        return res.status(500).json({ message: "Failed to delete income" });
  }
}


// edit income
export const editIncome = async (req: Request, res: Response): Promise<any> => {
  try {
      const { id } = req.params;
      const { incomeSource, date, amount, category, description } = req.body;
      console.log("updating from the server")
      if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const existingIncome = await prisma.income.findUnique({ where: { id } });
    if (!existingIncome) {
      return res.status(404).json({ error: "Income record not found" });
    }

      const updatedIncome = await prisma.income.update({
          where: { id },
          data: {
              incomeSource,
              date: new Date(date),
              amount: parseFloat(amount),
              category,
              description
          }
      })
      return res.status(200).json(updatedIncome);
  } catch (error) {
      console.error("Error updating income:", error);
      return res.status(500).json({ error: "Failed to update income" });
  }
}