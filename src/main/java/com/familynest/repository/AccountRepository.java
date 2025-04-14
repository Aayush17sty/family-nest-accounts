
package com.familynest.repository;

import com.familynest.model.Account;
import com.familynest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUser(User user);
    List<Account> findByUserOrUserParent(User user, User parent);
}
