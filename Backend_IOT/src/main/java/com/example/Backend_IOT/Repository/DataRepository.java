package com.example.Backend_IOT.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.Backend_IOT.Model.DataDevice;

public interface DataRepository extends JpaRepository<DataDevice, Integer>{

}
