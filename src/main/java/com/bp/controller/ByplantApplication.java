package com.bp.controller;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.bp.controller", "com.bp.service"})
@MapperScan("com.bp.mapper")
public class ByplantApplication {

	public static void main(String[] args) {
		SpringApplication.run(ByplantApplication.class, args);
	}

}
