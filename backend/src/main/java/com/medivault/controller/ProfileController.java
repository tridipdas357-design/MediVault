package com.medivault.controller;

import com.medivault.dto.ProfileResponse;
import com.medivault.dto.ProfileUpdateRequest;
import com.medivault.security.CurrentUser;
import com.medivault.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;
    private final CurrentUser currentUser;

    public ProfileController(UserService userService, CurrentUser currentUser) {
        this.userService = userService;
        this.currentUser = currentUser;
    }

    @GetMapping
    public ProfileResponse get() {
        return userService.getProfile(currentUser.requireId());
    }

    @PutMapping
    public ProfileResponse update(@Valid @RequestBody ProfileUpdateRequest request) {
        return userService.updateProfile(currentUser.requireId(), request);
    }
}
