package com.medivault.controller;

import com.medivault.dto.ShareLinkResponse;
import com.medivault.dto.SharePasswordRequest;
import com.medivault.dto.ShareSummaryDto;
import com.medivault.security.CurrentUser;
import com.medivault.service.ShareService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ShareController {

    private final ShareService shareService;
    private final CurrentUser currentUser;

    public ShareController(ShareService shareService, CurrentUser currentUser) {
        this.shareService = shareService;
        this.currentUser = currentUser;
    }

    @GetMapping("/api/profile/share")
    public ShareLinkResponse myLink() {
        return shareService.getOrCreateLink(currentUser.requireId());
    }

    @PostMapping("/api/profile/share/refresh")
    public ShareLinkResponse refresh() {
        return shareService.rotateLink(currentUser.requireId());
    }

    @PostMapping("/api/profile/share/password")
    public ShareLinkResponse setPassword(@Valid @RequestBody SharePasswordRequest request) {
        return shareService.setPassword(currentUser.requireId(), request);
    }

    @PostMapping("/api/share/{token}/access")
    public ShareSummaryDto publicSummary(
            @PathVariable String token,
            @Valid @RequestBody SharePasswordRequest request
    ) {
        return shareService.getSummary(token, request);
    }
}
