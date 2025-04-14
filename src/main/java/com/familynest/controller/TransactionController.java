
package com.familynest.controller;

import com.familynest.model.Transaction;
import com.familynest.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<Transaction>> getTransactionsByAccountId(@PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getTransactionsByAccountId(accountId));
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @RequestParam Long accountId,
            @RequestParam BigDecimal amount,
            @RequestParam String description) {
        
        return ResponseEntity.ok(transactionService.createTransaction(accountId, amount, description));
    }
}
