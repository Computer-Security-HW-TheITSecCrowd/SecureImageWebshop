FROM alpine:latest as base
RUN apk update && apk add --no-cache gcc
WORKDIR /app
EXPOSE 80

FROM alpine:latest as build
RUN apk update && apk add --no-cache \ 
    gcc g++ libgcc make git

WORKDIR /src
COPY ./src .
RUN make

FROM base as final
WORKDIR /app
COPY --from=build /src/parser .
ENTRYPOINT ["./parser"]