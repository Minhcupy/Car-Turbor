package com.example.autostore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.example.autostore.repository")
@EnableMongoRepositories(basePackages = "com.example.autostore.repository.mongo")
public class DataRepositoryConfig {}

