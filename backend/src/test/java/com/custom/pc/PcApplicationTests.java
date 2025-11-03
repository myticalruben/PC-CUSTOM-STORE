package com.custom.pc;


import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;


@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class PcApplicationTests {

	@Test
	void contextLoads() {
		assertTrue(true);
	}

}

