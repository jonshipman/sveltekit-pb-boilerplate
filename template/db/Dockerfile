FROM alpine:latest

ARG PB_VERSION=0.22.11
ARG TARGETPLATFORM

RUN if [ "$TARGETPLATFORM" = "linux/amd64" ]; then export ARCHITECTURE=amd64; \
    elif [ "$TARGETPLATFORM" = "linux/arm/v7" ]; then export ARCHITECTURE=arm; \
    elif [ "$TARGETPLATFORM" = "linux/arm64" ]; then export ARCHITECTURE=arm64; \
    else export ARCHITECTURE=amd64; fi; \
    echo "export ARCHITECTURE=${ARCHITECTURE}" >> /etc/profile

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    wget && \
    update-ca-certificates

RUN source /etc/profile ; \
    cd /tmp ; \
    wget -O pb.zip https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${ARCHITECTURE}.zip && \
    unzip /tmp/pb.zip -d /pb/ && \
    rm -f /tmp/pb.zip

EXPOSE 80

WORKDIR /pb

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:80"]
