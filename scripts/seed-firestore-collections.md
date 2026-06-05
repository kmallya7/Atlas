# Planned Firestore collections

```txt
users/{userId}
accounts/{accountId}
transactions/{transactionId}
budgets/{budgetId}
goals/{goalId}
loans/{loanId}
debts/{debtId}
categories/{categoryId}
```

Every user-owned document should include:

```js
{
  userId: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```
