package com.familynest.service;

import com.familynest.dto.LoginRequest;
import com.familynest.dto.LoginResponse;
import com.familynest.dto.RegisterRequest;
import com.familynest.dto.UserDto;
import com.familynest.config.JwtUtil;
import com.familynest.model.Account;
import com.familynest.model.User;
import com.familynest.repository.AccountRepository;
import com.familynest.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        final String jwt = jwtUtil.generateToken(userDetails);
        
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        return new LoginResponse(jwt, UserDto.fromEntity(user));
    }

    @Transactional
    public UserDto register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole());

        if (registerRequest.getRole() == User.Role.CHILD && registerRequest.getParentId() != null) {
            User parent = userRepository.findById(registerRequest.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent user not found"));
            
            if (parent.getRole() != User.Role.PARENT) {
                throw new RuntimeException("The specified parent is not a parent account");
            }
            user.setParent(parent);
        }

        User savedUser = userRepository.save(user);

        // Create default account for new user
        Account account = new Account();
        account.setName(registerRequest.getRole() == User.Role.PARENT ? "Main Account" : "Allowance Account");
        account.setBalance(BigDecimal.ZERO);
        account.setUser(savedUser);
        account.setIsParentAccount(registerRequest.getRole() == User.Role.PARENT); // Using our custom method
        
        if (registerRequest.getRole() == User.Role.CHILD && registerRequest.getParentId() != null) {
            // Link to parent's default account
            accountRepository.findByUser(user.getParent())
                    .stream()
                    .findFirst()
                    .ifPresent(account::setParentAccount);
        }
        
        accountRepository.save(account);

        return UserDto.fromEntity(savedUser);
    }

    public UserDto getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserDto::fromEntity)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }
}
