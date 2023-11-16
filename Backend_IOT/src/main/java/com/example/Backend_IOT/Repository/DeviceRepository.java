package com.example.Backend_IOT.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.Backend_IOT.Model.Device;

public interface DeviceRepository extends JpaRepository<Device, Integer>{

}
