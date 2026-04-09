package com.ota.controller;

import com.ota.entity.OtaUpdate;
import com.ota.service.OtaUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5000"})
public class FirmwareUploadController {
    
    private static final Logger logger = LoggerFactory.getLogger(FirmwareUploadController.class);
    private static final String STATIC_DIR = "src/main/resources/static/";
    
    @Autowired
    private OtaUpdateService otaUpdateService;
    
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFirmware(
            @RequestParam("file") MultipartFile file,
            @RequestParam("version") String version) {
        Map<String, String> response = new HashMap<>();
        
        try {
            // Create static directory if it doesn't exist
            Path staticPath = Paths.get(STATIC_DIR);
            if (!Files.exists(staticPath)) {
                Files.createDirectories(staticPath);
            }
            
            // Save file as update.zip in static directory
            Path updatePath = staticPath.resolve("update.zip");
            FileUtils.copyInputStreamToFile(file.getInputStream(), updatePath.toFile());
            
            // Create download URL
            String downloadUrl = "http://localhost:8081/static/update.zip";
            
            // Save to database
            OtaUpdate otaUpdate = new OtaUpdate(version, "active", downloadUrl);
            otaUpdateService.saveUpdate(otaUpdate);
            
            response.put("status", "success");
            response.put("message", "Firmware uploaded successfully");
            response.put("version", version);
            response.put("downloadUrl", downloadUrl);
            logger.info("Firmware uploaded: version {} saved to {}", version, updatePath);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.error("Error uploading firmware", e);
            response.put("status", "error");
            response.put("message", "Failed to upload firmware: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

