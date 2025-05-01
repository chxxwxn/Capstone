package com.FM.backend.exception;

public enum ExceptionCode {
    PAY_CANCEL("결제가 취소되었습니다."),
    PAY_FAILED("결제에 실패하였습니다.");

    private final String message;

    ExceptionCode(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
