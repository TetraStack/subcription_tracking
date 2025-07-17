import { Subscriptions } from "~/data/data";

export function calculateMonthlyExpense(
  subscriptions: Subscriptions[]
): number {
  let total = 0;

  for (const sub of subscriptions) {
    let multiplier = 1;

    switch (sub.subscription_type) {
      case "Weekly":
        multiplier = 4.33;
        break;
      case "Bi-weekly":
        multiplier = 2.17;
        break;
      case "Monthly":
        multiplier = 1;
        break;
      default:
        return 0;
    }

    total += Number(sub.subscription_amount) * multiplier;
  }

  return parseFloat(total.toFixed(2)); // Rounded to 2 decimal places
}

export function getNextDueDate(
  subscription_date: string,
  subscription_type: string
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dueDate = new Date(subscription_date);
  dueDate.setHours(0, 0, 0, 0);

  while (dueDate < today) {
    switch (subscription_type.toLowerCase()) {
      case "weekly":
        dueDate.setDate(dueDate.getDate() + 7);
        break;
      case "bi-weekly":
      case "biweekly":
        dueDate.setDate(dueDate.getDate() + 14);
        break;
      case "monthly":
        dueDate.setMonth(dueDate.getMonth() + 1);
        break;
      default:
        throw new Error("Invalid subscription type");
    }
  }

  return dueDate.toISOString().split("T")[0];
}
