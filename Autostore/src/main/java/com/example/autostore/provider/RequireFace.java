package com.example.autostore.provider;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireFace {
    String action();
    /** path variable name chứa resourceId, ví dụ "id" trong /bookings/{id} */
    String resourceParam() default "";
}
