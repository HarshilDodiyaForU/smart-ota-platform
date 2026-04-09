package com.ota;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.ota.service.DeviceService;
import com.ota.service.OtaUpdateService;
import com.ota.entity.Device;
import com.ota.entity.OtaUpdate;
import java.util.List;
import java.util.Optional;

@SpringBootApplication
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5000"}) // Allow React frontend and Python backend
public class TestProjectApplication {
    private static final Logger logger = LoggerFactory.getLogger(TestProjectApplication.class);
    
    @Autowired
    private DeviceService deviceService;
    
    @Autowired
    private OtaUpdateService otaUpdateService;

    public static void main(String[] args) {
        SpringApplication.run(TestProjectApplication.class, args);
        logger.info("Spring Boot application started!");
    }

    @GetMapping("/")
    public String hello() {
        logger.info("Handling request to /");
        return "Hello from Spring Boot Backend!";
    }

    @GetMapping("/ota")
    public java.util.Map<String, String> getOtaUpdate() {
        logger.info("Handling request to /ota");
        java.util.Map<String, String> response = new java.util.HashMap<>();
        
        // Get latest update from database
        Optional<OtaUpdate> latestUpdate = otaUpdateService.getLatestUpdate();
        if (latestUpdate.isPresent()) {
            OtaUpdate update = latestUpdate.get();
            response.put("status", "update available");
            response.put("version", update.getVersion());
            response.put("downloadUrl", update.getDownloadUrl());
        } else {
            // Default fallback
            response.put("status", "no update");
            response.put("version", "1.0.0");
            response.put("downloadUrl", "http://localhost:8081/static/update.zip");
        }
        return response;
    }

    @GetMapping("/login")
    public ResponseEntity<java.util.Map<String, String>> login(@RequestParam String username, @RequestParam String password) {
        if ("admin".equals(username) && "password".equals(password)) {
            String token = JwtUtil.generateToken(username);
            java.util.Map<String, String> body = new java.util.HashMap<>();
            body.put("token", token);
            return ResponseEntity.ok(body);
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }
}