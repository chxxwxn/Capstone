package com.FM.backend.persistence;

import static org.junit.jupiter.api.Assertions.fail;

import java.sql.DriverManager;
import java.sql.Connection;
import org.junit.jupiter.api.Test;

public class JDBCTest {
static {
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	@Test
	public void testConnection() {
		
		try(Connection con = 
				DriverManager.getConnection(
						"jdbc:mysql://localhost:3306/cloth?serverTimezone=Asia/Seoul",
						"root",
						"1234")){
			System.out.println(con);
		} catch (Exception e) {
			fail(e.getMessage());
		}
		
	}
}
