import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "3.2.5"
	id("io.spring.dependency-management") version "1.1.4"
	kotlin("jvm") version "1.9.23"
	kotlin("plugin.spring") version "1.9.23"
}

group = "it.polito"
version = "0.0.1-SNAPSHOT"

java {
	sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-web")

	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.apache.camel.springboot:camel-spring-boot-starter:4.6.0")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.hibernate.validator:hibernate-validator")

	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")

	implementation("org.apache.camel.springboot:camel-servlet-starter:4.6.0")
	implementation("org.apache.camel:camel-http:4.6.0")
	implementation("org.apache.camel.springboot:camel-jackson-starter:4.5.0")
	implementation("org.apache.camel.springboot:camel-google-mail-starter:4.5.0")
	implementation("org.apache.camel:camel-google-mail:4.5.0")

	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")

	testImplementation("org.apache.camel:camel-test-spring-junit5:4.6.0")
	testImplementation("org.mockito:mockito-core")
	testImplementation("org.jetbrains.kotlin:kotlin-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs += "-Xjsr305=strict"
		jvmTarget = "17"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
