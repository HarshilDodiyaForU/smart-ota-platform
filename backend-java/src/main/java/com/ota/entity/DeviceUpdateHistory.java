package com.ota.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "device_update_history")
public class DeviceUpdateHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String deviceId;
    private String fromVersion;
    private String toVersion;
    private LocalDateTime updateTime;
    private String status; // "success", "failed", "in-progress"
    
    public DeviceUpdateHistory() {}
    
    public DeviceUpdateHistory(String deviceId, String fromVersion, String toVersion, String status) {
        this.deviceId = deviceId;
        this.fromVersion = fromVersion;
        this.toVersion = toVersion;
        this.updateTime = LocalDateTime.now();
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    
    public String getFromVersion() { return fromVersion; }
    public void setFromVersion(String fromVersion) { this.fromVersion = fromVersion; }
    
    public String getToVersion() { return toVersion; }
    public void setToVersion(String toVersion) { this.toVersion = toVersion; }
    
    public LocalDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(LocalDateTime updateTime) { this.updateTime = updateTime; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

