package com.medivault.dto;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private ProfileResponse user;

    public AuthResponse() {
    }

    public AuthResponse(String token, ProfileResponse user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public ProfileResponse getUser() {
        return user;
    }

    public void setUser(ProfileResponse user) {
        this.user = user;
    }
}
