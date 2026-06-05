package kr.or.tacs.common.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface MenuPermission {

    String menuUrl();

    MenuPermissionAction action() default MenuPermissionAction.READ;
}
