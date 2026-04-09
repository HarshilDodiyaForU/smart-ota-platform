FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/test-project-1.0-SNAPSHOT.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]

