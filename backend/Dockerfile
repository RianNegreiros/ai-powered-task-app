# Stage 1: Build
FROM maven:3.9.12-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# ← Separate dependency download for better layer caching
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# ← Run as non-root user (security best practice)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring

COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080

# ← Explicit JVM flags: faster startup, respects container memory limits
CMD ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
