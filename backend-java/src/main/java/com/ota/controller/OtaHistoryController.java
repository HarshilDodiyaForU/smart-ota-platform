package com.ota.controller;

import com.ota.entity.OtaUpdate;
import com.ota.service.OtaUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5000"})
public class OtaHistoryController {
    
    @Autowired
    private OtaUpdateService otaUpdateService;
    
    @GetMapping("/history")
    public ResponseEntity<List<OtaUpdate>> getUpdateHistory() {
        List<OtaUpdate> history = otaUpdateService.getUpdateHistory(10);
        return ResponseEntity.ok(history);
    }
}

