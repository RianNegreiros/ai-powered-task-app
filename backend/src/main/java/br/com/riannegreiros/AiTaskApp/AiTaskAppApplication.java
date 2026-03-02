package br.com.riannegreiros.AiTaskApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class AiTaskAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiTaskAppApplication.class, args);
    }

}
