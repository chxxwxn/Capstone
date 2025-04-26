package com.FM.backend.exception;

public class BusinessLogicException extends RuntimeException{

    private final ExceptionCode code;

    public BusinessLogicException(ExceptionCode code){
        super(code.getMessage());
        this.code = code;
    }
    
    public ExceptionCode getCode(){
        return code;
    }
}
