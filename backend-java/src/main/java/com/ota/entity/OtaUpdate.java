package com.ota.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ota_updates")
public class OtaUpdate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String version;
    
    @Column(nullable = false)
    private String status; // "available", "deprecated", "active"
    
    @Column(nullable = false)
    private String downloadUrl;
    
    @Column(nullable = false)
    private LocalDateTime uploadedAt;
    
    public OtaUpdate() {
        this.uploadedAt = LocalDateTime.now();
    }
    
    public OtaUpdate(String version, String status, String downloadUrl) {
        this.version = version;
        this.status = status;
        this.downloadUrl = downloadUrl;
        this.uploadedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
    
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}

