package com.ota.service;

import com.ota.entity.OtaUpdate;
import com.ota.repository.OtaUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class OtaUpdateService {
    
    @Autowired
    private OtaUpdateRepository otaUpdateRepository;
    
    public Optional<OtaUpdate> getLatestUpdate() {
        return otaUpdateRepository.findTopByOrderByUploadedAtDesc();
    }
    
    public List<OtaUpdate> getUpdateHistory(int limit) {
        List<OtaUpdate> allUpdates = otaUpdateRepository.findAllOrderByUploadedAtDesc();
        if (allUpdates.size() <= limit) {
            return allUpdates;
        }
        return allUpdates.subList(0, limit);
    }
    
    @Transactional
    public OtaUpdate saveUpdate(OtaUpdate update) {
        // Mark previous updates as deprecated
        List<OtaUpdate> previousUpdates = otaUpdateRepository.findAll();
        for (OtaUpdate prev : previousUpdates) {
            if (!prev.getVersion().equals(update.getVersion())) {
                prev.setStatus("deprecated");
                otaUpdateRepository.save(prev);
            }
        }
        update.setStatus("active");
        return otaUpdateRepository.save(update);
    }
    
    public Optional<OtaUpdate> findByVersion(String version) {
        return otaUpdateRepository.findByVersion(version);
    }
}

