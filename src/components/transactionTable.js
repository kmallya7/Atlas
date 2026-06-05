export function transactionTable(transactions, { compact = false, showActions = false, title = 'Recent transactions', description } = {}) {
  const tableDescription = description || (compact ? 'Latest activity across linked and manual accounts' : 'Add, edit, split, or review transaction records');

  return `
    <article class="table-card">
      <div class="card-title-row">
        <div>
          <h3>${title}</h3>
          <p>${tableDescription}</p>
        </div>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Category</th>
              <th>Date</th>
              <th>Account</th>
              <th>Type</th>
              <th>Amount</th>
              ${showActions ? '<th>Actions</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${
              transactions.length
                ? transactions
                    .map(
                      (transaction) => `
                  <tr>
                    <td>
                      <strong>${transaction.merchant}</strong>
                      <span>${transaction.notes || (transaction.splitReady ? 'Split ready' : 'No notes')}</span>
                    </td>
                    <td>${transaction.category}</td>
                    <td>${transaction.date}</td>
                    <td>${transaction.account}</td>
                    <td><span class="pill ${transaction.type}">${transaction.type}</span></td>
                    <td class="amount ${transaction.type}">${transaction.amount}</td>
                    ${
                      showActions
                        ? `
                          <td>
                            <div class="table-actions">
                              <button type="button" data-transaction-action="edit" data-transaction-id="${transaction.id}">Edit</button>
                              <button type="button" data-transaction-action="delete" data-transaction-id="${transaction.id}">Delete</button>
                            </div>
                          </td>
                        `
                        : ''
                    }
                  </tr>
                `,
                    )
                    .join('')
                : `
                  <tr>
                    <td colspan="${showActions ? 7 : 6}">
                      <div class="table-empty-state">
                        <strong>No transactions found</strong>
                        <span>Try a different search, date range, account, category, or type.</span>
                      </div>
                    </td>
                  </tr>
                `
            }
          </tbody>
        </table>
      </div>
    </article>
  `;
}
