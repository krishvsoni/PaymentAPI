# Stage 1: Build Stage
FROM mongo:4.4.7 AS build

# Create a file with replica set initialization command
RUN echo "rs.initiate();" > /docker-entrypoint-initdb.d/replica-init.js

# Stage 2: Final Stage
FROM mongo:4.4.7

# Copy the replica set initialization file from the build stage
COPY --from=build /docker-entrypoint-initdb.d/replica-init.js /docker-entrypoint-initdb.d/replica-init.js

# Set the CMD instruction for the container
CMD ["--replSet", "rs"]
