FROM lon9/docker-alpine-grpc AS build-env
RUN apk add --upgrade apk-tools
RUN echo -e "http://dl-cdn.alpinelinux.org/alpine/v3.12/community\nhttp://dl-cdn.alpinelinux.org/alpine/v3.12/main" > etc/apk/repositories
RUN apk update && apk add build-base pkgconfig "g++>9.0"
RUN g++ --version
ADD /src /src
WORKDIR /src
RUN make

FROM alpine
EXPOSE 80

RUN apk add --no-cache libstdc++
COPY --from=build-env /src/parser_server /usr/bin/
COPY --from=build-env /usr/local/lib /usr/local/lib/
ENTRYPOINT [ "parser_server"]