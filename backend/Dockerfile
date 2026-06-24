FROM public.ecr.aws/amazoncorretto/amazoncorretto:17 AS build

WORKDIR /app

COPY . .

RUN chmod +x ./gradlew || true

RUN ./gradlew clean bootJar -x test

FROM public.ecr.aws/amazoncorretto/amazoncorretto:17

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]