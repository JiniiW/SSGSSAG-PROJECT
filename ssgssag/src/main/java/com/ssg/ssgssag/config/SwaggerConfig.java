package com.ssg.ssgssag.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

  @Bean
  public OpenAPI customOpenAPI() {
    return new OpenAPI()
        .info(new Info()
            .title("창고 관리 시스템 API")
            .version("v2")
            .description("이 API 문서는 창고 관리 시스템의 REST API에 대한 설명서입니다.")
            .contact(new Contact()
                .name("김소진")
                .url("https://github.com/JiniiW/SSGSSAG-PROJECT")
                ));
  }



}
