package com.example.Backend_IOT.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class MqttRunner implements ApplicationRunner {
	@Autowired
    private MqttService mqttService;
    @Override
    public void run(ApplicationArguments args) throws Exception { // được sử dụng để chạy MqttService. 
	        mqttService.receiveAndProcessMessage("index"); // nhận các message từ topic index
    }
}