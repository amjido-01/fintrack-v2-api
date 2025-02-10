import express, {Request, Response} from "express"
import prisma from "../config/db"


export const createExpense = async (req: Request, res: Response): Promise<any> => {
    let userData = await (req as any)?.user
    if (!userData?.id) {
        return res.status(400).json({
            responseSuccessful: false,
            message: "User not authenticated",
            responseBody: null
        });
    }
    try {
        
        const { expenseName, date, amount, category, note, customCategory, workspaceId, userId } = req.body;
        
        if (!workspaceId || !userId) {
            console.error('Missing workspaceId or userId');
            return res.status(400).json({ message: 'Missing workspaceId or userId' });
          }
          
        if (!expenseName || !date || !amount || !category || !userId || !workspaceId) {
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

            const expense = await prisma.expense.create({
                data: {
                    expenseName,
                    date: new Date(date),
                    note,
                    category,
                    customCategory: category === "Other" ? customCategory : null,
                    amount: parsedAmount,
                    workspace: {connect: { id: workspaceId } },
                    user: {connect: { id: userId } }
                }
            })

            return res.status(200).json({
                responseSuccessful: true,
                message: "expense created successfully",
                responseBody: expense
              });

    } catch (error) {
        res.status(500).json({
            responseSuccessful: false,
            responseMessage: error,
            responseBody: null
        }); 
    }
}

// delete expense
export const deleteExpense = async (req: Request, res: Response): Promise<any> => {
    const {id} = req.params
 
  
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
  }
  
    try {
      const deletedExpense = await prisma.expense.update({
        where: {id},
        data: {
            isDeleted: true,
            deletedAt: new Date()
        }
    })
  
    return res.status(200).json({
        responseBody: deletedExpense,
        responseSuccessful: true,
        message: "Expense deleted successfully",
    });
    
    } catch (error) {
      console.error("Error deleting expense:", error);
          return res.status(500).json({ message: "Failed to delete expense" });
    }
  }


  // edit expense
// Update an expense by ID
export const editExpense = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Expense not found' });
        }
        const { expenseName, date, amount, category, note } = req.body;

        const existingExpense = await prisma.expense.findUnique({ where: { id } });
        if (!existingExpense) {
          return res.status(404).json({ error: "Income record not found" });
        }

        const updatedExpense = await prisma.expense.update({
            where: { id },
            data: {
                expenseName,
                date: new Date(date),
                amount: parseFloat(amount),
                category,
                note
            }
        })
        return res.status(200).json(updatedExpense);
    } catch (error) {
        console.error("Error updating expense:", error);
        return res.status(500).json({ error: "Failed to update expense" });
    }
}