package com.ota.repository;

import com.ota.entity.DeviceUpdateHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DeviceUpdateHistoryRepository extends JpaRepository<DeviceUpdateHistory, Long> {
    List<DeviceUpdateHistory> findByDeviceIdOrderByUpdateTimeDesc(String deviceId);
}

