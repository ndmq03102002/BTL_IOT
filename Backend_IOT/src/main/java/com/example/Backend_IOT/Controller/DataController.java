package com.example.Backend_IOT.Controller;

import java.util.List;

import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend_IOT.Model.DataDevice;
import com.example.Backend_IOT.Model.Device;
import com.example.Backend_IOT.Repository.DataRepository;
import com.example.Backend_IOT.Repository.DeviceRepository;
import com.example.Backend_IOT.Service.MqttService;

@RestController
@RequestMapping("/")
public class DataController {

	@Autowired
	MqttService mqttService;
	@Autowired
	private DataRepository repo;
	@Autowired
	private DeviceRepository repo1;
	@CrossOrigin
	@GetMapping("/all")
	public List<DataDevice> getData() {
		List<DataDevice> allData = repo.findAll();
		return allData;
	}
	@CrossOrigin
	@PostMapping("/led")
	public ResponseEntity<String> controlLed(@RequestBody String controlArray) {
		String[] str = controlArray.replaceAll("\"", "").split(",");
		try {
			mqttService.sendMessageAndSaveToDatabase(str[0], str[1]);
		} catch (MqttException e) {
			e.printStackTrace();
		}
		return new ResponseEntity<>(controlArray, HttpStatus.OK);
	}
	@CrossOrigin
	@GetMapping("/status")
	public ResponseEntity<List<Device>> getDeviceStatus() {
		List<Device> deviceStatusList  = repo1.findAll();
		return new ResponseEntity<>(deviceStatusList , HttpStatus.OK);
	}

}
