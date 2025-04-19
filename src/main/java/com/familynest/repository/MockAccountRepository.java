
package com.familynest.repository;

import com.familynest.model.Account;
import com.familynest.model.User;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@Primary
public class MockAccountRepository implements AccountRepository {
    private List<Account> accounts;
    private Long currentId = 1L;

    public MockAccountRepository() {
        accounts = new ArrayList<>();
    }

    @Override
    public List<Account> findByUser(User user) {
        return accounts.stream()
                .filter(account -> account.getUser().getId().equals(user.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Account> findByUserOrUserParent(User user, User parent) {
        return accounts.stream()
                .filter(account -> 
                    account.getUser().getId().equals(user.getId()) || 
                    (account.getUser().getParent() != null && 
                     account.getUser().getParent().getId().equals(parent.getId())))
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Account> findById(Long id) {
        return accounts.stream()
                .filter(account -> account.getId().equals(id))
                .findFirst();
    }

    @Override
    public Account save(Account account) {
        if (account.getId() == null) {
            account.setId(currentId++);
            account.setCreatedAt(LocalDateTime.now());
            if (account.getBalance() == null) {
                account.setBalance(BigDecimal.ZERO);
            }
        }
        accounts.removeIf(existingAccount -> existingAccount.getId().equals(account.getId()));
        accounts.add(account);
        return account;
    }
}
