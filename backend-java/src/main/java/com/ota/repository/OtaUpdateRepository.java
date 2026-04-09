package com.ota.repository;

import com.ota.entity.OtaUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtaUpdateRepository extends JpaRepository<OtaUpdate, Long> {
    Optional<OtaUpdate> findTopByOrderByUploadedAtDesc();
    
    @Query("SELECT o FROM OtaUpdate o ORDER BY o.uploadedAt DESC")
    List<OtaUpdate> findAllOrderByUploadedAtDesc();
    
    Optional<OtaUpdate> findByVersion(String version);
}

