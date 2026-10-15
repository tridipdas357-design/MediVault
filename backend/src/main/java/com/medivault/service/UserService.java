package com.medivault.service;

import com.medivault.dto.ProfileResponse;
import com.medivault.dto.ProfileUpdateRequest;
import com.medivault.exception.ResourceNotFoundException;
import com.medivault.model.User;
import com.medivault.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ProfileResponse getProfile(Long userId) {
        return ProfileResponse.from(requireUser(userId));
    }

    @Transactional
    public ProfileResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = requireUser(userId);
        user.setName(request.getName().trim());
        user.setAge(request.getAge());
        user.setBloodGroup(request.getBloodGroup());
        user.setAllergies(request.getAllergies());
        user.setEmergencyContact(request.getEmergencyContact());
        return ProfileResponse.from(userRepository.save(user));
    }

    public User requireUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
