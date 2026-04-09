package com.ota.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "devices")
public class Device {
    @Id
    @Column(unique = true, nullable = false)
    private String deviceId;
    
    private String currentVersion;
    private String latestVersion;
    private LocalDateTime lastUpdated;
    private String status; // "up-to-date", "update-available", "updating", "error"
    
    public Device() {}
    
    public Device(String deviceId, String currentVersion) {
        this.deviceId = deviceId;
        this.currentVersion = currentVersion;
        this.latestVersion = currentVersion;
        this.lastUpdated = LocalDateTime.now();
        this.status = "up-to-date";
    }
    
    // Getters and Setters
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    
    public String getCurrentVersion() { return currentVersion; }
    public void setCurrentVersion(String currentVersion) { this.currentVersion = currentVersion; }
    
    public String getLatestVersion() { return latestVersion; }
    public void setLatestVersion(String latestVersion) { this.latestVersion = latestVersion; }
    
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

