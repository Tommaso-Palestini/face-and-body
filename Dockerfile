# ---- Fase 1: Build ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copiamo prima solo il pom.xml per sfruttare la cache Docker sulle dipendenze
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiamo il resto del codice sorgente e buildiamo
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---- Fase 2: Runtime ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiamo solo il jar già costruito dalla fase precedente (l'immagine finale non contiene Maven/JDK)
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]