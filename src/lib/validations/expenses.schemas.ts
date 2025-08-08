import { z } from "zod";

export const createExpenseSchema = z.object({
    expense_name: z.string().min(1, { message: "Expense name is required" }),
    expense_amount: z.number().min(1, { message: "Expense amount is required" }),
    expense_date: z.string().min(1, { message: "Expense date is required" }),
});
