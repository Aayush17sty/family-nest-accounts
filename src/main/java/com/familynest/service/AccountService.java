
package com.familynest.service;

import com.familynest.model.Account;
import com.familynest.model.User;
import com.familynest.repository.AccountRepository;
import com.familynest.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Account> getAccountsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        if (user.getRole() == User.Role.PARENT) {
            // Parents see both their accounts and their children's accounts
            return accountRepository.findByUserOrUserParent(user, user);
        } else {
            // Children see only their accounts
            return accountRepository.findByUser(user);
        }
    }

    public Account getAccountById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Account not found"));
    }

    public Account createAccount(Long userId, String name, boolean isParentAccount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        if (isParentAccount && user.getRole() != User.Role.PARENT) {
            throw new RuntimeException("Only parent users can create parent accounts");
        }
        
        Account account = new Account();
        account.setName(name);
        account.setBalance(BigDecimal.ZERO);
        account.setUser(user);
        account.setIsParentAccount(isParentAccount); // This calls our custom method
        
        if (!isParentAccount && user.getParent() != null) {
            // Link child account to parent's default account
            accountRepository.findByUser(user.getParent())
                    .stream()
                    .findFirst()
                    .ifPresent(account::setParentAccount);
        }
        
        return accountRepository.save(account);
    }

    public void updateAccountBalance(Long accountId, BigDecimal amount) {
        Account account = getAccountById(accountId);
        account.setBalance(account.getBalance().add(amount));
        accountRepository.save(account);
    }
}
