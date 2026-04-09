package com.ota.service;

import com.ota.entity.Device;
import com.ota.entity.DeviceUpdateHistory;
import com.ota.repository.DeviceRepository;
import com.ota.repository.DeviceUpdateHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {
    
    @Autowired
    private DeviceRepository deviceRepository;
    
    @Autowired
    private DeviceUpdateHistoryRepository historyRepository;
    
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }
    
    public Device getOrCreateDevice(String deviceId, String currentVersion) {
        Optional<Device> deviceOpt = deviceRepository.findById(deviceId);
        if (deviceOpt.isPresent()) {
            Device device = deviceOpt.get();
            if (!device.getCurrentVersion().equals(currentVersion)) {
                device.setCurrentVersion(currentVersion);
                device.setLastUpdated(LocalDateTime.now());
                deviceRepository.save(device);
            }
            return device;
        } else {
            Device device = new Device(deviceId, currentVersion);
            return deviceRepository.save(device);
        }
    }
    
    public void updateDeviceVersion(String deviceId, String newVersion) {
        Optional<Device> deviceOpt = deviceRepository.findById(deviceId);
        if (deviceOpt.isPresent()) {
            Device device = deviceOpt.get();
            String oldVersion = device.getCurrentVersion();
            device.setCurrentVersion(newVersion);
            device.setLatestVersion(newVersion);
            device.setLastUpdated(LocalDateTime.now());
            device.setStatus("up-to-date");
            deviceRepository.save(device);
            
            // Record in history
            DeviceUpdateHistory history = new DeviceUpdateHistory(deviceId, oldVersion, newVersion, "success");
            historyRepository.save(history);
        }
    }
    
    public void setLatestVersion(String latestVersion) {
        List<Device> devices = deviceRepository.findAll();
        for (Device device : devices) {
            if (!device.getCurrentVersion().equals(latestVersion)) {
                device.setLatestVersion(latestVersion);
                device.setStatus("update-available");
                deviceRepository.save(device);
            }
        }
    }
    
    public List<DeviceUpdateHistory> getDeviceHistory(String deviceId) {
        return historyRepository.findByDeviceIdOrderByUpdateTimeDesc(deviceId);
    }
}

