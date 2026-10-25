package com.medivault.dto;

public class ShareLinkResponse {

    private String token;
    private boolean passwordSet;

    public ShareLinkResponse() {
    }

    public ShareLinkResponse(String token, boolean passwordSet) {
        this.token = token;
        this.passwordSet = passwordSet;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean isPasswordSet() {
        return passwordSet;
    }

    public void setPasswordSet(boolean passwordSet) {
        this.passwordSet = passwordSet;
    }
}
