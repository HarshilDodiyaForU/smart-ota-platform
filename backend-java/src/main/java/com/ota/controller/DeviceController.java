package com.ota.controller;

import com.ota.entity.Device;
import com.ota.entity.DeviceUpdateHistory;
import com.ota.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5000"})
public class DeviceController {
    
    @Autowired
    private DeviceService deviceService;
    
    @GetMapping("/devices")
    public ResponseEntity<List<Device>> getAllDevices() {
        return ResponseEntity.ok(deviceService.getAllDevices());
    }
    
    @GetMapping("/devices/{deviceId}/history")
    public ResponseEntity<List<DeviceUpdateHistory>> getDeviceHistory(@PathVariable String deviceId) {
        return ResponseEntity.ok(deviceService.getDeviceHistory(deviceId));
    }
    
    @PostMapping("/devices/register")
    public ResponseEntity<Device> registerDevice(@RequestBody Map<String, String> request) {
        String deviceId = request.get("deviceId");
        String version = request.get("version");
        Device device = deviceService.getOrCreateDevice(deviceId, version);
        return ResponseEntity.ok(device);
    }
}

