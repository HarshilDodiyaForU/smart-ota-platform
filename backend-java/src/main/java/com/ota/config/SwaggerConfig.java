package com.ota.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Smart OTA Platform API")
                        .version("1.0.0")
                        .description("Over-The-Air update platform API documentation")
                        .contact(new Contact()
                                .name("Smart OTA Platform")
                                .email("support@smartota.com")));
    }
}

