package com.tirthseva.api.service;

import com.tirthseva.api.dto.user.UserProfileResponse;
import com.tirthseva.api.entity.User;
import com.tirthseva.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToProfileResponse)
                .collect(Collectors.toList());
    }

    public UserProfileResponse getUserById(Integer id) {
        User user = userRepository.findById(id).orElse(null);
        return user != null ? mapToProfileResponse(user) : null;
    }

    @Transactional
    public boolean deleteUser(Integer id) {
        if (!userRepository.existsById(id)) {
            return false;
        }
        userRepository.deleteById(id);
        return true;
    }

    @Transactional
    public boolean updateUserRole(Integer id, String newRole) {
        // Validate role
        List<String> validRoles = Arrays.asList("User", "ServiceProvider", "Admin");
        if (!validRoles.contains(newRole)) {
            return false;
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return false;
        }

        user.setRole(newRole);
        userRepository.save(user);
        return true;
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .isEmailVerified(user.getIsEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
