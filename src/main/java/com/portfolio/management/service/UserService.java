package com.portfolio.management.service;

import com.portfolio.management.dto.UserCreateDTO;
import com.portfolio.management.dto.UserDTO;
import com.portfolio.management.entity.User;
import com.portfolio.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }
    
    public UserDTO getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(this::convertToDTO)
                .orElse(null);
    }
    
    @Transactional
    public UserDTO createUser(UserCreateDTO userCreateDTO) {
        if (userRepository.existsByUsername(userCreateDTO.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        
        if (userCreateDTO.getEmail() != null && userRepository.existsByEmail(userCreateDTO.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        
        User user = new User();
        user.setUsername(userCreateDTO.getUsername());
        user.setPassword(passwordEncoder.encode(userCreateDTO.getPassword()));
        user.setName(userCreateDTO.getName());
        user.setEmail(userCreateDTO.getEmail());
        
        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }
    
    @Transactional
    public UserDTO updateUser(Long id, UserCreateDTO userCreateDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if username is being changed and if it's already taken
        if (!existingUser.getUsername().equals(userCreateDTO.getUsername()) &&
                userRepository.existsByUsername(userCreateDTO.getUsername())) {
            throw new RuntimeException("Username already taken");
        }
        
        // Check if email is being changed and if it's already in use
        if (userCreateDTO.getEmail() != null && 
                !userCreateDTO.getEmail().equals(existingUser.getEmail()) &&
                userRepository.existsByEmail(userCreateDTO.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        
        existingUser.setUsername(userCreateDTO.getUsername());
        if (userCreateDTO.getPassword() != null && !userCreateDTO.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userCreateDTO.getPassword()));
        }
        existingUser.setName(userCreateDTO.getName());
        existingUser.setEmail(userCreateDTO.getEmail());
        
        User updatedUser = userRepository.save(existingUser);
        return convertToDTO(updatedUser);
    }
    
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
