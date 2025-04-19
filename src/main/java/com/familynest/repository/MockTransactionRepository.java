
package com.familynest.repository;

import com.familynest.model.Account;
import com.familynest.model.Transaction;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@Primary
public class MockTransactionRepository implements TransactionRepository {
    private List<Transaction> transactions;
    private Long currentId = 1L;

    public MockTransactionRepository() {
        transactions = new ArrayList<>();
    }

    @Override
    public List<Transaction> findByAccountOrderByCreatedAtDesc(Account account) {
        return transactions.stream()
                .filter(transaction -> transaction.getAccount().getId().equals(account.getId()))
                .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public Transaction save(Transaction transaction) {
        if (transaction.getId() == null) {
            transaction.setId(currentId++);
            transaction.setCreatedAt(LocalDateTime.now());
        }
        transactions.removeIf(existingTransaction -> existingTransaction.getId().equals(transaction.getId()));
        transactions.add(transaction);
        return transaction;
    }
}
