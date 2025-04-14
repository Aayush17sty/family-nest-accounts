
package com.familynest.service;

import com.familynest.model.Account;
import com.familynest.model.Transaction;
import com.familynest.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountService accountService;

    public List<Transaction> getTransactionsByAccountId(Long accountId) {
        Account account = accountService.getAccountById(accountId);
        return transactionRepository.findByAccountOrderByCreatedAtDesc(account);
    }

    @Transactional
    public Transaction createTransaction(Long accountId, BigDecimal amount, String description) {
        Account account = accountService.getAccountById(accountId);
        
        // Update account balance
        accountService.updateAccountBalance(accountId, amount);
        
        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setDescription(description);
        transaction.setAccount(account);
        
        return transactionRepository.save(transaction);
    }
}
