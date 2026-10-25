package com.medivault.exception;

public class InvalidSharePasswordException extends RuntimeException {
    public InvalidSharePasswordException() {
        super("Incorrect share password");
    }
}
