package com.example.Backend_IOT.Model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "data")
public class DataDevice {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	private float temp;
	private float hum;
	private float light;
	private String time;
	
	public DataDevice( float temp, float hum, float light, String time) {
		super();
		this.temp = temp;
		this.hum = hum;
		this.light = light;
		this.time = time;
	}

}