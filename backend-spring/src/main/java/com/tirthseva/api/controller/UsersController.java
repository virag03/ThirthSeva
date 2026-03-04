package com.tirthseva.api.controller;

import com.tirthseva.api.dto.user.UpdateRoleRequest;
import com.tirthseva.api.dto.user.UserProfileResponse;
import com.tirthseva.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@PreAuthorize("hasRole('Admin')")
@RequiredArgsConstructor
public class UsersController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserProfileResponse>> getAll() {
        List<UserProfileResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getById(@PathVariable Integer id) {
        UserProfileResponse user = userService.getUserById(id);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        boolean result = userService.deleteUser(id);

        if (!result) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Integer id, @RequestBody UpdateRoleRequest request) {
        boolean result = userService.updateUserRole(id, request.getRole());

        if (!result) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User not found or invalid role"));
        }

        return ResponseEntity.ok(Map.of("message", "User role updated successfully"));
    }
}
